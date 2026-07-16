import {
  getLanguageDefinition,
  programmingLanguages,
  type ProgrammingLanguage,
} from '../lib/codeExamples'

interface CodeSnippetProps {
  code: string
  language: ProgrammingLanguage
  onLanguageChange: (language: ProgrammingLanguage) => void
  compact?: boolean
}

export function CodeSnippet({
  code,
  language,
  onLanguageChange,
  compact = false,
}: CodeSnippetProps) {
  const definition = getLanguageDefinition(language)
  const lines = code.split('\n')

  return (
    <div className={`code-snippet ${compact ? 'code-snippet--compact' : ''}`}>
      <div className="code-window__header">
        <span>{definition.fileName}</span>
        <label className="language-selector">
          <span className="sr-only">Lenguaje de programación</span>
          <select
            value={language}
            onChange={(event) => onLanguageChange(event.target.value as ProgrammingLanguage)}
          >
            {programmingLanguages.map((item) => (
              <option key={item.id} value={item.id}>{item.label} · {item.runtime}</option>
            ))}
          </select>
        </label>
      </div>
      <pre aria-label={`Código equivalente en ${definition.label}`}><code>
        {lines.map((line, index) => (
          <span className="code-line" key={`${language}-${index}`}>
            <span className="code-line__number">{index + 1}</span>
            <span>{line || ' '}</span>
          </span>
        ))}
      </code></pre>
    </div>
  )
}
