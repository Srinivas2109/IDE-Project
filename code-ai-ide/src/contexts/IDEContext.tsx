import React, { createContext, useContext, useReducer, ReactNode } from 'react'

export interface File {
  id: string
  name: string
  path: string
  content: string
  language: string
  isModified: boolean
  isOpen: boolean
}

export interface Tab {
  id: string
  fileId: string
  isActive: boolean
}

export interface IDEState {
  files: File[]
  tabs: Tab[]
  activeTabId: string | null
  sidebarOpen: boolean
  panelOpen: boolean
  theme: 'dark' | 'light'
  currentProject: string | null
}

type IDEAction =
  | { type: 'OPEN_FILE'; payload: File }
  | { type: 'CLOSE_FILE'; payload: string }
  | { type: 'SAVE_FILE'; payload: { id: string; content: string } }
  | { type: 'UPDATE_FILE'; payload: { id: string; isModified?: boolean; content?: string } }
  | { type: 'CREATE_TAB'; payload: Tab }
  | { type: 'CLOSE_TAB'; payload: string }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'TOGGLE_PANEL' }
  | { type: 'SET_THEME'; payload: 'dark' | 'light' }
  | { type: 'SET_PROJECT'; payload: string }

const initialState: IDEState = {
  files: [],
  tabs: [],
  activeTabId: null,
  sidebarOpen: true,
  panelOpen: false,
  theme: 'dark',
  currentProject: null,
}

function ideReducer(state: IDEState, action: IDEAction): IDEState {
  switch (action.type) {
    case 'OPEN_FILE':
      const existingFileIndex = state.files.findIndex(f => f.path === action.payload.path)
      if (existingFileIndex >= 0) {
        // File already exists, update it
        const updatedFiles = [...state.files]
        updatedFiles[existingFileIndex] = { 
          ...updatedFiles[existingFileIndex], 
          isOpen: true,
          content: action.payload.content,
          isModified: false
        }
        return { ...state, files: updatedFiles }
      }
      // Add new file
      return { ...state, files: [...state.files, action.payload] }

    case 'CLOSE_FILE':
      return {
        ...state,
        files: state.files.map(f => 
          f.id === action.payload ? { ...f, isOpen: false } : f
        ),
        tabs: state.tabs.filter(t => t.fileId !== action.payload)
      }

    case 'SAVE_FILE':
      return {
        ...state,
        files: state.files.map(f => 
          f.id === action.payload.id 
            ? { ...f, content: action.payload.content, isModified: false }
            : f
        )
      }

    case 'UPDATE_FILE':
      return {
        ...state,
        files: state.files.map(f => 
          f.id === action.payload.id 
            ? { 
                ...f, 
                content: action.payload.content ?? f.content,
                isModified: action.payload.isModified ?? f.isModified
              }
            : f
        )
      }

    case 'CREATE_TAB':
      const newTabs = state.tabs.map(t => ({ ...t, isActive: false }))
      return {
        ...state,
        tabs: [...newTabs, action.payload],
        activeTabId: action.payload.id
      }

    case 'CLOSE_TAB':
      const remainingTabs = state.tabs.filter(t => t.id !== action.payload)
      const newActiveTab = remainingTabs.length > 0 ? remainingTabs[0].id : null
      return {
        ...state,
        tabs: remainingTabs,
        activeTabId: newActiveTab
      }

    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        tabs: state.tabs.map(t => ({ ...t, isActive: t.id === action.payload })),
        activeTabId: action.payload
      }

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen }

    case 'TOGGLE_PANEL':
      return { ...state, panelOpen: !state.panelOpen }

    case 'SET_THEME':
      return { ...state, theme: action.payload }

    case 'SET_PROJECT':
      return { ...state, currentProject: action.payload }

    default:
      return state
  }
}

interface IDEContextType {
  state: IDEState
  dispatch: React.Dispatch<IDEAction>
}

const IDEContext = createContext<IDEContextType | undefined>(undefined)

export function IDEProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(ideReducer, initialState)

  return (
    <IDEContext.Provider value={{ state, dispatch }}>
      {children}
    </IDEContext.Provider>
  )
}

export function useIDE() {
  const context = useContext(IDEContext)
  if (context === undefined) {
    throw new Error('useIDE must be used within an IDEProvider')
  }
  return context
}
