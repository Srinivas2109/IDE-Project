import { useRef } from 'react'
import Editor from '@monaco-editor/react'
import { File } from '../contexts/IDEContext'

interface MonacoEditorProps {
  file: File
  onChange: (content: string) => void
}

export function MonacoEditor({ file, onChange }: MonacoEditorProps) {
  const editorRef = useRef<any>(null)

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor
    
    // Configure editor options
    editor.updateOptions({
      minimap: { enabled: true },
      fontSize: 14,
      fontFamily: 'Consolas, Monaco, Courier New, monospace',
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      wordWrap: 'on',
      theme: 'vs-dark',
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      smoothScrolling: true,
      mouseWheelZoom: true,
    })

                // Set up auto-save on content change
            editor.onDidChangeModelContent(() => {
              const content = editor.getValue()
              onChange(content)
              
              // Mark file as modified
              if (file.content !== content) {
                // Dispatch to IDE context to mark file as modified
                // This will be handled by the parent component
              }
            })

                // Set up keyboard shortcuts
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
              console.log('Save triggered via Ctrl+S')
              // Save logic would go here
            })

            // Add more shortcuts
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
              editor.getAction('actions.find').run()
            })

            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyH, () => {
              editor.getAction('editor.action.startFindReplaceAction').run()
            })

            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyD, () => {
              editor.getAction('editor.action.selectHighlights').run()
            })

    // Set up language-specific configurations
              const language = file.language || getLanguageFromExtension(file.name)
          if (language) {
            configureLanguage(monaco, language)
            // Set the editor language
            monaco.editor.setModelLanguage(editor.getModel()!, language)
          }
  }

  const getLanguageFromExtension = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase()
    const languageMap: { [key: string]: string } = {
      'ts': 'typescript',
      'tsx': 'typescript',
      'js': 'javascript',
      'jsx': 'javascript',
      'py': 'python',
      'cs': 'csharp',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'rs': 'rust',
      'go': 'go',
      'php': 'php',
      'rb': 'ruby',
      'sql': 'sql',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'json': 'json',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml',
      'md': 'markdown',
    }
    return languageMap[ext || ''] || 'plaintext'
  }

  const configureLanguage = (monaco: any, language: string) => {
    // Configure language-specific settings
    switch (language) {
      case 'typescript':
      case 'javascript':
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
          target: monaco.languages.typescript.ScriptTarget.ES2020,
          allowNonTsExtensions: true,
          moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
          module: monaco.languages.typescript.ModuleKind.CommonJS,
          noEmit: true,
          esModuleInterop: true,
          jsx: monaco.languages.typescript.JsxEmit.React,
          reactNamespace: "React",
          allowJs: true,
          typeRoots: ["node_modules/@types"]
        })
        break
      
      case 'python':
        // Python-specific configurations
        break
      
      case 'csharp':
        // C# specific configurations
        break
      
      default:
        break
    }
  }

  const beforeMount = (monaco: any) => {
    // Configure global Monaco settings
    monaco.editor.defineTheme('vs-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: 'C586C0' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'type', foreground: '4EC9B0' },
        { token: 'function', foreground: 'DCDCAA' },
        { token: 'variable', foreground: '9CDCFE' },
      ],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#cccccc',
        'editor.lineHighlightBackground': '#2d2d30',
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#3a3d41',
        'editorCursor.foreground': '#aeafad',
        'editorWhitespace.foreground': '#3e3e42',
        'editorIndentGuide.background': '#3e3e42',
        'editor.selectionHighlightBorder': '#264f78',
      }
    })
  }

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        defaultLanguage={getLanguageFromExtension(file.name)}
        defaultValue={file.content}
        theme="vs-dark"
        onMount={handleEditorDidMount}
        beforeMount={beforeMount}
        options={{
          automaticLayout: true,
          minimap: { enabled: true },
          fontSize: 14,
          fontFamily: 'Consolas, Monaco, Courier New, monospace',
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          mouseWheelZoom: true,
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          tabCompletion: 'on',
          wordBasedSuggestions: 'currentDocument',
          parameterHints: {
            enabled: true,
            cycle: true,
          },
          hover: {
            enabled: true,
            delay: 300,
          },
          quickSuggestions: {
            other: true,
            comments: true,
            strings: true,
          },
          suggest: {
            insertMode: 'replace',
            showKeywords: true,
            showSnippets: true,
            showClasses: true,
            showFunctions: true,
            showVariables: true,
            showConstants: true,
            showEnums: true,
            showModules: true,
            showProperties: true,
            showEvents: true,
            showOperators: true,
            showUnits: true,
            showValues: true,
            showColors: true,
            showFiles: true,
            showReferences: true,
            showFolders: true,
            showTypeParameters: true,
            showWords: true,
            showUsers: true,
            showIssues: true,
          },
        }}
      />
    </div>
  )
}
