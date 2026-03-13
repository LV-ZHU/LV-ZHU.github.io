document.addEventListener('DOMContentLoaded', () => {
    function getSiteRootUrl() {
        const script = document.querySelector('script[src*="/js/common.js"], script[src$="js/common.js"]');
        if (!script || !script.src) return new URL('./', window.location.href);
        return new URL('../', script.src);
    }

    function buildHref(siteRoot, relativePath) {
        return new URL(relativePath, siteRoot).href;
    }

    function getActiveKey(pathname) {
        const p = pathname.toLowerCase();
        if (p.includes('/pages/study/')) return 'study';
        if (p.includes('/pages/projects/')) return 'projects';
        if (p.includes('/pages/jottings/')) return 'jottings';
        if (p.includes('/pages/favorites/')) return 'favorites';
        if (p.includes('/pages/animation/')) return 'animation';
        if (p.includes('/pages/music/')) return 'music';
        if (p.includes('/pages/game/')) return 'game';
        if (p.includes('/pages/travel/')) return 'travel';
        if (p.includes('/pages/tour/')) return 'tour';
        return 'home';
    }

    function renderSharedNavbarAndFooter() {
        const siteRoot = getSiteRootUrl();
        const activeKey = getActiveKey(window.location.pathname);
        const currentPath = window.location.pathname;

        function isPathActive(path) {
            try {
                const target = new URL(path, siteRoot).pathname.toLowerCase();
                return currentPath.toLowerCase() === target;
            } catch (e) {
                return false;
            }
        }

        const navItems = [
            { key: 'home', label: 'Home', path: 'index.html' },
            {
                key: 'study',
                label: 'Study',
                path: 'pages/study/index.html',
                children: [
                    { label: '408', path: 'pages/study/408/index.html' },
                    { label: '408 / 数据结构', path: 'pages/study/408/data-structure/index.html' },
                    { label: '408 / 计网', path: 'pages/study/408/computer-network/index.html' },
                    { label: '408 / 计组', path: 'pages/study/408/computer-organization/index.html' },
                    { label: '408 / 操作系统', path: 'pages/study/408/os/index.html' },
                    { label: '密码学', path: 'pages/study/cryptography/index.html' },
                    { label: '数据库', path: 'pages/study/database/index.html' },
                    { label: '离散数学', path: 'pages/study/discrete-math/index.html' },
                    { label: '济勤分流', path: 'pages/study/jiqin-fenliu/index.html' }
                ]
            },
            {
                key: 'projects',
                label: 'Projects',
                path: 'pages/projects/index.html',
                children: [
                    { label: 'C++ BigHW', path: 'pages/projects/cpp-bighw/index.html' },
                    { label: 'FPGA', path: 'pages/projects/fpga/index.html' },
                    { label: 'GPU', path: 'pages/projects/gpu/index.html' },
                    { label: 'QQ Bot', path: 'pages/projects/qq-bot/index.html' }
                ]
            },
            { key: 'jottings', label: 'Jottings', path: 'pages/jottings/index.html' },
            { key: 'favorites', label: 'Favorites', path: 'pages/favorites/index.html' },
            { key: 'animation', label: 'Animation', path: 'pages/animation/index.html' },
            { key: 'music', label: 'Music', path: 'pages/music/index.html' },
            { key: 'game', label: 'Game', path: 'pages/game/index.html' },
            { key: 'travel', label: 'Travel', path: 'pages/travel/index.html' },
            { key: 'tour', label: 'Tutoring', path: 'pages/tour/index.html' }
        ];

        const searchIndex = [
            { title: 'Home', path: 'index.html', keywords: '主页 首页 home' },
            { title: 'Study', path: 'pages/study/index.html', keywords: '学习 study 课程 408' },
            { title: 'Study / 408', path: 'pages/study/408/index.html', keywords: '408 计算机考研' },
            { title: 'Study / 数据结构', path: 'pages/study/408/data-structure/index.html', keywords: '数据结构 data structure' },
            { title: 'Study / 计组', path: 'pages/study/408/computer-organization/index.html', keywords: '计组 组成原理' },
            { title: 'Study / 计网', path: 'pages/study/408/computer-network/index.html', keywords: '计网 网络' },
            { title: 'Study / 操作系统', path: 'pages/study/408/os/index.html', keywords: '操作系统 os' },
            { title: 'Study / 离散数学', path: 'pages/study/discrete-math/index.html', keywords: '离散数学 discrete math' },
            { title: 'Study / 济勤分流', path: 'pages/study/jiqin-fenliu/index.html', keywords: '济勤 分流 指北' },
            { title: 'Projects', path: 'pages/projects/index.html', keywords: '项目 projects' },
            { title: 'Projects / C++ BigHW', path: 'pages/projects/cpp-bighw/index.html', keywords: 'cpp c++ bighw' },
            { title: 'Projects / FPGA', path: 'pages/projects/fpga/index.html', keywords: 'fpga 数字逻辑' },
            { title: 'Projects / GPU', path: 'pages/projects/gpu/index.html', keywords: 'gpu 并行' },
            { title: 'Projects / QQ Bot', path: 'pages/projects/qq-bot/index.html', keywords: 'qq bot 机器人' },
            { title: 'Music', path: 'pages/music/index.html', keywords: '音乐 music 歌单' },
            { title: 'Favorites', path: 'pages/favorites/index.html', keywords: '收藏 favorites 网址' },
            { title: 'Jottings', path: 'pages/jottings/index.html', keywords: '随笔 jottings' },
            { title: 'Animation', path: 'pages/animation/index.html', keywords: '动画 animation' },
            { title: 'Game', path: 'pages/game/index.html', keywords: '游戏 game' },
            { title: 'Travel', path: 'pages/travel/index.html', keywords: '旅行 travel' },
            { title: 'Tutoring', path: 'pages/tour/index.html', keywords: '家教 tutoring tour pdf' }
        ].map(item => ({
            title: item.title,
            href: buildHref(siteRoot, item.path),
            searchable: (item.title + ' ' + item.keywords).toLowerCase()
        }));

        const navbar = document.querySelector('.navbar');
        if (navbar) {
            const menuHtml = navItems
                .map(item => {
                    const cls = item.key === activeKey ? 'nav-link active' : 'nav-link';
                    if (!item.children || !item.children.length) {
                        return '<li class="nav-item"><a href="' + buildHref(siteRoot, item.path) + '" class="' + cls + '">' + item.label + '</a></li>';
                    }

                    const childHtml = item.children
                        .map(child => {
                            const childCls = isPathActive(child.path) ? 'dropdown-link active' : 'dropdown-link';
                            return '<a href="' + buildHref(siteRoot, child.path) + '" class="' + childCls + '">' + child.label + '</a>';
                        })
                        .join('');

                    return [
                        '<li class="nav-item nav-dropdown">',
                        '  <a href="' + buildHref(siteRoot, item.path) + '" class="' + cls + '">',
                        '    ' + item.label + ' <i class="fas fa-chevron-down nav-caret"></i>',
                        '  </a>',
                        '  <div class="dropdown-menu">' + childHtml + '</div>',
                        '</li>'
                    ].join('');
                })
                .join('');

            navbar.innerHTML = [
                '<div class="container nav-container">',
                '  <div class="logo"><a href="' + buildHref(siteRoot, 'index.html') + '"><i class="fas fa-code"></i><span>LV-ZHU</span></a></div>',
                '  <ul class="nav-menu">' + menuHtml + '</ul>',
                '  <div class="nav-search" id="nav-search">',
                '    <i class="fas fa-magnifying-glass nav-search-icon" aria-hidden="true"></i>',
                '    <input id="nav-search-input" class="nav-search-input" type="search" placeholder="搜索页面..." autocomplete="off" />',
                '    <div id="nav-search-results" class="nav-search-results" role="listbox" aria-label="站点搜索结果"></div>',
                '  </div>',
                '  <div class="hamburger" id="hamburger"><i class="fas fa-bars"></i></div>',
                '</div>'
            ].join('');

            const searchInput = document.getElementById('nav-search-input');
            const searchResults = document.getElementById('nav-search-results');
            if (searchInput && searchResults) {
                function clearResults() {
                    searchResults.innerHTML = '';
                    searchResults.classList.remove('active');
                }

                function renderResults(query) {
                    const q = query.trim().toLowerCase();
                    if (!q) {
                        clearResults();
                        return;
                    }

                    const results = searchIndex
                        .filter(item => item.searchable.includes(q))
                        .slice(0, 8);

                    if (!results.length) {
                        searchResults.innerHTML = '<div class="nav-search-empty">未找到匹配页面</div>';
                        searchResults.classList.add('active');
                        return;
                    }

                    searchResults.innerHTML = results
                        .map(item => '<a class="nav-search-result" href="' + item.href + '">' + item.title + '</a>')
                        .join('');
                    searchResults.classList.add('active');
                }

                searchInput.addEventListener('input', () => renderResults(searchInput.value));

                searchInput.addEventListener('keydown', event => {
                    if (event.key === 'Enter') {
                        const first = searchResults.querySelector('.nav-search-result');
                        if (first) {
                            event.preventDefault();
                            window.location.href = first.getAttribute('href');
                        }
                    }
                    if (event.key === 'Escape') {
                        clearResults();
                        searchInput.blur();
                    }
                });

                document.addEventListener('click', event => {
                    if (!searchResults.contains(event.target) && event.target !== searchInput) {
                        clearResults();
                    }
                });
            }
        }

        const footer = document.querySelector('.footer');
        if (footer) {
            footer.innerHTML = [
                '<div class="container"><div class="footer-inner">',
                '  <div class="footer-copy">&copy; 2026 LV-ZHU</div>',
                '  <div class="footer-social"><a href="https://github.com/LV-ZHU" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i></a></div>',
                '</div></div>'
            ].join('');
        }
    }

    renderSharedNavbarAndFooter();

    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = hamburger.querySelector('i');
                if (icon) icon.classList.replace('fa-times', 'fa-bars');
            });
        });
    }

    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 10);
        });
    }

    const fadeEls = document.querySelectorAll('.fade-in');
    if (fadeEls.length) {
        const isMusicPage = window.location.pathname.toLowerCase().includes('/pages/music/');
        if (isMusicPage) {
            fadeEls.forEach(el => el.classList.add('visible'));
        }

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.01, rootMargin: '0px 0px -8% 0px' });

        fadeEls.forEach(el => {
            if (!el.classList.contains('visible')) {
                observer.observe(el);
            }
        });
    }

    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});