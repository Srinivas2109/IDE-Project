import React, { useState, useEffect } from 'react'
import { Search, Command, FileText, Settings, Play, Bug, Zap, Folder, GitBranch, FolderOpen, Save } from 'lucide-react'
import { useIDE } from '../contexts/IDEContext'
import { useFileSystem } from '../hooks/useFileSystem'
import { useCommandRunner } from '../hooks/useCommandRunner'

interface CommandItem {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void
  keywords: string[]
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { state, dispatch } = useIDE()
  const { openFile, saveFile, createFile, createDirectory } = useFileSystem()
  const { buildProject, runProject, testProject, lintProject, formatProject } = useCommandRunner()

  const commands: CommandItem[] = [
    {
      id: 'open-file',
      title: 'Open File',
      description: 'Open a file from the file system',
      icon: FolderOpen,
      action: async () => {
        try {
          const file = await openFile()
          if (file) {
            // Check if file is already open
            const existingFile = state.files.find(f => f.path === file.path)
            if (existingFile) {
              // Switch to existing tab
              const existingTab = state.tabs.find(t => t.fileId === existingFile.id)
              if (existingTab) {
                dispatch({ type: 'SET_ACTIVE_TAB', payload: existingTab.id })
                setIsOpen(false)
                return
              }
            }

            // Add new file and tab
            dispatch({ type: 'OPEN_FILE', payload: file })
            
            const newTab = {
              id: `tab-${Date.now()}`,
              fileId: file.id,
              isActive: false
            }
            dispatch({ type: 'CREATE_TAB', payload: newTab })
            dispatch({ type: 'SET_ACTIVE_TAB', payload: newTab.id })
          }
        } catch (error) {
          console.error('Failed to open file:', error)
        }
        setIsOpen(false)
      },
      keywords: ['open', 'file', 'open file', 'openfile', 'browse']
    },
    {
      id: 'new-file',
      title: 'New File',
      description: 'Create a new file',
      icon: FileText,
      action: async () => {
        const fileName = prompt('Enter file name:')
        if (fileName) {
          try {
            const success = await createFile('.', fileName)
            if (success) {
              console.log('File created successfully')
            } else {
              console.error('Failed to create file')
            }
          } catch (error) {
            console.error('Error creating file:', error)
          }
        }
        setIsOpen(false)
      },
      keywords: ['new', 'file', 'new file', 'newfile', 'create', 'add']
    },
    {
      id: 'new-folder',
      title: 'New Folder',
      description: 'Create a new folder',
      icon: Folder,
      action: async () => {
        const folderName = prompt('Enter folder name:')
        if (folderName) {
          try {
            const success = await createDirectory('.', folderName)
            if (success) {
              console.log('Folder created successfully')
            } else {
              console.error('Failed to create folder')
            }
          } catch (error) {
            console.error('Error creating folder:', error)
          }
        }
        setIsOpen(false)
      },
      keywords: ['new', 'folder', 'new folder', 'newfolder', 'create', 'add', 'directory']
    },
    {
      id: 'save-file',
      title: 'Save File',
      description: 'Save the current file',
      icon: Save,
      action: async () => {
        const activeFile = state.files.find(f => f.isOpen && f.id === state.activeTabId)
        if (activeFile) {
          try {
            const success = await saveFile(activeFile.path, activeFile.content)
            if (success) {
              dispatch({ type: 'SAVE_FILE', payload: { id: activeFile.id, content: activeFile.content } })
              console.log('File saved successfully')
            } else {
              console.error('Failed to save file')
            }
          } catch (error) {
            console.error('Error saving file:', error)
          }
        } else {
          console.log('No active file to save')
        }
        setIsOpen(false)
      },
      keywords: ['save', 'file', 'save file', 'savefile', 'write', 'store']
    },
    {
      id: 'build-project',
      title: 'Build Project',
      description: 'Build the current project',
      icon: Command,
      action: async () => {
        const language = prompt('Enter language (typescript, python, rust):')
        if (language) {
          try {
            const result = await buildProject(language, '.')
            if (result.success) {
              console.log('Build successful:', result.output)
            } else {
              console.error('Build failed:', result.error)
            }
          } catch (error) {
            console.error('Error building project:', error)
          }
        }
        setIsOpen(false)
      },
      keywords: ['build', 'compile', 'make', 'project', 'typescript', 'python', 'rust']
    },
    {
      id: 'run-project',
      title: 'Run Project',
      description: 'Run the current project',
      icon: Play,
      action: async () => {
        const language = prompt('Enter language (typescript, python, rust):')
        if (language) {
          try {
            const result = await runProject(language, '.')
            if (result.success) {
              console.log('Project started:', result.output)
            } else {
              console.error('Failed to run project:', result.error)
            }
          } catch (error) {
            console.error('Error running project:', error)
          }
        }
        setIsOpen(false)
      },
      keywords: ['run', 'execute', 'play', 'start', 'project', 'typescript', 'python', 'rust']
    },
    {
      id: 'test-project',
      title: 'Test Project',
      description: 'Run tests for the current project',
      icon: Bug,
      action: async () => {
        const language = prompt('Enter language (typescript, python, rust):')
        if (language) {
          try {
            const result = await testProject(language, '.')
            if (result.success) {
              console.log('Tests completed:', result.output)
            } else {
              console.error('Tests failed:', result.error)
            }
          } catch (error) {
            console.error('Error running tests:', error)
          }
        }
        setIsOpen(false)
      },
      keywords: ['test', 'testing', 'run tests', 'test project', 'typescript', 'python', 'rust']
    },
    {
      id: 'lint-project',
      title: 'Lint Project',
      description: 'Lint the current project',
      icon: Command,
      action: async () => {
        const language = prompt('Enter language (typescript, python, rust):')
        if (language) {
          try {
            const result = await lintProject(language, '.')
            if (result.success) {
              console.log('Linting completed:', result.output)
            } else {
              console.error('Linting failed:', result.error)
            }
          } catch (error) {
            console.error('Error linting project:', error)
          }
        }
        setIsOpen(false)
      },
      keywords: ['lint', 'linter', 'linting', 'check', 'typescript', 'python', 'rust']
    },
    {
      id: 'format-project',
      title: 'Format Project',
      description: 'Format the current project',
      icon: Command,
      action: async () => {
        const language = prompt('Enter language (typescript, python, rust):')
        if (language) {
          try {
            const result = await formatProject(language, '.')
            if (result.success) {
              console.log('Formatting completed:', result.output)
            } else {
              console.error('Formatting failed:', result.error)
            }
          } catch (error) {
            console.error('Error formatting project:', error)
          }
        }
        setIsOpen(false)
      },
      keywords: ['format', 'formatter', 'formatting', 'beautify', 'typescript', 'python', 'rust']
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant',
      description: 'Open AI coding assistant',
      icon: Zap,
      action: () => {
        console.log('Opening AI assistant...')
        setIsOpen(false)
      },
      keywords: ['ai', 'assistant', 'help', 'code', 'suggest', 'intellisense']
    },
    {
      id: 'toggle-sidebar',
      title: 'Toggle Sidebar',
      description: 'Show or hide the sidebar',
      icon: Folder,
      action: () => {
        dispatch({ type: 'TOGGLE_SIDEBAR' })
        setIsOpen(false)
      },
      keywords: ['sidebar', 'toggle', 'show', 'hide', 'panel', 'explorer']
    },
    {
      id: 'toggle-panel',
      title: 'Toggle Panel',
      description: 'Show or hide the bottom panel',
      icon: Command,
      action: () => {
        dispatch({ type: 'TOGGLE_PANEL' })
        setIsOpen(false)
      },
      keywords: ['panel', 'toggle', 'show', 'hide', 'terminal', 'problems']
    },
                {
              id: 'project-config',
              title: 'Project Configuration',
              description: 'Configure build, run, and test commands',
              icon: FileText,
              action: () => {
                console.log('Opening project configuration...')
                setIsOpen(false)
                // Dispatch global event to open ProjectConfig
                window.dispatchEvent(new CustomEvent('openProjectConfig'))
              },
              keywords: ['project', 'config', 'configuration', 'build', 'run', 'test', 'commands', 'vibeconfig']
            },
            {
              id: 'settings',
              title: 'Open Settings',
              description: 'Open IDE settings and preferences',
              icon: Settings,
              action: () => {
                console.log('Opening settings...')
                setIsOpen(false)
              },
              keywords: ['settings', 'preferences', 'config', 'options', 'configure']
            },
    {
      id: 'git-status',
      title: 'Git Status',
      description: 'Show git status and changes',
      icon: GitBranch,
      action: () => {
        console.log('Showing git status...')
        setIsOpen(false)
      },
      keywords: ['git', 'status', 'version', 'control', 'changes', 'commit']
    }
  ]

