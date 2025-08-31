# Code AI IDE

A lightweight, offline-first, AI-powered IDE capable of supporting all major programming languages through LSP integration, task runners, and AI assistance.

## ✨ Features

### Core Features (MVP)
- **File Explorer** - Open, save, edit files with tabbed interface
- **Language Support** - C#, Python, JavaScript/TypeScript with syntax highlighting
- **Build/Run Pipeline** - Local + Docker execution support
- **Project Configuration** - Customize build, run, test, and lint commands per project
- **AI Assistance** - Offline AI coding assistance (Ollama + Code Llama)
- **Modern UI** - Dark theme, command palette, customizable interface
- **Cross-platform** - Windows, macOS, Linux support

### Advanced Features (Future)
- **Universal Language Support** - All major programming languages
- **LSP Integration** - Language Server Protocol for enhanced language features
- **Plugin System** - Extensible architecture for community contributions
- **Cloud Integration** - Optional cloud-based compilation and testing
- **Collaboration** - Real-time collaborative editing

## Tech Stack

- **Backend**: Tauri (Rust) - Lightweight desktop framework
- **Frontend**: React + TypeScript + TailwindCSS
- **Editor**: Monaco Editor (VS Code's editor engine)
- **AI**: Ollama (local model runner) + Code Llama/StarCoder
- **Build Tools**: Docker + local toolchains
- **Package Manager**: npm

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Rust (for Tauri backend)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd code-ai-ide
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Rust dependencies**
   ```bash
   # Install Rust if you haven't already
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   
   # Install Tauri CLI
   cargo install tauri-cli
   ```

4. **Run in development mode**
   ```bash
   npm run tauri:dev
   ```

5. **Build for production**
   ```bash
   npm run tauri:build
   ```

## Project Structure

```
code-ai-ide/
├── src/                    # React frontend source
│   ├── components/         # UI components
│   ├── contexts/          # React contexts
│   └── main.tsx          # Main entry point
├── src-tauri/             # Rust backend
│   ├── src/              # Rust source code
│   ├── Cargo.toml        # Rust dependencies
│   └── tauri.conf.json   # Tauri configuration
├── package.json           # Node.js dependencies
├── tailwind.config.js     # Tailwind CSS configuration
└── vite.config.ts         # Vite build configuration
```

## 🎯 Roadmap

### Phase 1: MVP (12 weeks) ✅
- [x] Editor Core with Monaco Editor
- [x] File management system
- [x] Tabbed interface
- [x] Basic language support
- [x] Command palette
- [x] Terminal integration
- [x] Problems panel
- [x] Output panel
- [x] Sample projects (Python, TypeScript, Rust)
- [x] File system integration hooks
- [x] Command runner hooks
- [x] Project configuration system

### Phase 2: Language Support (3-6 months)
- [ ] LSP integration for enhanced language features
- [ ] C#, Python, JavaScript/TypeScript support
- [ ] Java, Go, Rust support
- [ ] Build and run systems
- [ ] Debugging integration

### Phase 3: AI Integration (6-9 months)
- [ ] Ollama integration
- [ ] Code Llama model support
- [ ] Inline AI suggestions
- [ ] AI chat interface
- [ ] Code completion and fixes

### Phase 4: Advanced Features (9-12 months)
- [ ] Plugin system
- [ ] Community marketplace
- [ ] Cloud integration
- [ ] Collaboration features
- [ ] Performance optimizations

## Configuration

### vibeconfig.json
Create a `vibeconfig.json` file in your project root for custom build and test commands:

```json
{
  "name": "my-project",
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
  }
}
```

## Customization

### Themes
The IDE supports custom themes through CSS variables. Modify `src/index.css` to create your own theme:

```css
:root {
  --ide-bg: #1a1a1a;
  --ide-sidebar: #2d2d2d;
  --ide-accent: #007acc;
  /* Add more custom colors */
}
```

### Keybindings
Customize keybindings in the Monaco Editor configuration within `src/components/MonacoEditor.tsx`.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Acknowledgments

- [Tauri](https://tauri.app/) - Desktop framework
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
- [Ollama](https://ollama.ai/) - Local AI model runner
- [VS Code](https://code.visualstudio.com/) - Inspiration for UI/UX

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

---

**Built with ❤️ by the Code AI IDE Team**
