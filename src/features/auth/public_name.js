export function public_name(user, nickname = '') {
  for (const candidate of [nickname, user?.displayName]) {
    const name = typeof candidate === 'string' ? candidate.trim() : ''
    if (name && !/[^\s@]+@[^\s@]+\.[^\s@]+/.test(name)) return name
  }
  return '用户'
}
