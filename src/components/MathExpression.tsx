import katex from 'katex'

interface MathExpressionProps {
  expression: string
  display?: boolean
  label?: string
}

export function MathExpression({
  expression,
  display = false,
  label = 'Expresión matemática',
}: MathExpressionProps) {
  const markup = katex.renderToString(expression, {
    displayMode: display,
    throwOnError: false,
    output: 'html',
  })

  return (
    <span
      className={display ? 'math-expression math-expression--display' : 'math-expression'}
      aria-label={label}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  )
}
