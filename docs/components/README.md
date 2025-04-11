# Component Documentation

## Core Components

### MainMenu
The main title screen component that provides access to all game modes and settings.

```typescript
interface MainMenuProps {
  // No props needed - uses Redux for state management
}

// Features:
- Title display
- Navigation buttons (New Game, Load Game, Co-op, Settings, Exit)
- Sound toggle
- Version display
- Animated background with clouds and farm scene
```

### SaveSlotManager
Manages save game slots for creating new games or loading existing ones.

```typescript
interface SaveSlotProps {
  // No props needed - uses Redux for state management
}

// Features:
- Multiple save slots
- Save slot status display
- Character name display
- Day count display
```

### Game
The main game container that manages the game world and player interactions.

```typescript
interface GameProps {
  // No props needed - uses Redux for state management
}

// Features:
- Game world rendering
- Player character display
- HUD elements
- Time management
```

### CharacterCreator
Character customization interface for new games.

```typescript
interface CharacterCreatorProps {
  // No props needed - uses Redux for state management
}

// Features:
- Name input
- Character customization
- Starting options
```

## UI Components

### Common UI Elements
- Pixel-styled buttons
- Dialog boxes
- Menu containers
- Input fields

### HUD Elements
- Time display
- Energy meter
- Money counter
- Tool selection
- Inventory display

## Styling

### CSS Classes
- `.pixel-container`: Base container with pixel font
- `.pixel-button`: Standard button styling
- `.pixel-menu`: Menu container styling
- `.pixel-hud`: HUD element styling
- `.main-menu-bg`: Main menu background

### Animations
- Cloud movement
- Button hover effects
- Character movement
- Menu transitions

## State Management

### Redux Integration
All components use Redux for state management:
- `useSelector` for state access
- `useDispatch` for actions
- No prop drilling needed

### Component State
Local state is used minimally, only for:
- Form inputs
- Animations
- Temporary UI states 