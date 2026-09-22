export function is_typing_key(key) {
  return /^[a-z0-9]$/i.test(key)
}

export function advance_typing(word, index, combo, key) {
  if (key.toLowerCase() !== word[index]?.toLowerCase()) {
    return { index, combo: 0, score: 0, complete: false, correct: false }
  }
  let next_index = index + 1
  while (word[next_index] === ' ') next_index++
  const complete = next_index >= word.length
  return { index: next_index, combo: combo + 1, score: 10 + Math.floor(combo / 5) * 5 + (complete ? 50 : 0), complete, correct: true }
}
