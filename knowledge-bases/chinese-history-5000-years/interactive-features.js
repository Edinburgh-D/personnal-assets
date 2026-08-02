/* ===== Knowledge Base Interactive Features v2.0 ===== */

/* ===== Feature 1: Search (XSS-safe) ===== */
function addSearchFeature() {
    var searchBox = document.createElement('div');
    searchBox.className = 'search-box';
    var input = document.createElement('input');
    input.type = 'text';
    input.id = 'searchInput';
    input.placeholder = '搜索关键词...';
    input.setAttribute('aria-label', '搜索');
    var searchBtn = document.createElement('button');
    searchBtn.setAttribute('aria-label', '搜索');
    searchBtn.textContent = '🔍';
    searchBtn.onclick = searchContent;
    var clearBtn = document.createElement('button');
    clearBtn.setAttribute('aria-label', '清除搜索');
    clearBtn.textContent = '✖';
    clearBtn.onclick = clearSearch;
    searchBox.appendChild(input);
    searchBox.appendChild(searchBtn);
    searchBox.appendChild(clearBtn);
    document.body.appendChild(searchBox);

    if (input) {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') searchContent();
        });
    }
}

function searchContent() {
    var input = document.getElementById('searchInput');
    if (!input) return;
    var keyword = input.value.trim();
    if (!keyword) return;
    clearSearch();
    var content = document.querySelectorAll('.content-card p, .content-card li, .content-card h3, .content-card h4');
    var matchCount = 0;
    var escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var regex = new RegExp('(' + escapedKeyword + ')', 'gi');
    content.forEach(function(element) {
        var textContent = element.textContent;
        if (textContent.toLowerCase().includes(keyword.toLowerCase())) {
            var walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
            var textNodes = [];
            while (walker.nextNode()) textNodes.push(walker.currentNode);
            textNodes.forEach(function(textNode) {
                if (regex.test(textNode.textContent)) {
                    var frag = document.createDocumentFragment();
                    var lastIdx = 0;
                    var match;
                    var src = textNode.textContent;
                    regex.lastIndex = 0;
                    while ((match = regex.exec(src)) !== null) {
                        if (match.index > lastIdx) {
                            frag.appendChild(document.createTextNode(src.substring(lastIdx, match.index)));
                        }
                        var mark = document.createElement('mark');
                        mark.className = 'search-highlight';
                        mark.textContent = match[1];
                        frag.appendChild(mark);
                        lastIdx = regex.lastIndex;
                        matchCount++;
                    }
                    if (lastIdx < src.length) {
                        frag.appendChild(document.createTextNode(src.substring(lastIdx)));
                    }
                    textNode.parentNode.replaceChild(frag, textNode);
                }
                regex.lastIndex = 0;
            });
        }
    });
    if (matchCount > 0) {
        var firstMatch = document.querySelector('.search-highlight');
        if (firstMatch) firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function clearSearch() {
    document.querySelectorAll('.search-highlight').forEach(function(h) {
        var parent = h.parentNode;
        parent.replaceChild(document.createTextNode(h.textContent), h);
        parent.normalize();
    });
    var input = document.getElementById('searchInput');
    if (input) input.value = '';
}

/* ===== Feature 2: Progress Tracker ===== */
function addProgressTracker() {
    var progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    var fill = document.createElement('div');
    fill.className = 'progress-fill';
    fill.setAttribute('role', 'progressbar');
    fill.setAttribute('aria-valuenow', '0');
    fill.setAttribute('aria-valuemin', '0');
    fill.setAttribute('aria-valuemax', '100');
    progressBar.appendChild(fill);
    document.body.appendChild(progressBar);
    window.addEventListener('scroll', updateProgress);
}

function updateProgress() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    var progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
    var progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = progress + '%';
        progressFill.setAttribute('aria-valuenow', Math.round(progress));
    }
}

/* ===== Feature 3: Bookmarks ===== */
function addBookmarkFeature() {
    var sections = document.querySelectorAll('.content-card[id]');
    sections.forEach(function(section) {
        var h2 = section.querySelector('h2');
        if (h2) {
            var bookmarkBtn = document.createElement('button');
            bookmarkBtn.className = 'bookmark-btn';
            bookmarkBtn.textContent = '📌 收藏';
            bookmarkBtn.setAttribute('aria-label', '收藏此章节');
            bookmarkBtn.onclick = function() { toggleBookmark(section.id, h2.textContent.replace('📌 收藏', '').replace('📌 已收藏', '').trim()); };
            h2.style.position = 'relative';
            h2.appendChild(bookmarkBtn);
        }
    });
    showBookmarkList();
}

