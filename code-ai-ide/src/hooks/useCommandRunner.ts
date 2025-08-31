import { useState, useCallback } from 'react'
import { invoke } from '@tauri-apps/api/tauri'

interface CommandResult {
  success: boolean
  output: string
  error?: string
}

interface CommandRunnerHook {
  runCommand: (command: string, args: string[], cwd?: string) => Promise<CommandResult>
  buildProject: (language: string, cwd?: string) => Promise<CommandResult>
  runProject: (language: string, cwd?: string) => Promise<CommandResult>
  testProject: (language: string, cwd?: string) => Promise<CommandResult>
  lintProject: (language: string, cwd?: string) => Promise<CommandResult>
  formatProject: (language: string, cwd?: string) => Promise<CommandResult>
  isLoading: boolean
  error: string | null
}

export function useCommandRunner(): CommandRunnerHook {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runCommand = useCallback(async (command: string, args: string[], cwd?: string): Promise<CommandResult> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const output = await invoke('run_command', { command, args, cwd })
      return {
        success: true,
        output: output as string
      }
    } catch (err) {
      const errorMsg = err as string
      setError(errorMsg)
      return {
        success: false,
        output: '',
        error: errorMsg
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const buildProject = useCallback(async (language: string, cwd?: string): Promise<CommandResult> => {
    const commands: { [key: string]: { cmd: string; args: string[] } } = {
      typescript: { cmd: 'npm', args: ['run', 'build'] },
      javascript: { cmd: 'npm', args: ['run', 'build'] },
      python: { cmd: 'python', args: ['-m', 'py_compile', 'main.py'] },
      rust: { cmd: 'cargo', args: ['build'] },
      csharp: { cmd: 'dotnet', args: ['build'] },
      java: { cmd: 'javac', args: ['*.java'] },
      go: { cmd: 'go', args: ['build'] },
      php: { cmd: 'php', args: ['-l', '*.php'] }
    }

    const command = commands[language]
    if (!command) {
      return {
        success: false,
        output: '',
        error: `Unsupported language: ${language}`
      }
    }

    return runCommand(command.cmd, command.args, cwd)
  }, [runCommand])

  const runProject = useCallback(async (language: string, cwd?: string): Promise<CommandResult> => {
    const commands: { [key: string]: { cmd: string; args: string[] } } = {
      typescript: { cmd: 'npm', args: ['start'] },
      javascript: { cmd: 'npm', args: ['start'] },
      python: { cmd: 'python', args: ['main.py'] },
      rust: { cmd: 'cargo', args: ['run'] },
      csharp: { cmd: 'dotnet', args: ['run'] },
      java: { cmd: 'java', args: ['Main'] },
      go: { cmd: 'go', args: ['run', '.'] },
      php: { cmd: 'php', args: ['main.php'] }
    }

    const command = commands[language]
    if (!command) {
      return {
        success: false,
        output: '',
        error: `Unsupported language: ${language}`
      }
    }

    return runCommand(command.cmd, command.args, cwd)
  }, [runCommand])

  const testProject = useCallback(async (language: string, cwd?: string): Promise<CommandResult> => {
    const commands: { [key: string]: { cmd: string; args: string[] } } = {
      typescript: { cmd: 'npm', args: ['test'] },
      javascript: { cmd: 'npm', args: ['test'] },
      python: { cmd: 'python', args: ['-m', 'pytest'] },
      rust: { cmd: 'cargo', args: ['test'] },
      csharp: { cmd: 'dotnet', args: ['test'] },
      java: { cmd: 'mvn', args: ['test'] },
      go: { cmd: 'go', args: ['test', './...'] },
      php: { cmd: 'vendor/bin/phpunit', args: ['tests'] }
    }

    const command = commands[language]
    if (!command) {
      return {
        success: false,
        output: '',
        error: `Unsupported language: ${language}`
      }
    }

    return runCommand(command.cmd, command.args, cwd)
  }, [runCommand])

  const lintProject = useCallback(async (language: string, cwd?: string): Promise<CommandResult> => {
    const commands: { [key: string]: { cmd: string; args: string[] } } = {
      typescript: { cmd: 'npm', args: ['run', 'lint'] },
      javascript: { cmd: 'npm', args: ['run', 'lint'] },
      python: { cmd: 'flake8', args: ['.'] },
      rust: { cmd: 'cargo', args: ['clippy'] },
      csharp: { cmd: 'dotnet', args: ['format', '--verify-no-changes'] },
      java: { cmd: 'mvn', args: ['checkstyle:check'] },
      go: { cmd: 'golangci-lint', args: ['run'] },
      php: { cmd: 'vendor/bin/phpcs', args: ['--standard=PSR12', 'src'] }
    }

    const command = commands[language]
    if (!command) {
      return {
        success: false,
        output: '',
        error: `Unsupported language: ${language}`
      }
    }

    return runCommand(command.cmd, command.args, cwd)
  }, [runCommand])

  const formatProject = useCallback(async (language: string, cwd?: string): Promise<CommandResult> => {
    const commands: { [key: string]: { cmd: string; args: string[] } } = {
      typescript: { cmd: 'npm', args: ['run', 'format'] },
      javascript: { cmd: 'npm', args: ['run', 'format'] },
      python: { cmd: 'black', args: ['.'] },
      rust: { cmd: 'cargo', args: ['fmt'] },
      csharp: { cmd: 'dotnet', args: ['format'] },
      java: { cmd: 'mvn', args: ['spotless:apply'] },
      go: { cmd: 'go', args: ['fmt', './...'] },
      php: { cmd: 'vendor/bin/phpcbf', args: ['--standard=PSR12', 'src'] }
    }

    const command = commands[language]
    if (!command) {
      return {
        success: false,
        output: '',
        error: `Unsupported language: ${language}`
      }
    }

    return runCommand(command.cmd, command.args, cwd)
  }, [runCommand])

  return {
    runCommand,
    buildProject,
    runProject,
    testProject,
    lintProject,
    formatProject,
    isLoading,
    error
  }
}
