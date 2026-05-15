import requests
from bs4 import BeautifulSoup
import pandas as pd
import re
import json
from datetime import datetime
import time

# ============================================================
# 西安房价真实数据爬虫
# 数据源：国家统计局70城 + 西安住建局网签
# 每个数据标注来源URL
# ============================================================

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

# -----------------------
# 1. 国家统计局70城房价指数爬虫
# -----------------------
def crawl_stats_70city(url: str = None):
    """
    爬取国家统计局70城房价指数
    使用英文版页面（结构更稳定）
    """
    # 英文版URL（2026年3月数据，2026年4月17日发布）
    if url is None:
        url = "https://www.stats.gov.cn/english/PressRelease/202604/t20260417_1963354.html"
    
    print(f"[1/2] 爬取国家统计局70城房价指数...")
    print(f"    来源: {url}")
    
    try:
        resp = requests.get(url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, 'html.parser')
        
        # 英文版页面用标准table标签
        tables = soup.find_all('table')
        print(f"    发现 {len(tables)} 个表格")
        
        results = {
            'source_url': url,
            'crawl_time': datetime.now().isoformat(),
            'tables': []
        }
        
        # 表格含义（英文版标准结构）
        table_names = [
            '新房_环比_同比_定基',
            '二手房_环比_同比_定基',
            '新房_分面积_环比_同比_定基',
            '二手房_分面积_环比_同比_定基'
        ]
        
        for idx, table in enumerate(tables[:4]):
            rows = []
            for tr in table.find_all('tr'):
                cells = [td.get_text(strip=True) for td in tr.find_all(['td', 'th'])]
                if cells and any(cells):
                    rows.append(cells)
            
            # 提取西安数据行（英文版城市名: Xi'an，Unicode右单引号U+2019）
            xi_an_row = None
            for row in rows:
                for cell in row:
                    cell_stripped = cell.strip()
                    # Xi'an（含Unicode引号）或 Xian，排除Xiangyang
                    if (('Xi' in cell_stripped or 'xi' in cell_stripped.lower()) 
                        and 'an' in cell_stripped 
                        and 'yang' not in cell_stripped.lower()
                        and len(cell_stripped) <= 8):
                        xi_an_row = row
                        break
                if xi_an_row:
                    break
            
            table_info = {
                'table_index': idx,
                'table_name': table_names[idx] if idx < len(table_names) else f'table_{idx}',
                'total_rows': len(rows),
                'xi_an_data': xi_an_row,
                'sample_rows': rows[:3]
            }
            results['tables'].append(table_info)
            
            if xi_an_row:
                print(f"    ✅ 表格{idx} ({table_info['table_name']}): 西安 = {xi_an_row}")
            else:
                print(f"    ⚠️ 表格{idx} ({table_info['table_name']}): 未找到西安数据")
        
        # 保存原始数据
        with open('stats_70city_raw.json', 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        
        print(f"    ✅ 原始数据已保存: stats_70city_raw.json")
        return results
        
    except Exception as e:
        print(f"    ❌ 爬取失败: {e}")
        return {'error': str(e), 'source_url': url}


# -----------------------
# 2. 西安住建局网签数据爬虫
# -----------------------
def parse_transaction_from_html(url):
    """
    从媒体报道页面解析HTML，提取西安二手房网签数据。
    返回: {'month', 'sets', 'area', 'source_url'} 或 None
    """
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        resp.encoding = resp.apparent_encoding
        soup = BeautifulSoup(resp.text, 'html.parser')
        
        # 1. 先尝试从标题提取月份
        title = soup.title.get_text(strip=True) if soup.title else ''
        title_month = None
        title_match = re.search(r'(\d{1,2})\s*月', title)
        if title_match:
            m = int(title_match.group(1))
            if 1 <= m <= 12:
                title_month = f"2026-{m:02d}"
        
        # 2. 从正文提取数据
        text = soup.get_text(separator='\n', strip=True)
        
        # 提取住宅网签套数和面积
        # 典型格式: "住宅网签备案8643套，面积90.09万平方米"
        sets_match = None
        area_match = None
        context_month = None
        
        for line in text.split('\n'):
            # 找包含"住宅"、"套"的行
            if '住宅' in line and '套' in line:
                # 提取套数（4位数字+套）
                sets_m = re.search(r'(\d{4,5})\s*套', line)
                if sets_m:
                    sets_match = sets_m
                # 从同一行提取面积（优先匹配"建筑面积"或"住宅.*面积"）
                # 避免匹配"全市存量房...面积"的总面积
                area_m = re.search(r'建筑面积\s*(\d+\.?\d*)\s*万平方米', line)
                if not area_m:
                    area_m = re.search(r'住宅.*面积\s*(\d+\.?\d*)\s*万平方米', line)
                if area_m:
                    area_match = area_m
                # 从同一行提取月份上下文
                month_ctx = re.search(r'2026\s*年\s*(\d{1,2})\s*月.*网签', line)
                if month_ctx:
                    context_month = f"2026-{int(month_ctx.group(1)):02d}"
                # 如果两个都找到了，break
                if sets_match and area_match:
                    break
        
        # 3. 确定月份: 优先标题月份，其次上下文月份
        month = title_month or context_month or 'unknown'
        
        if sets_match and area_match:
            return {
                'month': month,
                'residential_sets': int(sets_match.group(1)),
                'area': float(area_match.group(1)),
                'unit': '万㎡',
                'url': url,
                'title': title[:80]
            }
        return None
        
    except Exception as e:
        print(f"    ❌ 解析失败 {url}: {e}")
        return None


def crawl_xa_housing_transaction():
    """
    西安住建局网签数据爬虫。
    从已核实的媒体报道页面解析HTML提取数据，不是硬编码。
    """
    
    # 已核实的媒体报道URL列表
    media_urls = [
        {
            'url': 'https://www.sohu.com/a/983971253_804292',
            'publisher': '搜狐/乐居买房',
            'expected_month': '2026-01'
        },
        {
            'url': 'https://www.sohu.com/a/993267775_804292',
            'publisher': '搜狐/乐居买房',
            'expected_month': '2026-02'
        },
        {
            'url': 'https://m.jiemian.com/article/14220278.html',
            'publisher': '界面新闻',
            'expected_month': '2026-03'
        },
        {
            'url': 'https://www.sohu.com/a/1019885202_220260',
            'publisher': '搜狐/乐居买房',
            'expected_month': '2026-04'
        }
    ]
    
    print(f"\n[2/2] 爬取西安住建局网签数据（从媒体报道页面解析）...")
    
    transaction_data = {
        'source_url': 'https://zjj.xa.gov.cn/zw/zfxxgkml/zwxx/gsgg/fcscjy/',
        'crawl_time': datetime.now().isoformat(),
        'monthly_data': [],
        'note': '数据从媒体报道页面实时解析，原始数据源自西安市住建局公告'
    }
    
    for item in media_urls:
        print(f"    抓取: {item['publisher']} -> {item['url'][:60]}...")
        result = parse_transaction_from_html(item['url'])
        
        if result:
            # 补充发布者信息
            result['publisher'] = item['publisher']
            result['expected_month'] = item['expected_month']
            
            # 验证月份是否匹配
            if result['month'] != item['expected_month']:
                print(f"    ⚠️ 月份不匹配: 期望{item['expected_month']}, 实际{result['month']}")
            
            transaction_data['monthly_data'].append(result)
            print(f"    ✅ {result['month']}: 住宅{result['residential_sets']}套, {result['area']}万㎡ [{item['publisher']}]")
        else:
            print(f"    ❌ 未能从 {item['publisher']} 解析出数据")
        
        time.sleep(1)  # 礼貌延迟
    
    # 保存数据
    with open('xa_housing_transaction.json', 'w', encoding='utf-8') as f:
        json.dump(transaction_data, f, ensure_ascii=False, indent=2)
    
    print(f"    ✅ 网签数据已保存: xa_housing_transaction.json")
    return transaction_data


# -----------------------
# 3. 辅助函数：生成结构化Excel报告
# -----------------------
def generate_excel_report(stats_data, housing_data):
    """生成结构化Excel报告，每个数字标注来源"""
    
    print("\n[3/3] 生成Excel报告...")
    
    with pd.ExcelWriter('西安房价数据_真实来源.xlsx', engine='openpyxl') as writer:
        
        # Sheet 1: 70城房价指数
        if 'tables' in stats_data:
            rows = []
            for t in stats_data['tables']:
                if t.get('xi_an_data'):
                    rows.append({
                        '表格': t['table_name'],
                        '西安数据': ' | '.join(t['xi_an_data']),
                        '来源URL': stats_data.get('source_url', ''),
                        '爬取时间': stats_data.get('crawl_time', '')
                    })
            
            if rows:
                df1 = pd.DataFrame(rows)
                df1.to_excel(writer, sheet_name='70城房价指数', index=False)
                print(f"    ✅ Sheet 1: 70城房价指数 ({len(rows)}条)")
        
        # Sheet 2: 住建局网签数据
        if 'monthly_data' in housing_data:
            rows = []
            for m in housing_data['monthly_data']:
                rows.append({
                    '月份': m.get('month', ''),
                    '住宅网签套数': m.get('residential_sets', ''),
                    '网签面积(万㎡)': m.get('area', ''),
                    '来源媒体': m.get('publisher', ''),
                    '来源URL': m.get('url', ''),
                })
            
            if rows:
                df2 = pd.DataFrame(rows)
                df2.to_excel(writer, sheet_name='住建局网签', index=False)
                print(f"    ✅ Sheet 2: 住建局网签 ({len(rows)}条)")
        
        # Sheet 3: 数据来源索引
        sources = [
            {'数据项': '70城新房价格指数', '来源机构': '国家统计局', 'URL': 'https://www.stats.gov.cn/sj/zxfb/202604/t20260416_1963320.html', '更新频率': '月度'},
            {'数据项': '70城二手房价格指数', '来源机构': '国家统计局', 'URL': 'https://www.stats.gov.cn/sj/zxfb/202604/t20260416_1963320.html', '更新频率': '月度'},
            {'数据项': '二手房网签套数/面积', '来源机构': '西安市住建局', 'URL': 'https://zjj.xa.gov.cn/zw/zfxxgkml/zwxx/gsgg/fcscjy/', '更新频率': '月度'},
        ]
        df3 = pd.DataFrame(sources)
        df3.to_excel(writer, sheet_name='数据来源索引', index=False)
        print(f"    ✅ Sheet 3: 数据来源索引")
    
    print(f"    ✅ 报告已生成: 西安房价数据_真实来源.xlsx")


# -----------------------
# 主程序
# -----------------------
if __name__ == "__main__":
    print("=" * 60)
    print("西安房价真实数据爬虫")
    print("=" * 60)
    
    # 爬取统计局数据
    stats_result = crawl_stats_70city()
    
    # 爬取住建局数据
    housing_result = crawl_xa_housing_transaction()
    
    # 生成报告
    generate_excel_report(stats_result, housing_result)
    
    print("\n" + "=" * 60)
    print("爬取完成。输出文件:")
    print("  - stats_70city_raw.json (统计局原始HTML解析)")
    print("  - xa_housing_transaction.json (住建局网签数据)")
    print("  - 西安房价数据_真实来源.xlsx (结构化报告)")
    print("=" * 60)
