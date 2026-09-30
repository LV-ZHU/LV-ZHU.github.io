import subjects from '../content/study/subjects.json'

export { default as aiExamText } from '../content/study/ai_exam_text.md?raw'
export { default as algorithmExamText } from '../content/study/algorithm_exam_text.md?raw'
export { default as coExamText } from '../content/study/co_exam_text.md?raw'
export { default as cryptoExamText } from '../content/study/crypto_exam_text.md?raw'
export { default as databaseExamText } from '../content/study/database_exam_text.md?raw'
export { default as dmExamText } from '../content/study/dm_exam_text.md?raw'
export { default as dsExamText } from '../content/study/ds_exam_text.md?raw'
export { default as securityMathExamText } from '../content/study/security_math_exam_text.md?raw'

const exam_texts = import.meta.glob('../content/study/*.md', { query: '?raw', import: 'default', eager: true })

function hydrate_content(value) {
  if (Array.isArray(value)) return value.map(hydrate_content)
  if (!value || typeof value !== 'object') return value
  return Object.fromEntries(Object.entries(value).map(([key, item]) =>
    key === 'text_file' ? ['text', exam_texts[`../content/study/${item}`]] : [key, hydrate_content(item)]
  ))
}

export const subjectData = hydrate_content(subjects)
