/* Hallmark · knowledge-base-generator v3.3 · interactive-features */
(function() {
'use strict';

/* ===== Navigation Panel ===== */
window.toggleNavPanel = function() {
    var panel = document.getElementById('navPanel');
    if (panel) panel.classList.toggle('show');
};

document.addEventListener('click', function(e) {
    var panel = document.getElementById('navPanel');
    if (!panel || !panel.classList.contains('show')) return;
    var toggleBtn = document.getElementById('navToggleBtn');
    if (toggleBtn && toggleBtn.contains(e.target)) return;
    if (!panel.contains(e.target)) panel.classList.remove('show');
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        var panel = document.getElementById('navPanel');
        if (panel) panel.classList.remove('show');
    }
});

/* ===== Search (XSS-safe) ===== */
function createSearchUI() {
    var box = document.createElement('div');
    box.className = 'search-box';
    var input = document.createElement('input');
    input.type = 'text';
    input.id = 'searchInput';
    input.placeholder = 'Search...';
    input.setAttribute('aria-label', 'Search');
    var searchBtn = document.createElement('button');
    searchBtn.textContent = 'Find';
    searchBtn.setAttribute('aria-label', 'Search');
    searchBtn.addEventListener('click', searchContent);
    var clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear';
    clearBtn.setAttribute('aria-label', 'Clear search');
    clearBtn.addEventListener('click', clearSearch);
    box.appendChild(input);
    box.appendChild(searchBtn);
    box.appendChild(clearBtn);
    document.body.appendChild(box);
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') searchContent();
    });
}

