import { GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth'

export function create_provider(provider_id) {
  if (provider_id === 'google') return new GoogleAuthProvider()
  if (provider_id === 'github') return new GithubAuthProvider()
  throw new Error('Unsupported sign-in provider')
}

export function login_error(code) {
  return {
    'auth/unauthorized-domain': '当前域名未获 Firebase 授权，无法登录。',
    'auth/popup-blocked': '登录窗口被浏览器拦截，请允许本站弹出窗口后重试。',
    'auth/network-request-failed': '无法连接登录服务，请检查网络后重试。',
    'auth/operation-not-allowed': '该登录方式尚未在 Firebase 启用，请联系站主。',
    'auth/account-exists-with-different-credential': '此邮箱已有账号。请先用原来的方式登录，再到“账号管理”绑定另一种登录方式。',
    'auth/credential-already-in-use': '这个登录身份已绑定其他账号，不能直接合并。请使用原账号登录，现有数据不会改动。',
    'auth/provider-already-linked': '当前账号已经绑定了这种登录方式。',
    'auth/requires-recent-login': '请退出后重新登录，再尝试绑定。',
    'auth/user-disabled': '此账号已停用，请联系站主。',
  }[code] || '登录失败，请稍后重试。'
}
