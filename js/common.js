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
        if (p.includes('/pages/acgn/')) return 'acgn';
        if (p.includes('/pages/music/')) return 'music';
        if (p.includes('/pages/travel/')) return 'travel';
        if (p.includes('/pages/tutoring/')) return 'tutoring';
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

        // Add or update study sections in one place to keep navbar and search in sync.
        const studySections = [
            { label: '408', path: 'pages/study/408/index.html', keywords: '408 计算机 考研 科软 浙软 软微' },
            { label: '408 / 数据结构', path: 'pages/study/408/data-structure/index.html', keywords: '数据结构 data structure' },
            { label: '408 / 计组', path: 'pages/study/408/computer-organization/index.html', keywords: '计组 CPU' },
            { label: '408 / 操作系统', path: 'pages/study/408/os/index.html', keywords: '操作系统 os' },
            { label: '408 / 计网', path: 'pages/study/408/computer-network/index.html', keywords: '计网 网络' },
            { label: '数分高数', path: 'pages/study/math-analysis/index.html', keywords: '数分 高数 微积分 数学分析 极限 导数' },
            { label: '高代线代', path: 'pages/study/linear-algebra/index.html', keywords: '高代 线代 线性代数 矩阵 行列式' },
            { label: '离散数学', path: 'pages/study/discrete-math/index.html', keywords: '离散数学 discrete math' },
            { label: '大学物理', path: 'pages/study/physics/index.html', keywords: '大学物理 物理 电磁学 光学 量子力学' },
            { label: '电路理论', path: 'pages/study/circuit-theory/index.html', keywords: '电路理论 电路' },
            { label: '汇编语言', path: 'pages/study/assembly_language_programming/index.html', keywords: '汇编 汇编语言 8086 指令 x86' },
            { label: '数据库', path: 'pages/study/database/index.html', keywords: '数据库 database sql oceanbase' },
            { label: '密码学', path: 'pages/study/cryptography/index.html', keywords: '密码学 cryptography 信安 信息安全' }
        ];

        const navItems = [
            { key: 'home', label: 'Home', path: 'index.html' },
            {
                key: 'study',
                label: 'Study',
                path: 'pages/study/index.html',
                children: studySections.map(item => ({ label: item.label, path: item.path }))
            },
            {
                key: 'projects',
                label: 'Projects',
                path: 'pages/projects/index.html',
                children: [
                    { label: 'C++ BigHW', path: 'pages/projects/cpp-bighw/index.html' },
                    { label: 'FPGA', path: 'pages/projects/fpga/index.html' },
                    { label: 'GPU', path: 'pages/projects/gpu/index.html' },
                    { label: 'LLM聊天机器人', path: 'pages/projects/qq-bot/index.html' }
                ]
            },
            { key: 'jottings', label: 'Jottings', path: 'pages/jottings/index.html' },
            { key: 'favorites', label: 'Favorites', path: 'pages/favorites/index.html' },
            { key: 'acgn', label: 'ACGN', path: 'pages/acgn/index.html' },
            { key: 'music', label: 'Music', path: 'pages/music/index.html' },
            { key: 'travel', label: 'Travel', path: 'pages/travel/index.html' },
            { key: 'tutoring', label: 'Tutoring', path: 'pages/tutoring/index.html' }
        ];

        const searchIndex = [
            { title: 'Home', path: 'index.html', keywords: '主页 首页 home' },
            { title: 'Study', path: 'pages/study/index.html', keywords: '学习 study 课程 408' },
            ...studySections.map(item => ({
                title: 'Study / ' + item.label,
                path: item.path,
                keywords: item.keywords
            })),
            { title: 'Projects', path: 'pages/projects/index.html', keywords: '项目 projects' },
            { title: 'Projects / C++ BigHW', path: 'pages/projects/cpp-bighw/index.html', keywords: 'cpp c++ bighw 程序设计 程设 高程 oop 沈坚 sj' },
            { title: 'Projects / FPGA', path: 'pages/projects/fpga/index.html', keywords: 'fpga 数字逻辑 verilog oled mp3 zdd mips246' },
            { title: 'Projects / GPU', path: 'pages/projects/gpu/index.html', keywords: 'gpu 并行 gunrock 图' },
            { title: 'Projects / LLM聊天机器人', path: 'pages/projects/qq-bot/index.html', keywords: 'llm 聊天机器人 chatbot astrbot 多平台' },
            { title: 'Music', path: 'pages/music/index.html', keywords: '音乐 music 歌单 eason jj' },
            { title: 'Favorites', path: 'pages/favorites/index.html', keywords: '收藏 favorites 网址' },
            { title: 'Favorites', path: 'pages/favorites/T/index.html', keywords: 't 同济'},
            { title: 'Jottings', path: 'pages/jottings/index.html', keywords: '随笔 jottings' },
            { title: 'Jottings', path: 'pages/jottings/jiqin-fenliu.html', keywords: '济勤 分流' },   
            { title: 'ACGN', path: 'pages/acgn/index.html', keywords: '二次元 动画 游戏 小说 acgn animation game novel 植物大战僵尸 wanna 洲 舟 农 瓦 崩 原 go 铁 绝 劫 铲 穿 斗 鸣 尘 柚 ow 杀 邦 轨 mc 谷 ut 空 茶 蔚 脑 死 以 塞' },
            { title: 'Travel', path: 'pages/travel/index.html', keywords: '旅行 旅游 travel 开元心 行夫 世界' },
            { title: 'Tutoring', path: 'pages/tutoring/index.html', keywords: '家教 tutoring' },
            { title: 'Account', path: 'pages/account/index.html', keywords: '账号 account 个人 昵称 profile 设置' }
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
                  '  <div class="logo"><a href="' + buildHref(siteRoot, 'index.html') + '"><i class="fas fa-meteor"></i><span>Lv Zhu</span></a></div>',
                '  <ul class="nav-menu">' + menuHtml + '</ul>',
                '  <div class="nav-search" id="nav-search">',
                '    <i class="fas fa-magnifying-glass nav-search-icon" aria-hidden="true"></i>',
                '    <input id="nav-search-input" class="nav-search-input" type="search" placeholder="搜索页面..." autocomplete="off" />',
                '    <div id="nav-search-results" class="nav-search-results" role="listbox" aria-label="站点搜索结果"></div>',
                '  </div>',
                '  <div id="auth-section" class="auth-section"></div>',
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
                        const query = searchInput.value.trim().toLowerCase();
                        const easterEggs = {
                            'sujia': '宝宝这素什么东东呀',
                        };
                        
                        if (easterEggs[query]) {
                            event.preventDefault();
                            alert("" + easterEggs[query]);
                            searchInput.value = '';
                            clearResults();
                            return;
                        }

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
            // 在 footer 前插入评论区
            var commentsDiv = document.createElement('div');
            commentsDiv.id = 'comments-section';
            commentsDiv.className = 'comments-section';
            footer.parentNode.insertBefore(commentsDiv, footer);

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

    // 动态加载 Firebase 认证模块
    (function loadAuthScripts() {
        var siteRoot = getSiteRootUrl();
        var scripts = ['js/firebase-config.js', 'js/auth.js', 'js/comments.js'];
        var idx = 0;
        function loadNext() {
            if (idx >= scripts.length) return;
            var s = document.createElement('script');
            s.src = new URL(scripts[idx], siteRoot).href;
            s.onload = function () { idx++; loadNext(); };
            s.onerror = function () { idx++; loadNext(); };
            document.body.appendChild(s);
        }
        loadNext();
    })();
});
