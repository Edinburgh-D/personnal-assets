(() => {
  'use strict';
  const doc = document.documentElement;
  const body = document.body;
  const safeGet = (key) => { try { return localStorage.getItem(key); } catch (_) { return null; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };
  const themeButton = document.querySelector('[data-action="theme"]');
  const updateThemeLabel = () => {
    if (!themeButton) return;
    const dark = doc.dataset.theme === 'dark';
    themeButton.textContent = dark ? '浅色' : '深色';
    themeButton.setAttribute('aria-label', dark ? '切换到浅色模式' : '切换到深色模式');
  };
  updateThemeLabel();
  themeButton?.addEventListener('click', () => {
    const next = doc.dataset.theme === 'dark' ? 'light' : 'dark';
    doc.dataset.theme = next;
    safeSet('kb_darkMode', next);
    updateThemeLabel();
  });

  const menu = document.querySelector('[data-action="menu"]');
  const overlay = document.querySelector('.mobile-overlay');
  const closeNav = () => { body.classList.remove('nav-open'); menu?.setAttribute('aria-expanded', 'false'); };
  menu?.addEventListener('click', () => {
    const open = body.classList.toggle('nav-open');
    menu.setAttribute('aria-expanded', String(open));
  });
  overlay?.addEventListener('click', closeNav);
  document.querySelectorAll('.side-rail a').forEach((link) => link.addEventListener('click', closeNav));

  const progress = document.querySelector('.progress');
  const backTop = document.querySelector('.back-top');
  const updateScroll = () => {
    const total = document.documentElement.scrollHeight - innerHeight;
    const ratio = total > 0 ? scrollY / total : 0;
    if (progress) progress.style.transform = 'scaleX(' + Math.min(1, ratio) + ')';
    backTop?.classList.toggle('is-visible', scrollY > 650);
  };
  addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();
  backTop?.addEventListener('click', () => scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));

  const fontButton = document.querySelector('[data-action="font"]');
  body.classList.toggle('font-large', safeGet('kb_fontLarge') === 'true');
  fontButton?.addEventListener('click', () => {
    const enabled = body.classList.toggle('font-large');
    safeSet('kb_fontLarge', String(enabled));
    fontButton.setAttribute('aria-pressed', String(enabled));
  });

  const bookmark = document.querySelector('[data-action="bookmark"]');
  const bookmarkKey = 'kb_bookmark_' + location.pathname;
  const updateBookmark = () => {
    if (!bookmark) return;
    const saved = safeGet(bookmarkKey) === 'true';
    bookmark.textContent = saved ? '已收藏' : '收藏';
    bookmark.setAttribute('aria-pressed', String(saved));
  };
  updateBookmark();
  bookmark?.addEventListener('click', () => {
    safeSet(bookmarkKey, String(safeGet(bookmarkKey) !== 'true'));
    updateBookmark();
  });

  const search = document.querySelector('[data-search]');
  const results = document.querySelector('[data-search-results]');
  const searchable = [...document.querySelectorAll('main h2, main h3, main p')];
  const clearHits = () => searchable.forEach((el) => el.classList.remove('search-hit'));
  search?.addEventListener('input', () => {
    clearHits();
    const query = search.value.trim().toLocaleLowerCase('zh-CN');
    if (!results) return;
    results.replaceChildren();
    if (query.length < 2) { results.hidden = true; return; }
    const hits = searchable.filter((el) => el.textContent.toLocaleLowerCase('zh-CN').includes(query)).slice(0, 8);
    if (!hits.length) {
      const empty = document.createElement('p');
      empty.textContent = '本页没有找到匹配内容。';
      results.append(empty);
    } else {
      hits.forEach((el, index) => {
        if (!el.id) el.id = 'search-hit-' + index;
        const link = document.createElement('a');
        link.href = '#' + el.id;
        link.textContent = el.textContent.trim().slice(0, 70);
        link.addEventListener('click', () => {
          clearHits();
          el.classList.add('search-hit');
          results.hidden = true;
        });
        results.append(link);
      });
    }
    results.hidden = false;
  });
  document.addEventListener('click', (event) => {
    if (results && !event.target.closest('.search-wrap')) results.hidden = true;
  });
})();