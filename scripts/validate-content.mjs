import fs from 'node:fs'
import path from 'node:path'
import Ajv from 'ajv'

const content_root = new URL('../src/content/', import.meta.url)
const ajv = new Ajv({ allErrors: true })
for (const kind of ['music', 'study']) {
  const filename = kind === 'music' ? 'categories.json' : 'subjects.json'
  const data = JSON.parse(fs.readFileSync(new URL(`${kind}/${filename}`, content_root), 'utf8'))
  const schema = JSON.parse(fs.readFileSync(new URL(`${kind}/schema.json`, content_root), 'utf8'))
  const validate = ajv.compile(schema)
  if (!validate(data)) throw new Error(`${kind}: ${ajv.errorsText(validate.errors)}`)
  if (kind === 'music') {
    if (new Set(data.map(category => category.id)).size !== data.length) throw new Error('Duplicate music category ID')
  } else {
    const check_files = (value) => {
      if (!value || typeof value !== 'object') return
      if (value.text_file) {
        if (path.basename(value.text_file) !== value.text_file) throw new Error('Text path must stay inside study/')
        const text = fs.readFileSync(new URL(`study/${value.text_file}`, content_root), 'utf8')
        if (!text.trim()) throw new Error(`Empty text: ${value.text_file}`)
      }
      Object.values(value).forEach(check_files)
    }
    check_files(data)
  }
  console.log(`${kind}: schema and references passed`)
}
