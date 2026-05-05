// Firebase Auth 模块 - 登录/登出 + UI 渲染
(function () {
    'use strict';

    var firebaseReady = false;

    // 动态加载 Firebase SDK
    function loadScript(src) {
        return new Promise(function (resolve, reject) {
            if (document.querySelector('script[src="' + src + '"]')) {
                resolve();
                return;
            }
            var s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }

    async function initAuth() {
        try {
            await loadScript('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
            await loadScript('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js');

            if (typeof firebase === 'undefined') {
                console.error('Firebase SDK 未加载成功');
                return;
            }

            if (!firebase.apps.length) {
                firebase.initializeApp(FIREBASE_CONFIG);
            }

            firebaseReady = true;
            var auth = firebase.auth();

            auth.onAuthStateChanged(function (user) {
                renderAuthUI(user);
            });
        } catch (e) {
            console.error('Firebase 加载失败:', e);
        }
    }

    function signIn(providerName) {
        if (!firebaseReady) {
            alert('Firebase 正在加载，请稍后再试');
            return;
        }
        var provider;
        if (providerName === 'google') {
            provider = new firebase.auth.GoogleAuthProvider();
        } else if (providerName === 'github') {
            provider = new firebase.auth.GithubAuthProvider();
        }
        if (!provider) return;

        firebase.auth().signInWithPopup(provider).catch(function (err) {
            console.error('登录失败:', err.code, err.message);
            alert('登录失败: ' + err.message);
        });
    }

    function getAccountUrl() {
        var script = document.querySelector('script[src*="/js/auth.js"], script[src$="js/auth.js"]');
        if (!script || !script.src) return './pages/account/index.html';
        var root = new URL('../', script.src);
        return new URL('pages/account/index.html', root).href;
    }

    function renderAuthUI(user) {
        var container = document.getElementById('auth-section');
        if (!container) return;

        if (user) {
            var photoURL = user.photoURL || '';
            var displayName = user.displayName || user.email || '用户';
            var accountUrl = getAccountUrl();

            container.innerHTML =
                '<div class="auth-user">' +
                '  <a href="' + accountUrl + '" class="auth-user-info">' +
                (photoURL
                    ? '<img class="auth-avatar" src="' + photoURL + '" alt="avatar" referrerpolicy="no-referrer" />'
                    : '<i class="fas fa-user-circle auth-avatar-icon"></i>') +
                '    <span class="auth-name">' + displayName + '</span>' +
                '  </a>' +
                '  <button class="auth-logout-btn" id="auth-logout-btn">' +
                '    <i class="fas fa-right-from-bracket"></i>' +
                '  </button>' +
                '</div>';

            document.getElementById('auth-logout-btn').addEventListener('click', function () {
                firebase.auth().signOut().catch(function (err) {
                    console.error('登出失败:', err);
                });
            });
        } else {
            container.innerHTML =
                '<div class="auth-dropdown">' +
                '  <button class="auth-login-btn" id="auth-login-btn">' +
                '    <i class="fas fa-right-to-bracket"></i><span>登录</span>' +
                '  </button>' +
                '  <div class="auth-dropdown-menu" id="auth-dropdown-menu">' +
                '    <button class="auth-provider-btn" data-provider="google">' +
                '      <i class="fab fa-google"></i><span>Google 登录</span>' +
                '    </button>' +
                '    <button class="auth-provider-btn" data-provider="github">' +
                '      <i class="fab fa-github"></i><span>GitHub 登录</span>' +
                '    </button>' +
                '  </div>' +
                '</div>';

            document.getElementById('auth-login-btn').addEventListener('click', function (e) {
                e.stopPropagation();
                var menu = document.getElementById('auth-dropdown-menu');
                menu.classList.toggle('active');
            });

            document.querySelectorAll('.auth-provider-btn').forEach(function (btn) {
                btn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    signIn(btn.getAttribute('data-provider'));
                });
            });

            document.addEventListener('click', function () {
                var menu = document.getElementById('auth-dropdown-menu');
                if (menu) menu.classList.remove('active');
            });
        }
    }

    // 页面加载后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAuth);
    } else {
        initAuth();
    }
})();
