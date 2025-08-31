# Project Configuration

The Code AI IDE includes a powerful project configuration system that allows you to customize build, run, test, and lint commands for different programming languages.

## Features

- **Multi-language Support**: Configure commands for TypeScript, Python, Rust, C#, Java, and Go
- **Custom Commands**: Define your own build, run, test, lint, and format commands
- **AI Integration**: Configure AI model settings for code assistance
- **LSP Configuration**: Set up language server protocol settings
- **Docker Support**: Configure containerized development environments

## Usage

### Opening Project Configuration

1. **Toolbar Button**: Click the file icon (📄) in the editor toolbar
2. **Command Palette**: Press `Ctrl+P` and search for "Project Configuration"
3. **Keyboard Shortcut**: Coming soon

### Configuration File

The IDE uses a `vibeconfig.json` file in your project root to store configuration:

```json
{
  "name": "my-project",
  "version": "0.1.0",
  "description": "A description of your project",
  "languages": ["typescript", "python"],
  "build": {
    "typescript": "npm run build",
    "python": "python -m py_compile main.py"
  },
  "run": {
    "typescript": "npm start",
    "python": "python main.py"
  },
  "test": {
    "typescript": "npm test",
    "python": "python -m pytest"
  },
  "lint": {
    "typescript": "npm run lint",
    "python": "flake8 ."
  },
  "format": {
    "typescript": "npm run format",
    "python": "black ."
  },
  "ai": {
    "model": "codellama:7b",
    "provider": "ollama",
    "endpoint": "http://localhost:11434",
    "features": ["completion", "explanation", "refactoring"]
  }
}
```

## Supported Languages

- **TypeScript/JavaScript**: npm, yarn, pnpm commands
- **Python**: pip, poetry, conda commands
- **Rust**: cargo commands
- **C#**: dotnet commands
- **Java**: maven, gradle commands
- **Go**: go commands

## AI Configuration

Configure AI assistance for your project:

- **Model**: Choose your preferred AI model (e.g., codellama:7b, starcoder:3b)
- **Provider**: AI service provider (e.g., ollama, openai, anthropic)
- **Endpoint**: API endpoint for the AI service
- **Features**: Enable specific AI features (completion, explanation, refactoring)

## LSP Configuration

Set up language servers for enhanced code intelligence:

```json
"lsp": {
  "typescript": {
    "server": "typescript-language-server",
    "args": ["--stdio"],
    "fileTypes": ["typescript", "javascript", "tsx", "jsx"]
  }
}
```

## Docker Integration

Configure containerized development environments:

```json
"docker": {
  "enabled": true,
  "images": {
    "python": "python:3.11-slim",
    "rust": "rust:1.70-slim"
  }
}
```

## Examples

### TypeScript Project
```json
{
  "name": "typescript-app",
  "languages": ["typescript"],
  "build": {
    "typescript": "npm run build"
  },
  "run": {
    "typescript": "npm start"
  },
  "test": {
    "typescript": "npm test"
  }
}
```

### Python Project
```json
{
  "name": "python-app",
  "languages": ["python"],
  "build": {
    "python": "python -m py_compile main.py"
  },
  "run": {
    "python": "python main.py"
  },
  "test": {
    "python": "python -m pytest"
  }
}
```

### Multi-language Project
```json
{
  "name": "full-stack-app",
  "languages": ["typescript", "python"],
  "build": {
    "typescript": "npm run build",
    "python": "python -m py_compile main.py"
  },
  "run": {
    "typescript": "npm start",
    "python": "python api/main.py"
  }
}
```

## Best Practices

1. **Keep it Simple**: Start with basic commands and add complexity as needed
2. **Use Variables**: Consider using environment variables for sensitive information
3. **Version Control**: Include `vibeconfig.json` in your repository
4. **Documentation**: Add comments to explain complex command configurations
5. **Testing**: Test your commands in the terminal before adding them to config

## Troubleshooting

### Common Issues

1. **Commands Not Found**: Ensure the required tools are installed and in your PATH
2. **Permission Errors**: Check file permissions and user access
3. **Path Issues**: Use absolute paths or ensure relative paths are correct
4. **Environment Variables**: Make sure required environment variables are set

### Getting Help

- Check the terminal output for error messages
- Verify command syntax in your shell
- Test commands manually before adding to configuration
- Check the IDE logs for additional debugging information

## Future Enhancements

- **Template Library**: Pre-built configurations for common project types
- **Command Validation**: Syntax checking for commands before execution
- **Environment Management**: Switch between different configurations
- **Plugin System**: Extend configuration with custom plugins
- **Cloud Sync**: Sync configurations across devices