function searchContent() {
    var input = document.getElementById('searchInput');
    if (!input) return;
    var keyword = input.value.trim();
    if (!keyword) return;
    clearSearchHighlights();
    var elements = document.querySelectorAll('.content-card p, .content-card li, .content-card h3, .content-card h4');
    var matchCount = 0;
    var escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var regex = new RegExp('(' + escaped + ')', 'gi');
    elements.forEach(function(el) {
        if (el.textContent.toLowerCase().indexOf(keyword.toLowerCase()) === -1) return;
        var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
        var nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(function(tn) {
            if (!regex.test(tn.textContent)) return;
            regex.lastIndex = 0;
            var frag = document.createDocumentFragment();
            var src = tn.textContent;
            var last = 0;
            var m;
            while ((m = regex.exec(src)) !== null) {
                if (m.index > last) frag.appendChild(document.createTextNode(src.substring(last, m.index)));
                var mark = document.createElement('mark');
                mark.className = 'search-highlight';
                mark.textContent = m[1];
                frag.appendChild(mark);
                last = regex.lastIndex;
                matchCount++;
            }
            if (last < src.length) frag.appendChild(document.createTextNode(src.substring(last)));
            tn.parentNode.replaceChild(frag, tn);
            regex.lastIndex = 0;
        });
    });
    if (matchCount > 0) {
        var first = document.querySelector('.search-highlight');
        if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function clearSearch() {
    clearSearchHighlights();
    var input = document.getElementById('searchInput');
    if (input) input.value = '';
}

function clearSearchHighlights() {
    document.querySelectorAll('.search-highlight').forEach(function(h) {
        var p = h.parentNode;
        p.replaceChild(document.createTextNode(h.textContent), h);
        p.normalize();
    });
}

/* ===== Reading Progress ===== */
function createProgressBar() {
    var bar = document.createElement('div');
    bar.className = 'reading-progress';
    var fill = document.createElement('div');
    fill.className = 'reading-progress-fill';
    fill.setAttribute('role', 'progressbar');
    fill.setAttribute('aria-valuenow', '0');
    fill.setAttribute('aria-valuemin', '0');
    fill.setAttribute('aria-valuemax', '100');
    bar.appendChild(fill);
    document.body.appendChild(bar);
    window.addEventListener('scroll', function() {
        var st = window.pageYOffset || document.documentElement.scrollTop;
        var dh = document.documentElement.scrollHeight - window.innerHeight;
        if (dh <= 0) return;
        var pct = Math.min(100, Math.max(0, (st / dh) * 100));
        fill.style.width = pct + '%';
        fill.setAttribute('aria-valuenow', String(Math.round(pct)));
    }, { passive: true });
}

/* ===== Dark Mode ===== */
function createDarkModeToggle() {
    var navBar = document.querySelector('.nav-bar');
    if (!navBar) {
        var oldBtn = document.querySelector('.nav-menu-btn');
        if (oldBtn) navBar = oldBtn;
    }
    if (!navBar) return;
    var group = navBar.querySelector('.nav-bar-group:last-child');
    if (!group) { group = document.createElement('div'); group.className = 'nav-bar-group'; navBar.appendChild(group); }
    var btn = document.createElement('button');
    btn.className = 'nav-btn';
    btn.id = 'darkModeBtn';
    btn.setAttribute('aria-label', 'Toggle dark mode');
    btn.addEventListener('click', toggleDarkMode);
    group.appendChild(btn);
    if (getStored('kb_darkMode') === 'true') document.body.classList.add('dark-mode');
    updateDarkModeLabel();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    setStored('kb_darkMode', document.body.classList.contains('dark-mode'));
    updateDarkModeLabel();
}

function updateDarkModeLabel() {
    var btn = document.getElementById('darkModeBtn');
    if (btn) btn.textContent = document.body.classList.contains('dark-mode') ? 'Light' : 'Dark';
}

/* ===== Back to Top ===== */
function createBackToTop() {
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.textContent = '^';
    btn.setAttribute('aria-label', 'Back to top');
    btn.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    document.body.appendChild(btn);
    window.addEventListener('scroll', function() {
        btn.style.display = (window.pageYOffset > 400) ? 'flex' : 'none';
    }, { passive: true });
}

/* ===== Font Size ===== */
function createFontControls() {
    var ctrl = document.createElement('div');
    ctrl.className = 'font-controls';
    var aM = document.createElement('button'); aM.textContent = 'A-'; aM.setAttribute('aria-label', 'Decrease font size');
    aM.addEventListener('click', function() { adjustFont(-1); });
    var aR = document.createElement('button'); aR.textContent = 'A'; aR.setAttribute('aria-label', 'Reset font size');
    aR.addEventListener('click', resetFont);
    var aP = document.createElement('button'); aP.textContent = 'A+'; aP.setAttribute('aria-label', 'Increase font size');
    aP.addEventListener('click', function() { adjustFont(1); });
    ctrl.appendChild(aM); ctrl.appendChild(aR); ctrl.appendChild(aP);
    document.body.appendChild(ctrl);
    var saved = getStored('kb_fontSize');
    if (saved) document.documentElement.style.fontSize = saved + 'px';
}

function adjustFont(d) {
    var cur = parseFloat(getComputedStyle(document.documentElement).fontSize);
    var nxt = Math.max(12, Math.min(24, cur + d));
    document.documentElement.style.fontSize = nxt + 'px';
    setStored('kb_fontSize', nxt);
}

function resetFont() {
    document.documentElement.style.fontSize = '16px';
    setStored('kb_fontSize', 16);
}

/* ===== Bookmarks ===== */
function createBookmarkFeature() {
    document.querySelectorAll('.content-card[id]').forEach(function(section) {
        var h2 = section.querySelector('h2');
        if (!h2) return;
        var btn = document.createElement('button');
        btn.className = 'bookmark-btn';
        btn.textContent = '+BM';
        btn.setAttribute('aria-label', 'Bookmark this section');
        btn.addEventListener('click', function() { toggleBookmark(section.id, h2.textContent.replace('+BM', '').replace('BM', '').trim()); });
        h2.style.position = 'relative';
        h2.appendChild(btn);
    });
    renderBookmarkList();
}

function toggleBookmark(id, title) {
    var key = 'kb_bm_' + window.location.pathname;
    var bms = [];
    try { bms = JSON.parse(localStorage.getItem(key) || '[]'); } catch(e) { bms = []; }
    var idx = bms.findIndex(function(b) { return b.id === id; });
    if (idx >= 0) bms.splice(idx, 1);
    else bms.push({ id: id, title: title, url: window.location.href, ts: Date.now() });
    try { localStorage.setItem(key, JSON.stringify(bms)); } catch(e) {}
    updateBookmarkBtns();
    renderBookmarkList();
}

function updateBookmarkBtns() {
    var key = 'kb_bm_' + window.location.pathname;
    var bms = [];
    try { bms = JSON.parse(localStorage.getItem(key) || '[]'); } catch(e) { bms = []; }
    document.querySelectorAll('.bookmark-btn').forEach(function(btn) {
        var card = btn.closest('.content-card');
        if (!card) return;
        var isBm = bms.some(function(b) { return b.id === card.id; });
        btn.classList.toggle('active', isBm);
        btn.textContent = isBm ? 'BM' : '+BM';
    });
}

function renderBookmarkList() {
    var key = 'kb_bm_' + window.location.pathname;
    var bms = [];
    try { bms = JSON.parse(localStorage.getItem(key) || '[]'); } catch(e) { bms = []; }
    var list = document.querySelector('.bookmark-list');
    if (bms.length === 0) { if (list) list.remove(); return; }
    if (!list) { list = document.createElement('div'); list.className = 'bookmark-list'; document.body.appendChild(list); }
    list.innerHTML = '';
    var h4 = document.createElement('h4'); h4.textContent = 'Bookmarks';
    list.appendChild(h4);
    bms.forEach(function(b) {
        var a = document.createElement('a'); a.href = '#' + b.id; a.textContent = b.title;
        list.appendChild(a);
    });
    var clr = document.createElement('button'); clr.textContent = 'Clear all';
    clr.style.cssText = 'margin-top:0.5rem;padding:0.25rem 0.5rem;background:transparent;border:1px solid var(--kb-border);border-radius:var(--kb-radius-sm);cursor:pointer;font-size:0.75rem;color:var(--kb-text-muted);';
    clr.addEventListener('click', function() { localStorage.removeItem(key); updateBookmarkBtns(); renderBookmarkList(); });
    list.appendChild(clr);
}

/* ===== Print ===== */
function createPrintButton() {
    var navBar = document.querySelector('.nav-bar');
    if (!navBar) return;
    var group = navBar.querySelector('.nav-bar-group:last-child');
    if (!group) { group = document.createElement('div'); group.className = 'nav-bar-group'; navBar.appendChild(group); }
    var btn = document.createElement('button');
    btn.className = 'nav-btn print-btn';
    btn.textContent = 'Print';
    btn.setAttribute('aria-label', 'Print page');
    btn.addEventListener('click', function() { window.print(); });
    group.appendChild(btn);
}

/* ===== Accordion ===== */
window.toggleAccordion = function(header) {
    var item = header.closest('.accordion-item');
    if (!item) return;
    var wasActive = item.classList.contains('active');
    var parent = item.closest('.accordion');
    if (parent) parent.querySelectorAll('.accordion-item').forEach(function(el) { el.classList.remove('active'); });
    if (!wasActive) item.classList.add('active');
};

/* ===== Tabs ===== */
window.switchTab = function(btn) {
    var group = btn.closest('.tabs');
    if (!group) return;
    var target = btn.getAttribute('data-tab');
    group.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
    group.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.remove('active'); });
    btn.classList.add('active');
    var panel = group.querySelector('#' + target);
    if (panel) panel.classList.add('active');
};

