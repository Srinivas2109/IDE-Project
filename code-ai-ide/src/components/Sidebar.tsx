import { useState, useEffect } from 'react'
import {
  Folder,
  File,
  Search,
  Settings,
  Play,

  GitBranch,
  Zap,
  ChevronDown,
  ChevronRight,

  MoreVertical
} from 'lucide-react'
import { useFileSystem } from '../hooks/useFileSystem'
import { useIDE } from '../contexts/IDEContext'

interface FileTreeNode {
  id: string
  name: string
  type: 'file' | 'folder'
  path: string
  children?: FileTreeNode[]
  isExpanded?: boolean
}

export function Sidebar() {
  const { listDirectory, createFile, createDirectory, deleteFile, deleteDirectory, readFile } = useFileSystem()
  const { state, dispatch } = useIDE()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSection, setActiveSection] = useState('explorer')
  const [fileTree, setFileTree] = useState<FileTreeNode[]>([])
  const [currentPath, setCurrentPath] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  // Load initial file tree
  useEffect(() => {
    loadFileTree('.')
  }, [])

  const loadFileTree = async (path: string) => {
    setIsLoading(true)
    try {
      const files = await listDirectory(path)
      const tree: FileTreeNode[] = []

      for (const fileName of files) {
        const fullPath = path === '.' ? fileName : `${path}/${fileName}`
        const isDirectory = !fileName.includes('.')

        tree.push({
          id: fullPath,
          name: fileName,
          type: isDirectory ? 'folder' : 'file',
          path: fullPath,
          isExpanded: false,
          children: isDirectory ? [] : undefined
        })
      }

      setFileTree(tree)
      setCurrentPath(path)
    } catch (error) {
      console.error('Failed to load file tree:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFolder = async (nodeId: string) => {
    const node = findNode(fileTree, nodeId)
    if (!node || node.type !== 'folder') return

    if (!node.isExpanded && node.children?.length === 0) {
      // Load folder contents
      try {
        const files = await listDirectory(node.path)
        const children: FileTreeNode[] = []

        for (const fileName of files) {
          const fullPath = `${node.path}/${fileName}`
          const isDirectory = !fileName.includes('.')

          children.push({
            id: fullPath,
            name: fileName,
            type: isDirectory ? 'folder' : 'file',
            path: fullPath,
            isExpanded: false,
            children: isDirectory ? [] : undefined
          })
        }

        node.children = children
      } catch (error) {
        console.error('Failed to load folder contents:', error)
        return
      }
    }

    node.isExpanded = !node.isExpanded
    setFileTree([...fileTree])
  }

  const findNode = (nodes: FileTreeNode[], id: string): FileTreeNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node
      if (node.children) {
        const found = findNode(node.children, id)
        if (found) return found
      }
    }
    return null
  }

  const handleFileClick = async (node: FileTreeNode) => {
    if (node.type === 'file') {
      console.log('File clicked:', node.name, node.path)
      try {
        // Check if file is already open
        const existingFile = state.files.find(f => f.path === node.path)
        if (existingFile) {
          console.log('File already open, switching to existing tab')
          // File is already open, just switch to its tab
          const existingTab = state.tabs.find(t => t.fileId === existingFile.id)
          if (existingTab) {
            dispatch({ type: 'SET_ACTIVE_TAB', payload: existingTab.id })
            return
          }
        }

        // Read file content
        const content = await readFile(node.path)
        if (content !== null) {
          // Create file object with simple ID
          const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          const file = {
            id: fileId,
            name: node.name,
            path: node.path,
            content: content,
            language: getLanguageFromExtension(node.name),
            isOpen: true,
            isModified: false
          }
          
          // Dispatch to IDE context
          dispatch({ type: 'OPEN_FILE', payload: file })
          
          // Create tab for the file
          const newTab = {
            id: `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            fileId: fileId,
            isActive: false
          }
          dispatch({ type: 'CREATE_TAB', payload: newTab })
          dispatch({ type: 'SET_ACTIVE_TAB', payload: newTab.id })
        }
      } catch (error) {
        console.error('Failed to open file:', error)
        alert(`Failed to open file: ${error}`)
      }
    }
  }

  const getLanguageFromExtension = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase()
    const languageMap: { [key: string]: string } = {
      'ts': 'typescript', 'tsx': 'typescript',
      'js': 'javascript', 'jsx': 'javascript',
      'py': 'python', 'cs': 'csharp', 'java': 'java',
      'cpp': 'cpp', 'c': 'c', 'rs': 'rust', 'go': 'go',
      'php': 'php', 'rb': 'ruby', 'sql': 'sql',
      'html': 'html', 'css': 'css', 'scss': 'scss',
      'json': 'json', 'xml': 'xml', 'yaml': 'yaml',
      'yml': 'yaml', 'md': 'markdown'
    }
    return languageMap[ext || ''] || 'plaintext'
  }

  const handleCreateFile = async () => {
    const fileName = prompt('Enter file name:')
    if (!fileName) return

    try {
      const success = await createFile(currentPath, fileName)
      if (success) {
        console.log('File created successfully')
        loadFileTree(currentPath)
      } else {
        console.error('Failed to create file')
        alert('Failed to create file. Please check permissions and try again.')
      }
    } catch (error) {
      console.error('Failed to create file:', error)
      alert(`Error creating file: ${error}`)
    }
  }

  const handleCreateFolder = async () => {
    const folderName = prompt('Enter folder name:')
    if (!folderName) return

    try {
      const success = await createDirectory(currentPath, folderName)
      if (success) {
        loadFileTree(currentPath)
      }
    } catch (error) {
      console.error('Failed to create folder:', error)
    }
  }

  const handleDelete = async (node: FileTreeNode) => {
    const confirmMessage = `Are you sure you want to delete ${node.type === 'folder' ? 'folder' : 'file'} "${node.name}"?`
    if (!confirm(confirmMessage)) return

    try {
      let success = false
      if (node.type === 'folder') {
        success = await deleteDirectory(node.path)
      } else {
        success = await deleteFile(node.path)
      }

      if (success) {
        loadFileTree(currentPath)
      }
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const renderFileTree = (nodes: FileTreeNode[], level = 0) => {
    return nodes.map(node => (
      <div key={node.id} style={{ paddingLeft: `${level * 16}px` }}>
        <div
          className="flex items-center py-1 px-2 hover:bg-ide-panel cursor-pointer rounded group"
          onClick={() => handleFileClick(node)}
        >
          {node.type === 'folder' ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFolder(node.id)
                }}
                className="w-4 h-4 mr-1 text-ide-text-secondary hover:text-ide-text"
              >
                {node.isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              <Folder className="w-4 h-4 mr-2 text-ide-accent" />
            </>
          ) : (
            <File className="w-4 h-4 mr-2 text-ide-text-secondary" />
          )}
          <span className="text-sm truncate flex-1">{node.name}</span>

          {/* Context menu */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDelete(node)
              }}
              className="p-1 hover:bg-ide-border rounded text-ide-text-secondary hover:text-ide-error"
              title="Delete"
            >
              <MoreVertical className="w-3 h-3" />
            </button>
          </div>
        </div>
        {node.children && node.isExpanded && renderFileTree(node.children, level + 1)}
      </div>
    ))
  }

  const sections = [
    { id: 'explorer', icon: Folder, label: 'Explorer' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'git', icon: GitBranch, label: 'Source Control' },
    { id: 'run', icon: Play, label: 'Run and Debug' },
    { id: 'extensions', icon: Zap, label: 'Extensions' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Section Tabs */}
      <div className="flex border-b border-ide-border">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex-1 py-2 px-3 text-xs font-medium transition-colors ${
              activeSection === section.id
                ? 'bg-ide-panel text-ide-text border-b-2 border-ide-accent'
                : 'text-ide-text-secondary hover:text-ide-text hover:bg-ide-panel'
            }`}
          >
            <section.icon className="w-4 h-4 mx-auto mb-1" />
            {section.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto ide-scrollbar">
        {activeSection === 'explorer' && (
          <div className="p-2">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-ide-text-secondary truncate">
                {currentPath === '.' ? 'Root' : currentPath}
              </span>
              <div className="flex space-x-1">
                <button
                  onClick={handleCreateFile}
                  className="p-1 hover:bg-ide-panel rounded text-ide-text-secondary hover:text-ide-text"
                  title="New File"
                >
                  <File className="w-3 h-3" />
                </button>
                <button
                  onClick={handleCreateFolder}
                  className="p-1 hover:bg-ide-panel rounded text-ide-text-secondary hover:text-ide-text"
                  title="New Folder"
                >
                  <Folder className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-3">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ide-text-secondary" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-ide-panel border border-ide-border rounded text-sm text-ide-text placeholder-ide-text-secondary focus:outline-none focus:border-ide-accent"
              />
            </div>

            {/* File Tree */}
            <div className="space-y-1">
              {isLoading ? (
                <div className="text-center py-4 text-ide-text-secondary">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-ide-accent mx-auto mb-2"></div>
                  Loading...
                </div>
              ) : fileTree.length === 0 ? (
                <div className="text-center py-4 text-ide-text-secondary">
                  <Folder className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No files found</p>
                </div>
              ) : (
                renderFileTree(fileTree)
              )}
            </div>
          </div>
        )}

        {activeSection === 'search' && (
          <div className="p-4 text-center text-ide-text-secondary">
            <Search className="w-8 h-8 mx-auto mb-2" />
            <p>Search functionality coming soon...</p>
          </div>
        )}

        {activeSection === 'git' && (
          <div className="p-4 text-center text-ide-text-secondary">
            <GitBranch className="w-8 h-8 mx-auto mb-2" />
            <p>Git integration coming soon...</p>
          </div>
        )}

        {activeSection === 'run' && (
          <div className="p-4 text-center text-ide-text-secondary">
            <Play className="w-8 h-8 mx-auto mb-2" />
            <p>Run and debug coming soon...</p>
          </div>
        )}

        {activeSection === 'extensions' && (
          <div className="p-4 text-center text-ide-text-secondary">
            <Zap className="w-8 h-8 mx-auto mb-2" />
            <p>Extensions marketplace coming soon...</p>
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="p-4 text-center text-ide-text-secondary">
            <Settings className="w-8 h-8 mx-auto mb-2" />
            <p>Settings panel coming soon...</p>
          </div>
        )}
      </div>
    </div>
  )
}