function toggleBookmark(sectionId, sectionTitle) {
    var storageKey = 'kb_bookmarks_' + window.location.pathname;
    var bookmarks = [];
    try { bookmarks = JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch(e) { bookmarks = []; }
    var existingIndex = bookmarks.findIndex(function(b) { return b.id === sectionId; });
    if (existingIndex >= 0) { bookmarks.splice(existingIndex, 1); }
    else { bookmarks.push({ id: sectionId, title: sectionTitle, url: window.location.href, date: new Date().toISOString() }); }
    try { localStorage.setItem(storageKey, JSON.stringify(bookmarks)); } catch(e) {}
    updateBookmarkButtons();
    showBookmarkList();
}

function updateBookmarkButtons() {
    var storageKey = 'kb_bookmarks_' + window.location.pathname;
    var bookmarks = [];
    try { bookmarks = JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch(e) { bookmarks = []; }
    document.querySelectorAll('.bookmark-btn').forEach(function(btn) {
        var card = btn.closest('.content-card');
        if (!card) return;
        var sectionId = card.id;
        var isBookmarked = bookmarks.some(function(b) { return b.id === sectionId; });
        btn.classList.toggle('active', isBookmarked);
        btn.textContent = isBookmarked ? '📌 已收藏' : '📌 收藏';
    });
}

function showBookmarkList() {
    var storageKey = 'kb_bookmarks_' + window.location.pathname;
    var bookmarks = [];
    try { bookmarks = JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch(e) { bookmarks = []; }
    var bookmarkList = document.querySelector('.bookmark-list');
    if (bookmarks.length === 0) { if (bookmarkList) bookmarkList.remove(); return; }
    if (!bookmarkList) { bookmarkList = document.createElement('div'); bookmarkList.className = 'bookmark-list'; document.body.appendChild(bookmarkList); }
    var h4 = document.createElement('h4');
    h4.textContent = '📌 我的收藏';
    bookmarkList.innerHTML = '';
    bookmarkList.appendChild(h4);
    bookmarks.forEach(function(b) {
        var a = document.createElement('a');
        a.href = '#' + b.id;
        a.textContent = b.title;
        bookmarkList.appendChild(a);
    });
    var clearBtn = document.createElement('button');
    clearBtn.textContent = '清除全部';
    clearBtn.style.cssText = 'margin-top:10px;padding:5px 10px;background:#f39c12;color:white;border:none;border-radius:5px;cursor:pointer;font-size:12px;';
    clearBtn.onclick = clearAllBookmarks;
    bookmarkList.appendChild(clearBtn);
}

function clearAllBookmarks() {
    var storageKey = 'kb_bookmarks_' + window.location.pathname;
    localStorage.removeItem(storageKey);
    updateBookmarkButtons();
    showBookmarkList();
}

/* ===== Feature 4: Print ===== */
function addPrintFeature() {
    var navBtn = document.querySelector('.nav-menu-btn');
    if (navBtn) {
        var printBtn = document.createElement('button');
        printBtn.className = 'print-btn';
        printBtn.textContent = '🖨️ 打印';
        printBtn.setAttribute('aria-label', '打印页面');
        printBtn.onclick = function() { window.print(); };
        navBtn.appendChild(printBtn);
    }
}

/* ===== Feature 5: Dark Mode ===== */
function addDarkModeToggle() {
    var navBtn = document.querySelector('.nav-menu-btn');
    if (navBtn) {
        var darkBtn = document.createElement('button');
        darkBtn.className = 'dark-mode-btn';
        darkBtn.id = 'darkModeBtn';
        darkBtn.setAttribute('aria-label', '切换深色模式');
        darkBtn.onclick = toggleDarkMode;
        navBtn.appendChild(darkBtn);
    }
    if (localStorage.getItem('kb_darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    updateDarkModeButtonText();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    var isDark = document.body.classList.contains('dark-mode');
    try { localStorage.setItem('kb_darkMode', isDark); } catch(e) {}
    updateDarkModeButtonText();
}

function updateDarkModeButtonText() {
    var btn = document.getElementById('darkModeBtn');
    if (btn) {
        btn.textContent = document.body.classList.contains('dark-mode') ? '☀️ 浅色模式' : '🌙 深色模式';
    }
}

/* ===== Feature 6: Back to Top ===== */
function addBackToTop() {
    var backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.textContent = '↑';
    backToTop.setAttribute('aria-label', '返回顶部');
    backToTop.onclick = function() { window.scrollTo({ top: 0, behavior: 'smooth' }); };
    document.body.appendChild(backToTop);
    window.addEventListener('scroll', function() {
        backToTop.style.display = window.pageYOffset > 300 ? 'block' : 'none';
    });
}

/* ===== Feature 7: Font Size ===== */
function addFontSizeAdjust() {
    var fontControl = document.createElement('div');
    fontControl.className = 'font-control';

    var btnMinus = document.createElement('button');
    btnMinus.setAttribute('aria-label', '减小字体');
    btnMinus.textContent = 'A-';
    btnMinus.onclick = function() { adjustFontSize(-1); };

    var btnReset = document.createElement('button');
    btnReset.setAttribute('aria-label', '重置字体');
    btnReset.textContent = 'A';
    btnReset.onclick = resetFontSize;

    var btnPlus = document.createElement('button');
    btnPlus.setAttribute('aria-label', '增大字体');
    btnPlus.textContent = 'A+';
    btnPlus.onclick = function() { adjustFontSize(1); };

    fontControl.appendChild(btnMinus);
    fontControl.appendChild(btnReset);
    fontControl.appendChild(btnPlus);
    document.body.appendChild(fontControl);

    var savedSize = localStorage.getItem('kb_fontSize');
    if (savedSize) document.documentElement.style.fontSize = savedSize + 'px';
}

function adjustFontSize(delta) {
    var currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    var newSize = Math.max(12, Math.min(24, currentSize + delta));
    document.documentElement.style.fontSize = newSize + 'px';
    try { localStorage.setItem('kb_fontSize', newSize); } catch(e) {}
}

function resetFontSize() {
    document.documentElement.style.fontSize = '16px';
    try { localStorage.setItem('kb_fontSize', 16); } catch(e) {}
}

/* ===== Feature 8: Accordion ===== */
function toggleAccordion(header) {
    var item = header.closest('.accordion-item');
    if (!item) return;
    var wasActive = item.classList.contains('active');
    var accordion = item.closest('.accordion');
    if (accordion) {
        accordion.querySelectorAll('.accordion-item').forEach(function(el) {
            el.classList.remove('active');
        });
    }
    if (!wasActive) item.classList.add('active');
}

/* ===== Feature 9: Tabs ===== */
function switchTab(btn) {
    var tabGroup = btn.closest('.tabs');
    if (!tabGroup) return;
    var targetPanel = btn.getAttribute('data-tab');
    tabGroup.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
    tabGroup.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.remove('active'); });
    btn.classList.add('active');
    var panel = tabGroup.querySelector('#' + targetPanel);
    if (panel) panel.classList.add('active');
}

/* ===== Feature 10: Sidebar Active State ===== */
function addSidebarTracking() {
    var sidebarLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');
    if (sidebarLinks.length === 0) return;
    var sections = [];
    sidebarLinks.forEach(function(link) {
        var target = document.querySelector(link.getAttribute('href'));
        if (target) sections.push({ link: link, element: target });
    });
    window.addEventListener('scroll', function() {
        var scrollPos = window.pageYOffset + 100;
        sections.forEach(function(s) {
            var top = s.element.offsetTop;
            var bottom = top + s.element.offsetHeight;
            if (scrollPos >= top && scrollPos < bottom) {
                sidebarLinks.forEach(function(l) { l.classList.remove('active'); });
                s.link.classList.add('active');
            }
        });
    });
}

/* ===== Initialize All ===== */
function initAllFeatures() {
    addProgressTracker();
    addDarkModeToggle();
    addPrintFeature();
    addBackToTop();
    addFontSizeAdjust();
    addBookmarkFeature();
    addSearchFeature();
    addSidebarTracking();
}

/* ===== Keyboard Shortcuts ===== */
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        var searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.focus();
    }
    if (e.key === 'Escape') {
        var tooltip = document.getElementById('navMenuTooltip');
        if (tooltip) tooltip.classList.remove('show');
    }
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        toggleDarkMode();
    }
});

/* ===== Auto Init ===== */
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initAllFeatures, 500);
});
