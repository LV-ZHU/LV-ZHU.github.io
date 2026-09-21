// Invalid or unavailable storage must not be repaired by overwriting user data.
export function read_record(key, fallback = {}, storage) {
  try {
    storage ??= globalThis.localStorage
    const value = JSON.parse(storage.getItem(key) || 'null')
    return value && typeof value === 'object' && !Array.isArray(value) ? value : fallback
  } catch {
    return fallback
  }
}

export function write_record(key, value, storage) {
  try {
    storage ??= globalThis.localStorage
    const raw = storage.getItem(key)
    if (raw !== null) {
      const previous = JSON.parse(raw)
      if (!previous || typeof previous !== 'object' || Array.isArray(previous)) return false
    }
    storage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}
