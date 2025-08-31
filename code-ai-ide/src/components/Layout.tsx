
import { Sidebar } from './Sidebar'
import { EditorArea } from './EditorArea'
import { Panel } from './Panel'
import { StatusBar } from './StatusBar'
import { useIDE } from '../contexts/IDEContext'

export function Layout() {
  const { state } = useIDE()

  return (
    <div className="flex h-full w-full">
      {/* Sidebar */}
      {state.sidebarOpen && (
        <div className="w-64 bg-ide-sidebar border-r border-ide-border flex-shrink-0">
          <Sidebar />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          <EditorArea />
        </div>

        {/* Bottom Panel */}
        {state.panelOpen && (
          <div className="h-64 bg-ide-panel border-t border-ide-border">
            <Panel />
          </div>
        )}
      </div>
      
      {/* Status Bar */}
      <StatusBar />
    </div>
  )
}
