# Wanderoot

A charming pixel-art farming and exploration game built with React, Electron, and PixiJS.

## 🎮 Current Development Status

Wanderoot is currently in early development (v0.1.0). Key features implemented:
- Basic game menu and settings interface
- Sound system with background music and effects
- Pause functionality
- Dialogue system
- Basic UI theming

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/wanderoot.git
cd wanderoot
```

2. Install dependencies:
```bash
npm install
```

### Development

Run the development version with hot reload:
```bash
npm run electron-dev
```

This will:
- Start the Vite development server
- Launch the Electron application
- Enable hot reload for both frontend and Electron processes

### Building

Create a production build:
```bash
npm run electron-pack
```

This generates:
- A portable Windows executable in the `release` directory
- Named format: `Wanderoot-win32-x64-portable.exe`

## 🏗️ Project Structure

```
wanderoot/
├── electron/          # Electron main process files
├── public/           
│   └── assets/       # Game assets (audio, images)
├── src/
│   ├── components/   # React components
│   ├── state/        # Redux store and slices
│   └── utils/        # Utility functions
└── dist/             # Production build output
```

## 🔧 Technical Stack

- **Frontend**: React 19, TypeScript
- **State Management**: Redux Toolkit
- **Game Engine**: PixiJS 8
- **Build Tools**: Vite, Electron Builder
- **Audio**: Howler.js
- **Styling**: Tailwind CSS

## 🎵 Audio System

The game features a dynamic audio system with:
- Background music that responds to game state
- Sound effects for UI interactions
- Volume control
- Automatic pause handling

## 🚀 Release Process

1. Update version in `package.json`
2. Create and push a new tag:
```bash
git tag v[version]
git push origin main --tags
```
3. GitHub Actions will automatically:
   - Build the application
   - Create a GitHub release
   - Attach the portable executable

## 🤝 Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a Pull Request

## 📝 License

[Your chosen license]

## 🙏 Acknowledgments

- [List any credits, inspirations, or resources used]
