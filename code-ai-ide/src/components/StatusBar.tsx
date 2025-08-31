import { useState, useEffect } from 'react'
import { GitBranch, Circle, FileText, Settings } from 'lucide-react'
import { useIDE } from '../contexts/IDEContext'

export function StatusBar() {
  const { state } = useIDE()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const activeFile = state.files.find(f => f.isOpen && f.id === state.activeTabId) ||
                     state.files.find(f => f.isOpen && state.tabs.find(t => t.id === state.activeTabId)?.fileId === f.id)

  const getFileStats = () => {
    if (!activeFile) return { lines: 0, characters: 0 }
    
    const lines = activeFile.content.split('\n').length
    const characters = activeFile.content.length
    
    return { lines, characters }
  }

  const { lines, characters } = getFileStats()

  return (
    <div className="h-6 bg-ide-panel border-t border-ide-border flex items-center justify-between px-4 text-xs text-ide-text-secondary">
      {/* Left side - File info */}
      <div className="flex items-center space-x-4">
        {activeFile && (
          <>
            <div className="flex items-center space-x-2">
              <FileText className="w-3 h-3" />
              <span>{activeFile.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>{lines} lines</span>
              <span>•</span>
              <span>{characters} characters</span>
            </div>
            {activeFile.isModified && (
              <div className="flex items-center space-x-1">
                <Circle className="w-2 h-2 text-ide-accent" />
                <span>Modified</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Right side - Status info */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <GitBranch className="w-3 h-3" />
          <span>main</span>
        </div>
        <div className="flex items-center space-x-2">
          <Settings className="w-3 h-3" />
          <span>TypeScript</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>{currentTime.toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  )
}
