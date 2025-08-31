
import { Toaster } from 'react-hot-toast'
import { IDEProvider } from './contexts/IDEContext'
import { Layout } from './components/Layout'
import { CommandPalette } from './components/CommandPalette'
import { ProjectConfig } from './components/ProjectConfig'

function App() {
  return (
    <IDEProvider>
      <div className="h-screen w-screen overflow-hidden bg-ide-bg">
        <Layout />
        <CommandPalette />
        <ProjectConfig />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#2d2d30',
              color: '#cccccc',
              border: '1px solid #3e3e42',
            },
          }}
        />
      </div>
    </IDEProvider>
  )
}

export default App
