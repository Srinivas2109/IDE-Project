# 🚀 Code AI IDE Demo Guide

Welcome to Code AI IDE! This guide will walk you through the key features and help you get started with development.

## 🎯 Quick Start

### 1. Launch the IDE
- The IDE should already be running at `http://localhost:1420/`
- You'll see a modern, VS Code-like interface with a dark theme

### 2. Explore the Interface
- **Left Sidebar**: File explorer, search, git, and other tools
- **Main Area**: Code editor with Monaco Editor (same as VS Code)
- **Bottom Panel**: Terminal, problems, output, and debug console
- **Top Toolbar**: Save, run, debug, and other actions

## 🎮 Try These Features

### Command Palette
- Press `Ctrl+P` (or `Cmd+P` on Mac)
- Type "toggle" to see available commands
- Try "Toggle Sidebar" or "Toggle Panel"

### File Navigation
- Click on the Explorer icon in the sidebar
- Navigate through the sample projects
- Click on files to open them in tabs

### Code Editing
- Open any sample file (e.g., `samples/python/main.py`)
- See syntax highlighting in action
- Try typing some code - notice autocomplete
- Use `Ctrl+S` to save (though it's auto-save for now)

### Terminal
- Click the terminal icon in the bottom panel
- Type `help` to see available commands
- Try `version` to see IDE version
- Use `clear` to clear the terminal

## 🐍 Python Sample Project

### Open the Project
1. Navigate to `samples/python/` in the file explorer
2. Click on `main.py` to open it
3. Notice the Python syntax highlighting

### Run the Project
1. Open the terminal (bottom panel)
2. Navigate to the Python sample:
   ```bash
   cd samples/python
   ```
3. Run the calculator:
   ```bash
   python main.py
   ```
4. See the output in the terminal

### Modify the Code
1. In `main.py`, find the `main()` function
2. Add a new calculation, e.g.:
   ```python
   print(f"10 * 5 = {calc.calculate('*', 10, 5)}")
   ```
3. Save the file and run it again

## 🔷 TypeScript Sample Project

### Open the Project
1. Navigate to `samples/typescript/` in the file explorer
2. Click on `src/index.ts` to open it
3. Notice the TypeScript syntax highlighting and IntelliSense

### Install Dependencies
1. Open the terminal
2. Navigate to the TypeScript sample:
   ```bash
   cd samples/typescript
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Build and Run
1. Build the project:
   ```bash
   npm run build
   ```
2. Run in development mode:
   ```bash
   npm run dev
   ```
3. See the server start up in the terminal

## 🦀 Rust Sample Project

### Open the Project
1. Navigate to `samples/rust/` in the file explorer
2. Click on `src/main.rs` to open it
3. Notice the Rust syntax highlighting

### Build the Project
1. Open the terminal
2. Navigate to the Rust sample:
   ```bash
   cd samples/rust
   ```
3. Build the project:
   ```bash
   cargo build
   ```
4. Run the project:
   ```bash
   cargo run -- -u "https://example.com" -o output.json
   ```

## 🛠 IDE Features to Explore

### Syntax Highlighting
- Open files in different languages
- Notice how colors change based on syntax
- Try changing themes (coming soon)

### IntelliSense
- Type code and see autocomplete suggestions
- Hover over functions to see documentation
- Use `Ctrl+Space` to trigger suggestions

### Error Detection
- Make intentional syntax errors
- See them appear in the Problems panel
- Notice real-time error highlighting

### File Management
- Right-click in the file explorer
- Try creating new files and folders
- Use the search functionality

### Terminal Integration
- Run build commands
- Execute scripts
- Navigate the file system

## 🎨 Customization

### Themes
- The IDE comes with a dark theme by default
- More themes will be available in future updates

### Keybindings
- Use `Ctrl+P` to access the command palette
- `Ctrl+S` to save files
- `Ctrl+Shift+P` for more commands (coming soon)

### Layout
- Drag panels to resize them
- Toggle sidebar and bottom panel
- Customize the layout to your preference

## 🚀 Next Steps

### 1. Create Your Own Project
- Use the file explorer to create new directories
- Start coding in your preferred language
- Use the IDE's features to enhance your workflow

### 2. Explore Advanced Features
- Try debugging with breakpoints
- Use the integrated terminal for development
- Explore the command palette for quick actions

### 3. Learn More
- Check out the main README for detailed documentation
- Explore the sample projects to learn best practices
- Join the community for support and feedback

## 🆘 Getting Help

### Common Issues
- **IDE not loading**: Check if the dev server is running
- **Files not opening**: Use the file explorer to navigate
- **Terminal not working**: Make sure the bottom panel is open

### Support
- Check the Problems panel for errors
- Use the terminal for debugging
- Refer to the main README for detailed information

## 🎉 Congratulations!

You've successfully explored Code AI IDE! This is a powerful, modern development environment that combines the best of VS Code with the performance of Tauri and the flexibility of React.

**Happy Coding! 🚀**

---

*This demo guide covers the current MVP features. More advanced features like LSP integration, AI assistance, and debugging will be available in future updates.*
