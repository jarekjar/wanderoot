# Wanderoot Documentation

Wanderoot is a Stardew Valley-inspired farming game built with React and TypeScript. This documentation covers the technical implementation, game design, and development progress.

## Table of Contents

- [Game Design](./docs/design/game-design.md)
- [Technical Architecture](./docs/technical/architecture.md)
- [Development Progress](./docs/progress/development-log.md)
- [Component Documentation](./docs/components/README.md)

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open `http://localhost:5173` in your browser

## Project Structure

```
src/
├── components/     # React components
├── state/         # Redux state management
├── theme/         # Theme configuration
├── utils/         # Utility functions
└── types/         # TypeScript type definitions

docs/
├── design/        # Game design documents
├── technical/     # Technical documentation
├── progress/      # Development progress logs
└── components/    # Component documentation
```

## Tech Stack

- React 18
- TypeScript
- Redux Toolkit
- Tailwind CSS
- Vite

## Development Status

Wanderoot is currently in early development. The following features are implemented:

- ✅ Main menu with pixel art styling
- ✅ Save slot system
- ✅ Basic game state management
- ✅ Character creation interface
- ✅ Game loop foundation
- ✅ Input handling system

### In Progress

- 🚧 Farm world rendering
- 🚧 Player movement system
- 🚧 Time and weather system
- 🚧 Inventory management

### Planned Features

- 📅 Crop planting and harvesting
- 📅 Tool system
- 📅 NPC interactions
- 📅 Multiplayer support
- 📅 Achievement system

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](./docs/CONTRIBUTING.md) for details on how to get started.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
