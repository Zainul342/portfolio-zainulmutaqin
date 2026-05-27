import React from 'react'

interface MarkdownProps {
  content: string
}

export function Markdown({ content }: MarkdownProps) {
  // Simple markdown parser to avoid bundle bloat
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []

  let inCodeBlock = false
  let codeBlockLines: string[] = []
  let codeBlockLang = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Code block check
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        const codeContent = codeBlockLines.join('\n')
        elements.push(
          <div key={`code-${i}`} className="my-6 rounded-lg overflow-hidden border border-[#313244] bg-[#11111b] font-mono text-xs shadow-md">
            {/* Terminal bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#313244] bg-[#181825]">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f38ba8]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#f9e2af]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#a6e3a1]" />
              </div>
              <span className="text-[10px] text-[#6c7086]">{codeBlockLang || 'bash'}</span>
            </div>
            <pre className="p-4 overflow-x-auto text-[#a6e3a1] leading-relaxed">
              <code>{codeContent}</code>
            </pre>
          </div>
        )
        codeBlockLines = []
        inCodeBlock = false
      } else {
        // Start of code block
        inCodeBlock = true
        codeBlockLang = line.trim().replace('```', '')
      }
      continue
    }

    if (inCodeBlock) {
      codeBlockLines.push(line)
      continue
    }

    // Heading 1
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={i} className="text-3xl font-extrabold text-[#cdd6f4] mt-8 mb-4 tracking-tight">
          {parseInline(line.slice(2))}
        </h1>
      )
      continue
    }

    // Heading 2
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-xl font-bold text-[#cba6f7] mt-8 mb-3 tracking-tight border-b border-[#313244] pb-1.5">
          {parseInline(line.slice(3))}
        </h2>
      )
      continue
    }

    // Heading 3
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-lg font-bold text-[#89b4fa] mt-6 mb-2">
          {parseInline(line.slice(4))}
        </h3>
      )
      continue
    }

    // List item
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      elements.push(
        <li key={i} className="ml-5 list-disc text-sm text-[#a6adc8] leading-relaxed mb-1.5 pl-1">
          {parseInline(line.trim().slice(2))}
        </li>
      )
      continue
    }

    // Empty line
    if (line.trim() === '') {
      continue
    }

    // Standard paragraph
    elements.push(
      <p key={i} className="text-sm text-[#a6adc8] leading-relaxed mb-4 text-pretty" style={{ lineHeight: 1.7 }}>
        {parseInline(line)}
      </p>
    )
  }

  return <div className="font-sans leading-relaxed">{elements}</div>
}

// Simple parser for bold (**text**) and code (`code`)
function parseInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  let currentText = text
  let keyIndex = 0

  while (currentText.length > 0) {
    const boldIndex = currentText.indexOf('**')
    const codeIndex = currentText.indexOf('`')

    // Find whichever comes first
    if (boldIndex !== -1 && (codeIndex === -1 || boldIndex < codeIndex)) {
      // Add text before bold
      if (boldIndex > 0) {
        parts.push(currentText.slice(0, boldIndex))
      }
      
      const rest = currentText.slice(boldIndex + 2)
      const closingBoldIndex = rest.indexOf('**')
      
      if (closingBoldIndex !== -1) {
        parts.push(
          <strong key={`bold-${keyIndex++}`} className="font-bold text-[#cdd6f4]">
            {rest.slice(0, closingBoldIndex)}
          </strong>
        )
        currentText = rest.slice(closingBoldIndex + 2)
      } else {
        parts.push('**')
        currentText = rest
      }
    } else if (codeIndex !== -1 && (boldIndex === -1 || codeIndex < boldIndex)) {
      // Add text before code
      if (codeIndex > 0) {
        parts.push(currentText.slice(0, codeIndex))
      }
      
      const rest = currentText.slice(codeIndex + 1)
      const closingCodeIndex = rest.indexOf('`')
      
      if (closingCodeIndex !== -1) {
        parts.push(
          <code
            key={`inline-code-${keyIndex++}`}
            className="font-mono text-xs px-1.5 py-0.5 rounded bg-[#11111b] text-[#cba6f7] border border-[#313244]"
          >
            {rest.slice(0, closingCodeIndex)}
          </code>
        )
        currentText = rest.slice(closingCodeIndex + 1)
      } else {
        parts.push('`')
        currentText = rest
      }
    } else {
      // No formatting remains
      parts.push(currentText)
      break
    }
  }

  return parts
}
