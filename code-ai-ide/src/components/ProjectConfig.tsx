import { useState, useEffect } from 'react'
import { Settings, Play, Bug, Zap, Save, FileText } from 'lucide-react'
import { useCommandRunner } from '../hooks/useCommandRunner'
import { useFileSystem } from '../hooks/useFileSystem'

interface ProjectConfig {
  name: string
  version: string
  description: string
  languages: string[]
  build: { [key: string]: string }
  run: { [key: string]: string }
  test: { [key: string]: string }
  lint: { [key: string]: string }
  format: { [key: string]: string }
  ai: {
    model: string
    provider: string
    endpoint: string
    features: string[]
  }
  lsp: { [key: string]: any }
  docker: {
    enabled: boolean
    images: { [key: string]: string }
  }
}

export function ProjectConfig() {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<ProjectConfig | null>(null)
  const [currentPath] = useState<string>('.')
  const { readFile, saveFile } = useFileSystem()
  const { buildProject, runProject, testProject } = useCommandRunner()

  // Listen for global open events
  useEffect(() => {
    const handleOpenProjectConfig = () => {
      setIsOpen(true)
    }

    // Add global event listener
    window.addEventListener('openProjectConfig', handleOpenProjectConfig)
    
    return () => {
      window.removeEventListener('openProjectConfig', handleOpenProjectConfig)
    }
  }, [])

  useEffect(() => {
    loadProjectConfig()
  }, [currentPath])

  const loadProjectConfig = async () => {
    try {
      const configPath = `${currentPath}/vibeconfig.json`
      const content = await readFile(configPath)
      if (content) {
        const parsedConfig = JSON.parse(content)
        setConfig(parsedConfig)
      } else {
        // Create default config
        setConfig(createDefaultConfig())
      }
    } catch (error) {
      console.log('No project config found, using defaults')
      setConfig(createDefaultConfig())
    }
  }

  const createDefaultConfig = (): ProjectConfig => ({
    name: 'my-project',
    version: '0.1.0',
    description: 'A new project',
    languages: ['typescript'],
    build: {
      typescript: 'npm run build',
      python: 'python -m py_compile main.py',
      rust: 'cargo build'
    },
    run: {
      typescript: 'npm start',
      python: 'python main.py',
      rust: 'cargo run'
    },
    test: {
      typescript: 'npm test',
      python: 'python -m pytest',
      rust: 'cargo test'
    },
    lint: {
      typescript: 'npm run lint',
      python: 'flake8 .',
      rust: 'cargo clippy'
    },
    format: {
      typescript: 'npm run format',
      python: 'black .',
      rust: 'cargo fmt'
    },
    ai: {
      model: 'codellama:7b',
      provider: 'ollama',
      endpoint: 'http://localhost:11434',
      features: ['completion', 'explanation', 'refactoring']
    },
    lsp: {
      typescript: {
        server: 'typescript-language-server',
        args: ['--stdio'],
        fileTypes: ['typescript', 'javascript', 'tsx', 'jsx']
      },
      python: {
        server: 'pylsp',
        args: ['--stdio'],
        fileTypes: ['python']
      },
      rust: {
        server: 'rust-analyzer',
        args: ['--stdio'],
        fileTypes: ['rust']
      }
    },
    docker: {
      enabled: false,
      images: {
        python: 'python:3.11-slim',
        rust: 'rust:1.70-slim',
        typescript: 'node:18-slim'
      }
    }
  })

  const saveConfig = async () => {
    if (!config) return
    
    try {
      const configPath = `${currentPath}/vibeconfig.json`
      const content = JSON.stringify(config, null, 2)
      const success = await saveFile(configPath, content)
      
      if (success) {
        console.log('Project configuration saved successfully')
      } else {
        console.error('Failed to save project configuration')
      }
    } catch (error) {
      console.error('Error saving project configuration:', error)
    }
  }

  const handleBuild = async (language: string) => {
    if (!config) return
    
    try {
      const result = await buildProject(language, currentPath)
      if (result.success) {
        console.log(`✅ ${language} project built successfully!`)
        console.log(result.output)
      } else {
        console.error(`❌ Failed to build ${language} project:`, result.error)
      }
    } catch (error) {
      console.error(`Error building ${language} project:`, error)
    }
  }

  const handleRun = async (language: string) => {
    if (!config) return
    
    try {
      const result = await runProject(language, currentPath)
      if (result.success) {
        console.log(`✅ ${language} project started successfully!`)
        console.log(result.output)
      } else {
        console.error(`❌ Failed to run ${language} project:`, result.error)
      }
    } catch (error) {
      console.error(`Error running ${language} project:`, error)
    }
  }

  const handleTest = async (language: string) => {
    if (!config) return
    
    try {
      const result = await testProject(language, currentPath)
      if (result.success) {
        console.log(`✅ ${language} tests completed successfully!`)
        console.log(result.output)
      } else {
        console.error(`❌ ${language} tests failed:`, result.error)
      }
    } catch (error) {
      console.error(`Error running ${language} tests:`, error)
    }
  }



  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-4/5 max-w-6xl h-5/6 bg-ide-panel border border-ide-border rounded-lg shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-ide-border">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-ide-accent" />
            <h2 className="text-xl font-semibold text-ide-text">Project Configuration</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={saveConfig}
              className="px-4 py-2 bg-ide-accent hover:bg-ide-accent-hover text-white rounded transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-ide-border hover:bg-ide-bg text-ide-text rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left Sidebar - Project Info */}
          <div className="w-80 bg-ide-sidebar border-r border-ide-border p-4 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ide-text mb-2">Project Name</label>
                <input
                  type="text"
                  value={config?.name || ''}
                  onChange={(e) => setConfig(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="w-full px-3 py-2 bg-ide-bg border border-ide-border rounded text-ide-text"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-ide-text mb-2">Version</label>
                <input
                  type="text"
                  value={config?.version || ''}
                  onChange={(e) => setConfig(prev => prev ? { ...prev, version: e.target.value } : null)}
                  className="w-full px-3 py-2 bg-ide-bg border border-ide-border rounded text-ide-text"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-ide-text mb-2">Description</label>
                <textarea
                  value={config?.description || ''}
                  onChange={(e) => setConfig(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="w-full px-3 py-2 bg-ide-bg border border-ide-border rounded text-ide-text"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ide-text mb-2">Languages</label>
                <div className="space-y-2">
                  {['typescript', 'python', 'rust', 'csharp', 'java', 'go'].map(lang => (
                    <label key={lang} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={config?.languages.includes(lang) || false}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setConfig(prev => prev ? { ...prev, languages: [...prev.languages, lang] } : null)
                          } else {
                            setConfig(prev => prev ? { ...prev, languages: prev.languages.filter(l => l !== lang) } : null)
                          }
                        }}
                        className="text-ide-accent"
                      />
                      <span className="text-sm text-ide-text capitalize">{lang}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Commands */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-6">
              {/* Build Commands */}
              <div>
                <h3 className="text-lg font-medium text-ide-text mb-4 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-ide-accent" />
                  <span>Build Commands</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {config?.languages.map(lang => (
                    <div key={lang} className="bg-ide-bg border border-ide-border rounded p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-ide-text capitalize">{lang}</span>
                        <button
                          onClick={() => handleBuild(lang)}
                          className="px-3 py-1 bg-ide-accent hover:bg-ide-accent-hover text-white text-xs rounded transition-colors"
                        >
                          Build
                        </button>
                      </div>
                      <input
                        type="text"
                        value={config.build[lang] || ''}
                        onChange={(e) => setConfig(prev => prev ? { 
                          ...prev, 
                          build: { ...prev.build, [lang]: e.target.value }
                        } : null)}
                        className="w-full px-2 py-1 bg-ide-sidebar border border-ide-border rounded text-xs text-ide-text"
                        placeholder={`Build command for ${lang}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Run Commands */}
              <div>
                <h3 className="text-lg font-medium text-ide-text mb-4 flex items-center space-x-2">
                  <Play className="w-5 h-5 text-ide-accent" />
                  <span>Run Commands</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {config?.languages.map(lang => (
                    <div key={lang} className="bg-ide-bg border border-ide-border rounded p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-ide-text capitalize">{lang}</span>
                        <button
                          onClick={() => handleRun(lang)}
                          className="px-3 py-1 bg-ide-accent hover:bg-ide-accent-hover text-white text-xs rounded transition-colors"
                        >
                          Run
                        </button>
                      </div>
                      <input
                        type="text"
                        value={config.run[lang] || ''}
                        onChange={(e) => setConfig(prev => prev ? { 
                          ...prev, 
                          run: { ...prev.run, [lang]: e.target.value }
                        } : null)}
                        className="w-full px-2 py-1 bg-ide-sidebar border border-ide-border rounded text-xs text-ide-text"
                        placeholder={`Run command for ${lang}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Test Commands */}
              <div>
                <h3 className="text-lg font-medium text-ide-text mb-4 flex items-center space-x-2">
                  <Bug className="w-5 h-5 text-ide-accent" />
                  <span>Test Commands</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {config?.languages.map(lang => (
                    <div key={lang} className="bg-ide-bg border border-ide-border rounded p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-ide-text capitalize">{lang}</span>
                        <button
                          onClick={() => handleTest(lang)}
                          className="px-3 py-1 bg-ide-accent hover:bg-ide-accent-hover text-white text-xs rounded transition-colors"
                        >
                          Test
                        </button>
                      </div>
                      <input
                        type="text"
                        value={config.test[lang] || ''}
                        onChange={(e) => setConfig(prev => prev ? { 
                          ...prev, 
                          test: { ...prev.test, [lang]: e.target.value }
                        } : null)}
                        className="w-full px-2 py-1 bg-ide-sidebar border border-ide-border rounded text-xs text-ide-text"
                        placeholder={`Test command for ${lang}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Configuration */}
              <div>
                <h3 className="text-lg font-medium text-ide-text mb-4 flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-ide-accent" />
                  <span>AI Configuration</span>
                </h3>
                <div className="bg-ide-bg border border-ide-border rounded p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ide-text mb-2">Model</label>
                      <input
                        type="text"
                        value={config?.ai.model || ''}
                        onChange={(e) => setConfig(prev => prev ? { 
                          ...prev, 
                          ai: { ...prev.ai, model: e.target.value }
                        } : null)}
                        className="w-full px-3 py-2 bg-ide-sidebar border border-ide-border rounded text-ide-text"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ide-text mb-2">Provider</label>
                      <input
                        type="text"
                        value={config?.ai.provider || ''}
                        onChange={(e) => setConfig(prev => prev ? { 
                          ...prev, 
                          ai: { ...prev.ai, provider: e.target.value }
                        } : null)}
                        className="w-full px-3 py-2 bg-ide-sidebar border border-ide-border rounded text-ide-text"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ide-text mb-2">Endpoint</label>
                    <input
                      type="text"
                      value={config?.ai.endpoint || ''}
                      onChange={(e) => setConfig(prev => prev ? { 
                        ...prev, 
                        ai: { ...prev.ai, endpoint: e.target.value }
                      } : null)}
                      className="w-full px-3 py-2 bg-ide-sidebar border border-ide-border rounded text-ide-text"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
