// Firestore 评论系统
(function () {
    'use strict';

    var db = null;
    var currentUser = null;
    var pageId = window.location.pathname;

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function formatTime(ts) {
        if (!ts) return '';
        var d = ts.toDate ? ts.toDate() : new Date(ts);
        var y = d.getFullYear();
        var m = String(d.getMonth() + 1).padStart(2, '0');
        var day = String(d.getDate()).padStart(2, '0');
        var h = String(d.getHours()).padStart(2, '0');
        var min = String(d.getMinutes()).padStart(2, '0');
        return y + '-' + m + '-' + day + ' ' + h + ':' + min;
    }

    function loadFirestore() {
        return new Promise(function (resolve, reject) {
            if (typeof firebase !== 'undefined' && firebase.firestore) {
                resolve();
                return;
            }
            var s = document.createElement('script');
            s.src = 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js';
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }

    // 等待 firebase 和 #comments-section 都就绪
    function waitForReady(callback, retries) {
        retries = retries || 0;
        var container = document.getElementById('comments-section');
        if (container && typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
            callback(container);
            return;
        }
        if (retries > 50) {
            console.error('评论系统初始化超时');
            return;
        }
        setTimeout(function () {
            waitForReady(callback, retries + 1);
        }, 200);
    }

    async function initComments(container) {
        try {
            await loadFirestore();
        } catch (e) {
            console.error('Firestore 加载失败:', e);
            return;
        }

        if (!firebase.apps.length) return;
        db = firebase.firestore();

        firebase.auth().onAuthStateChanged(function (user) {
            currentUser = user;
            renderForm(container);
            loadComments(container);
        });
    }

    function renderForm(container) {
        var formHtml;
        if (currentUser) {
            var name = escapeHtml(currentUser.displayName || currentUser.email || '用户');
            formHtml =
                '<div class="comment-form">' +
                '  <div class="comment-form-user">' +
                (currentUser.photoURL
                    ? '<img class="comment-avatar-sm" src="' + currentUser.photoURL + '" referrerpolicy="no-referrer" />'
                    : '<i class="fas fa-user-circle" style="font-size:1.2rem;color:#999;"></i>') +
                '    <span>' + name + '</span>' +
                '  </div>' +
                '  <textarea id="comment-input" class="comment-input" placeholder="写点什么..." rows="3"></textarea>' +
                '  <button id="comment-submit" class="comment-submit">发表</button>' +
                '</div>';
        } else {
            formHtml = '<div class="comment-login-hint">登录后可评论</div>';
        }

        var listEl = container.querySelector('.comment-list');
        container.innerHTML = '<h3 class="comment-title">评论</h3>' + formHtml +
            '<div class="comment-list" id="comment-list"></div>';

        if (currentUser) {
            document.getElementById('comment-submit').addEventListener('click', submitComment);
            document.getElementById('comment-input').addEventListener('keydown', function (e) {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    submitComment();
                }
            });
        }
    }

    function submitComment() {
        var input = document.getElementById('comment-input');
        var content = input.value.trim();
        if (!content) return;

        var btn = document.getElementById('comment-submit');
        btn.disabled = true;
        btn.textContent = '发送中...';

        db.collection('comments').add({
            page: pageId,
            uid: currentUser.uid,
            displayName: currentUser.displayName || currentUser.email || '用户',
            photoURL: currentUser.photoURL || '',
            content: content,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(function () {
            input.value = '';
            btn.disabled = false;
            btn.textContent = '发表';
        }).catch(function (err) {
            console.error('评论失败:', err);
            alert('评论失败，请重试');
            btn.disabled = false;
            btn.textContent = '发表';
        });
    }

    function loadComments(container) {
        var listEl = container.querySelector('.comment-list') || document.getElementById('comment-list');
        if (!listEl) {
            listEl = document.createElement('div');
            listEl.className = 'comment-list';
            listEl.id = 'comment-list';
            container.appendChild(listEl);
        }

        db.collection('comments')
            .where('page', '==', pageId)
            .orderBy('createdAt', 'asc')
            .onSnapshot(function (snapshot) {
                if (snapshot.empty) {
                    listEl.innerHTML = '<div class="comment-empty">暂无评论</div>';
                    return;
                }
                var html = '';
                snapshot.forEach(function (doc) {
                    var d = doc.data();
                    var avatar = d.photoURL
                        ? '<img class="comment-avatar" src="' + d.photoURL + '" referrerpolicy="no-referrer" />'
                        : '<i class="fas fa-user-circle comment-avatar-icon"></i>';
                    html +=
                        '<div class="comment-item" data-id="' + doc.id + '">' +
                        '  <div class="comment-item-left">' + avatar + '</div>' +
                        '  <div class="comment-item-right">' +
                        '    <div class="comment-meta">' +
                        '      <span class="comment-author">' + escapeHtml(d.displayName || '用户') + '</span>' +
                        '      <span class="comment-time">' + formatTime(d.createdAt) + '</span>' +
                        (currentUser && currentUser.uid === d.uid
                            ? '<button class="comment-delete" data-id="' + doc.id + '"><i class="fas fa-times"></i></button>'
                            : '') +
                        '    </div>' +
                        '    <div class="comment-body">' + escapeHtml(d.content) + '</div>' +
                        '  </div>' +
                        '</div>';
                });
                listEl.innerHTML = html;

                listEl.querySelectorAll('.comment-delete').forEach(function (btn) {
                    btn.addEventListener('click', function () {
                        var id = btn.getAttribute('data-id');
                        if (confirm('确定删除这条评论？')) {
                            db.collection('comments').doc(id).delete().catch(function (err) {
                                console.error('删除失败:', err);
                            });
                        }
                    });
                });
            });
    }

    waitForReady(initComments);
})();