/* ===== Sidebar Tracking ===== */
function addSidebarTracking() {
    var links = document.querySelectorAll('.sidebar-nav a[href^="#"]');
    if (links.length === 0) return;
    var sections = [];
    links.forEach(function(l) {
        var t = document.querySelector(l.getAttribute('href'));
        if (t) sections.push({ link: l, el: t });
    });
    window.addEventListener('scroll', function() {
        var pos = window.pageYOffset + 120;
        sections.forEach(function(s) {
            var top = s.el.offsetTop;
            var bot = top + s.el.offsetHeight;
            if (pos >= top && pos < bot) {
                links.forEach(function(l) { l.classList.remove('active'); });
                s.link.classList.add('active');
            }
        });
    }, { passive: true });
}

/* ===== Helpers ===== */
function getStored(key) {
    try { return localStorage.getItem(key); } catch(e) { return null; }
}
function setStored(key, val) {
    try { localStorage.setItem(key, val); } catch(e) {}
}

/* ===== Keyboard ===== */
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        var inp = document.getElementById('searchInput');
        if (inp) inp.focus();
    }
    if (e.ctrlKey && e.key === 'd') { e.preventDefault(); toggleDarkMode(); }
});

/* ===== Init ===== */
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        createProgressBar();
        createDarkModeToggle();
        createPrintButton();
        createBackToTop();
        createFontControls();
        createBookmarkFeature();
        createSearchUI();
        addSidebarTracking();
    }, 200);
});

})();
