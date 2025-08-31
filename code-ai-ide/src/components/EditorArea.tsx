import { useState } from 'react'
import { X, Save, Play, Bug, Settings, Terminal, Zap, FolderOpen, FileText } from 'lucide-react'
import { useIDE } from '../contexts/IDEContext'
import { useFileSystem } from '../hooks/useFileSystem'
import { MonacoEditor } from './MonacoEditor'

export function EditorArea() {
  const { state, dispatch } = useIDE()
  const { openFile, saveFile } = useFileSystem()
  const [activeTabId, setActiveTabId] = useState<string | null>(null)
  const [showProjectConfig, setShowProjectConfig] = useState(false)

  const activeFile = state.files.find(f => f.isOpen && state.tabs.find(t => t.id === activeTabId)?.fileId === f.id)

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId)
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tabId })
  }

  const handleCloseTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({ type: 'CLOSE_TAB', payload: tabId })
    if (activeTabId === tabId) {
      const remainingTabs = state.tabs.filter(t => t.id !== tabId)
      if (remainingTabs.length > 0) {
        setActiveTabId(remainingTabs[0].id)
        dispatch({ type: 'SET_ACTIVE_TAB', payload: remainingTabs[0].id })
      } else {
        setActiveTabId(null)
      }
    }
  }

  const handleOpenFile = async () => {
    try {
      const file = await openFile()
      if (file) {
        // Check if file is already open
        const existingFile = state.files.find(f => f.path === file.path)
        if (existingFile) {
          // Switch to existing tab
          const existingTab = state.tabs.find(t => t.fileId === existingFile.id)
          if (existingTab) {
            setActiveTabId(existingTab.id)
            dispatch({ type: 'SET_ACTIVE_TAB', payload: existingTab.id })
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
        
        setActiveTabId(newTab.id)
        dispatch({ type: 'SET_ACTIVE_TAB', payload: newTab.id })
      }
    } catch (error) {
      console.error('Failed to open file:', error)
    }
  }

  const handleSave = async () => {
    if (activeFile) {
      try {
        const success = await saveFile(activeFile.path, activeFile.content)
        if (success) {
          dispatch({ type: 'SAVE_FILE', payload: { id: activeFile.id, content: activeFile.content } })
          // Mark file as not modified
          dispatch({ 
            type: 'UPDATE_FILE', 
            payload: { id: activeFile.id, isModified: false } 
          })
          console.log('File saved successfully')
        } else {
          console.error('Failed to save file')
        }
      } catch (error) {
        console.error('Error saving file:', error)
      }
    }
  }

  const handleRun = () => {
    if (activeFile) {
      console.log('Running file:', activeFile.path)
      // In real implementation, this would execute the file
      // For now, we'll use the terminal
      dispatch({ type: 'TOGGLE_PANEL' })
    }
  }

  const handleDebug = () => {
    if (activeFile) {
      console.log('Debugging file:', activeFile.path)
      // In real implementation, this would start debugging
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="h-12 bg-ide-panel border-b border-ide-border flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleOpenFile}
            className="p-2 hover:bg-ide-bg rounded transition-colors"
            title="Open File (Ctrl+O)"
          >
            <FolderOpen className="w-4 h-4 text-ide-text" />
          </button>
          <button
            onClick={handleSave}
            className="p-2 hover:bg-ide-bg rounded transition-colors"
            title="Save (Ctrl+S)"
          >
            <Save className="w-4 h-4 text-ide-text" />
          </button>
          <button
            onClick={handleRun}
            className="p-2 hover:bg-ide-bg rounded transition-colors"
            title="Run (F5)"
          >
            <Play className="w-4 h-4 text-ide-text" />
          </button>
          <button
            onClick={handleDebug}
            className="p-2 hover:bg-ide-bg rounded transition-colors"
            title="Debug (F9)"
          >
            <Bug className="w-4 h-4 text-ide-text" />
          </button>
          <button
            onClick={() => setShowProjectConfig(true)}
            className="p-2 hover:bg-ide-bg rounded transition-colors"
            title="Project Configuration"
          >
            <FileText className="w-4 h-4 text-ide-text" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_PANEL' })}
            className={`p-2 rounded transition-colors ${
              state.panelOpen ? 'bg-ide-accent text-white' : 'hover:bg-ide-bg text-ide-text'
            }`}
            title="Toggle Panel"
          >
            <Terminal className="w-4 h-4" />
          </button>
          <button
            className="p-2 hover:bg-ide-bg rounded transition-colors"
            title="AI Assistant"
          >
            <Zap className="w-4 h-4 text-ide-text" />
          </button>
          <button
            className="p-2 hover:bg-ide-bg rounded transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4 text-ide-text" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      {state.tabs.length > 0 && (
        <div className="h-10 bg-ide-sidebar border-b border-ide-border flex items-center overflow-x-auto ide-scrollbar">
          {state.tabs.map(tab => {
            const file = state.files.find(f => f.id === tab.fileId)
            if (!file) return null

            return (
              <div
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                                 className={`flex items-center px-4 py-2 min-w-0 cursor-pointer border-r border-ide-border transition-colors ${
                   activeTabId === tab.id || state.activeTabId === tab.id
                     ? 'bg-ide-bg text-ide-text'
                     : 'hover:bg-ide-panel text-ide-text-secondary'
                 }`}
              >
                <span className="truncate text-sm">{file.name}</span>
                {file.isModified && (
                  <span className="ml-2 w-2 h-2 bg-ide-accent rounded-full flex-shrink-0" />
                )}
                <button
                  onClick={(e) => handleCloseTab(tab.id, e)}
                  className="ml-2 p-1 hover:bg-ide-border rounded transition-colors flex-shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Editor */}
      <div className="flex-1">
                 {activeFile ? (
           <MonacoEditor
             file={activeFile}
             onChange={(content) => {
               // Update file content and mark as modified
               dispatch({
                 type: 'UPDATE_FILE',
                 payload: { id: activeFile.id, content, isModified: true }
               })
             }}
           />
         ) : (
          <div className="h-full flex items-center justify-center text-ide-text-secondary">
            <div className="text-center">
              <FolderOpen className="w-16 h-16 mx-auto mb-4 text-ide-border" />
              <h3 className="text-lg font-medium mb-2">Welcome to Code AI IDE</h3>
              <p className="text-sm mb-4">Open a file to start coding</p>
              <button
                onClick={handleOpenFile}
                className="px-4 py-2 bg-ide-accent hover:bg-ide-accent-hover text-white rounded transition-colors"
              >
                Open File
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Project Configuration Modal */}
      {showProjectConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-4/5 max-w-6xl h-5/6 bg-ide-panel border border-ide-border rounded-lg shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-ide-border">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-ide-accent" />
                <h2 className="text-xl font-semibold text-ide-text">Project Configuration</h2>
              </div>
              <button
                onClick={() => setShowProjectConfig(false)}
                className="px-4 py-2 bg-ide-border hover:bg-ide-bg text-ide-text rounded transition-colors"
              >
                Close
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="text-center text-ide-text-secondary">
                <FileText className="w-16 h-16 mx-auto mb-4 text-ide-border" />
                <h3 className="text-lg font-medium mb-2">Project Configuration</h3>
                <p className="text-sm mb-4">Configure build, run, and test commands for your project</p>
                <p className="text-xs">This feature is coming soon!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
