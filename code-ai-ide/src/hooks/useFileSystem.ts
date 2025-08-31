import { useState, useCallback } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { File } from '../contexts/IDEContext'

interface FileSystemHook {
  openFile: () => Promise<File | null>
  saveFile: (path: string, content: string) => Promise<boolean>
  readFile: (path: string) => Promise<string | null>
  listDirectory: (path: string) => Promise<string[]>
  createFile: (path: string, name: string) => Promise<boolean>
  createDirectory: (path: string, name: string) => Promise<boolean>
  deleteFile: (path: string) => Promise<boolean>
  deleteDirectory: (path: string) => Promise<boolean>
  isLoading: boolean
  error: string | null
}

export function useFileSystem(): FileSystemHook {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openFile = useCallback(async (): Promise<File | null> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await invoke('open_file_dialog')
      if (result) {
        const fileInfo = result as any
        return {
          id: `file-${Date.now()}`,
          name: fileInfo.name,
          path: fileInfo.path,
          content: fileInfo.content,
          language: fileInfo.language,
          isModified: false,
          isOpen: true
        }
      }
      return null
    } catch (err) {
      setError(err as string)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const saveFile = useCallback(async (path: string, content: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    
    try {
      await invoke('save_file', { path, content })
      return true
    } catch (err) {
      setError(err as string)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const readFile = useCallback(async (path: string): Promise<string | null> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const content = await invoke('read_file', { path })
      return content as string
    } catch (err) {
      setError(err as string)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const listDirectory = useCallback(async (path: string): Promise<string[]> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const files = await invoke('list_directory', { path })
      return files as string[]
    } catch (err) {
      setError(err as string)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createFile = useCallback(async (path: string, name: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    
    try {
      await invoke('create_file', { path, name })
      return true
    } catch (err) {
      setError(err as string)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createDirectory = useCallback(async (path: string, name: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    
    try {
      await invoke('create_directory', { path, name })
      return true
    } catch (err) {
      setError(err as string)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteFile = useCallback(async (path: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    
    try {
      await invoke('delete_file', { path })
      return true
    } catch (err) {
      setError(err as string)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteDirectory = useCallback(async (path: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    
    try {
      await invoke('delete_directory', { path })
      return true
    } catch (err) {
      setError(err as string)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    openFile,
    saveFile,
    readFile,
    listDirectory,
    createFile,
    createDirectory,
    deleteFile,
    deleteDirectory,
    isLoading,
    error
  }
}