  const filteredCommands = commands.filter(command =>
    command.keywords.some(keyword =>
      keyword.toLowerCase().includes(searchQuery.toLowerCase())
    ) ||
    command.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    command.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev =>
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev =>
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action()
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, filteredCommands])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div className="w-2/3 max-w-2xl bg-ide-panel border border-ide-border rounded-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center space-x-3 p-4 border-b border-ide-border">
          <Search className="w-5 h-5 text-ide-text-secondary" />
          <input
            type="text"
            placeholder="Type a command or search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-ide-text text-lg outline-none placeholder-ide-text-secondary"
            autoFocus
          />
          <div className="text-xs text-ide-text-secondary bg-ide-bg px-2 py-1 rounded">
            Ctrl+P
          </div>
        </div>

        {/* Commands List */}
        <div className="max-h-96 overflow-y-auto ide-scrollbar">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((command, index) => (
              <div
                key={command.id}
                onClick={command.action}
                className={`flex items-center space-x-3 p-3 cursor-pointer transition-colors ${
                  index === selectedIndex
                    ? 'bg-ide-accent text-white'
                    : 'hover:bg-ide-bg'
                }`}
              >
                <command.icon className={`w-5 h-5 ${
                  index === selectedIndex ? 'text-white' : 'text-ide-text-secondary'
                }`} />
                <div className="flex-1">
                  <div className="font-medium">{command.title}</div>
                  <div className={`text-sm ${
                    index === selectedIndex ? 'text-white opacity-80' : 'text-ide-text-secondary'
                  }`}>
                    {command.description}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-ide-text-secondary">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No commands found</p>
              <p className="text-xs mt-1">Try a different search term</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-ide-border text-xs text-ide-text-secondary">
          <div className="flex items-center justify-between">
            <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
            <span>{filteredCommands.length} commands</span>
          </div>
        </div>
      </div>
    </div>
  )
}
