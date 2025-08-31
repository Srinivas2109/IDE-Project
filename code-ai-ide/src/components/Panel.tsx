import React, { useState } from 'react'
import { Terminal, AlertCircle, Info, CheckCircle, XCircle, ChevronDown, ChevronRight, Square } from 'lucide-react'
import { useCommandRunner } from '../hooks/useCommandRunner'

interface PanelTab {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  content: React.ReactNode
}

export function Panel() {
  const [activeTab, setActiveTab] = useState('terminal')
  const [isCollapsed, setIsCollapsed] = useState(false)

  const panelTabs: PanelTab[] = [
    {
      id: 'terminal',
      label: 'Terminal',
      icon: Terminal,
      content: <TerminalContent />
    },
    {
      id: 'problems',
      label: 'Problems',
      icon: AlertCircle,
      content: <ProblemsContent />
    },
    {
      id: 'output',
      label: 'Output',
      icon: Info,
      content: <OutputContent />
    },
    {
      id: 'debug',
      label: 'Debug Console',
      icon: CheckCircle,
      content: <DebugContent />
    }
  ]

  if (isCollapsed) {
    return (
      <div className="h-8 bg-ide-panel border-t border-ide-border flex items-center justify-between px-4">
        <span className="text-sm text-ide-text-secondary">Panel</span>
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-1 hover:bg-ide-border rounded transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-ide-text" />
        </button>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Panel Header */}
      <div className="h-8 bg-ide-panel border-t border-ide-border flex items-center justify-between px-4">
        <div className="flex items-center space-x-1">
          {panelTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeTab === tab.id
                  ? 'bg-ide-bg text-ide-text'
                  : 'text-ide-text-secondary hover:text-ide-text hover:bg-ide-bg'
              }`}
            >
              <tab.icon className="w-3 h-3" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 hover:bg-ide-border rounded transition-colors"
        >
          <ChevronDown className="w-4 h-4 text-ide-text" />
        </button>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-hidden">
        {panelTabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  )
}

function TerminalContent() {
  const { runCommand, buildProject, runProject, testProject, lintProject, formatProject, isLoading } = useCommandRunner()
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    'Welcome to Code AI IDE Terminal',
    'Type "help" for available commands',
    '',
    '> '
  ])
  const [currentInput, setCurrentInput] = useState('')
  const [currentDirectory, setCurrentDirectory] = useState<string>('.')

  const handleCommand = async (command: string) => {
    if (!command.trim()) return

    const newOutput = [...terminalOutput, `> ${command}`]

    // Parse command and arguments
    const parts = command.trim().split(' ')
    const cmd = parts[0].toLowerCase()
    const args = parts.slice(1)

    try {
      let result: any = null

      switch (cmd) {
        case 'help':
          newOutput.push('Available commands:')
          newOutput.push('  help                    - Show this help message')
          newOutput.push('  clear                   - Clear terminal')
          newOutput.push('  pwd                     - Show current directory')
          newOutput.push('  cd <path>               - Change directory')
          newOutput.push('  ls                      - List files')
          newOutput.push('  build <lang>            - Build project (typescript, python, rust)')
          newOutput.push('  run <lang>              - Run project (typescript, python, rust)')
          newOutput.push('  test <lang>             - Test project (typescript, python, rust)')
          newOutput.push('  lint <lang>             - Lint project (typescript, python, rust)')
          newOutput.push('  format <lang>           - Format project (typescript, python, rust)')
          newOutput.push('  version                 - Show IDE version')
          newOutput.push('')
          break

        case 'clear':
          setTerminalOutput(['> '])
          return

        case 'pwd':
          newOutput.push(currentDirectory)
          newOutput.push('')
          break

        case 'cd':
          if (args.length === 0) {
            newOutput.push('Usage: cd <path>')
          } else {
            const newPath = args[0]
            if (newPath === '..') {
              const parentPath = currentDirectory.split('/').slice(0, -1).join('/') || '.'
              setCurrentDirectory(parentPath)
              newOutput.push(`Changed directory to: ${parentPath}`)
            } else if (newPath === '.') {
              newOutput.push(`Current directory: ${currentDirectory}`)
            } else {
              const newFullPath = currentDirectory === '.' ? newPath : `${currentDirectory}/${newPath}`
              setCurrentDirectory(newFullPath)
              newOutput.push(`Changed directory to: ${newFullPath}`)
            }
          }
          newOutput.push('')
          break

        case 'ls':
          try {
            const files = await runCommand('dir', [], currentDirectory)
            if (files.success) {
              newOutput.push(files.output)
            } else {
              newOutput.push(`Error: ${files.error}`)
            }
          } catch (error) {
            newOutput.push(`Error listing directory: ${error}`)
          }
          newOutput.push('')
          break

                        case 'build':
                  if (args.length === 0) {
                    newOutput.push('Usage: build <language>')
                    newOutput.push('Supported languages: typescript, python, rust, csharp, java, go')
                    newOutput.push('Example: build typescript')
                  } else {
                    const language = args[0]
                    newOutput.push(`Building ${language} project...`)
                    try {
                      result = await buildProject(language, currentDirectory)
                      if (result.success) {
                        newOutput.push(`✅ Build successful!`)
                        newOutput.push(result.output)
                      } else {
                        newOutput.push(`❌ Build failed: ${result.error}`)
                      }
                    } catch (error) {
                      newOutput.push(`❌ Build error: ${error}`)
                    }
                  }
                  newOutput.push('')
                  break

        case 'run':
          if (args.length === 0) {
            newOutput.push('Usage: run <language>')
            newOutput.push('Supported languages: typescript, python, rust')
          } else {
            const language = args[0]
            newOutput.push(`Running ${language} project...`)
            result = await runProject(language, currentDirectory)
            if (result.success) {
              newOutput.push(`✅ Project started successfully!`)
              newOutput.push(result.output)
            } else {
              newOutput.push(`❌ Failed to run project: ${result.error}`)
            }
          }
          newOutput.push('')
          break

        case 'test':
          if (args.length === 0) {
            newOutput.push('Usage: test <language>')
            newOutput.push('Supported languages: typescript, python, rust')
          } else {
            const language = args[0]
            newOutput.push(`Testing ${language} project...`)
            result = await testProject(language, currentDirectory)
            if (result.success) {
              newOutput.push(`✅ Tests completed successfully!`)
              newOutput.push(result.output)
            } else {
              newOutput.push(`❌ Tests failed: ${result.error}`)
            }
          }
          newOutput.push('')
          break

        case 'lint':
          if (args.length === 0) {
            newOutput.push('Usage: lint <language>')
            newOutput.push('Supported languages: typescript, python, rust')
          } else {
            const language = args[0]
            newOutput.push(`Linting ${language} project...`)
            result = await lintProject(language, currentDirectory)
            if (result.success) {
              newOutput.push(`✅ Linting completed successfully!`)
              newOutput.push(result.output)
            } else {
              newOutput.push(`❌ Linting failed: ${result.error}`)
            }
          }
          newOutput.push('')
          break

        case 'format':
          if (args.length === 0) {
            newOutput.push('Usage: format <language>')
            newOutput.push('Supported languages: typescript, python, rust')
          } else {
            const language = args[0]
            newOutput.push(`Formatting ${language} project...`)
            result = await formatProject(language, currentDirectory)
            if (result.success) {
              newOutput.push(`✅ Formatting completed successfully!`)
              newOutput.push(result.output)
            } else {
              newOutput.push(`❌ Formatting failed: ${result.error}`)
            }
          }
          newOutput.push('')
          break

        case 'version':
          newOutput.push('Code AI IDE v0.1.0')
          newOutput.push('')
          break

        default:
          // Try to run as a system command
          try {
            newOutput.push(`Executing: ${command}`)
            result = await runCommand(cmd, args, currentDirectory)
            if (result.success) {
              newOutput.push(result.output)
            } else {
              newOutput.push(`Command failed: ${result.error}`)
            }
          } catch (error) {
            newOutput.push(`Command not found: ${cmd}`)
            newOutput.push('Type "help" for available commands')
          }
          newOutput.push('')
      }
    } catch (error) {
      newOutput.push(`Error: ${error}`)
      newOutput.push('')
    }

    newOutput.push('> ')
    setTerminalOutput(newOutput)
    setCurrentInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(currentInput)
    }
  }

  return (
    <div className="h-full bg-ide-bg p-4 font-mono text-sm">
      {/* Terminal Toolbar */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-ide-border">
        <span className="text-xs text-ide-text-secondary">
          Current Directory: {currentDirectory}
        </span>
        <div className="flex items-center space-x-2">
          {isLoading && (
            <div className="flex items-center space-x-2 text-ide-accent">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-ide-accent"></div>
              <span className="text-xs">Running...</span>
            </div>
          )}
          <button
            onClick={() => setTerminalOutput(['> '])}
            className="p-1 hover:bg-ide-panel rounded text-ide-text-secondary hover:text-ide-text"
            title="Clear Terminal"
          >
            <Square className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="h-full overflow-y-auto ide-scrollbar">
        {terminalOutput.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap text-ide-text">
            {line}
          </div>
        ))}
        <input
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="bg-transparent text-ide-text outline-none border-none w-full"
          autoFocus
          placeholder="Type a command..."
        />
      </div>
    </div>
  )
}

function ProblemsContent() {
  const problems = [
    { severity: 'error', message: 'Cannot find module \'./components/Header\'', file: 'src/App.tsx', line: 5 },
    { severity: 'warning', message: 'Unused variable \'unusedVar\'', file: 'src/components/Sidebar.tsx', line: 23 },
    { severity: 'info', message: 'Consider using const instead of let', file: 'src/contexts/IDEContext.tsx', line: 45 }
  ]

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return <XCircle className="w-4 h-4 text-ide-error" />
      case 'warning': return <AlertCircle className="w-4 h-4 text-ide-warning" />
      case 'info': return <Info className="w-4 h-4 text-ide-info" />
      default: return <Info className="w-4 h-4 text-ide-text-secondary" />
    }
  }

  return (
    <div className="h-full bg-ide-bg p-4">
      <div className="space-y-2">
        {problems.map((problem, index) => (
          <div key={index} className="flex items-start space-x-3 p-2 hover:bg-ide-panel rounded cursor-pointer">
            {getSeverityIcon(problem.severity)}
            <div className="flex-1 min-w-0">
              <div className="text-ide-text text-sm">{problem.message}</div>
              <div className="text-ide-text-secondary text-xs mt-1">
                {problem.file}:{problem.line}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OutputContent() {
  const output = [
    { type: 'info', message: 'Starting TypeScript compilation...', timestamp: '10:30:15' },
    { type: 'success', message: 'TypeScript compilation completed successfully', timestamp: '10:30:18' },
    { type: 'info', message: 'Starting build process...', timestamp: '10:30:19' },
    { type: 'success', message: 'Build completed successfully', timestamp: '10:30:22' }
  ]

  return (
    <div className="h-full bg-ide-bg p-4">
      <div className="space-y-2">
        {output.map((item, index) => (
          <div key={index} className="flex items-center space-x-3 text-sm">
            <span className="text-ide-text-secondary text-xs w-16">{item.timestamp}</span>
            <span className={`${
              item.type === 'success' ? 'text-ide-success' : 'text-ide-info'
            }`}>
              {item.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DebugContent() {
  return (
    <div className="h-full bg-ide-bg p-4">
      <div className="text-center text-ide-text-secondary">
        <CheckCircle className="w-8 h-8 mx-auto mb-2" />
        <p>Debug console will appear here when debugging</p>
        <p className="text-xs mt-1">Start debugging to see output</p>
      </div>
    </div>
  )
}
