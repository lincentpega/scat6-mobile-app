# CLAUDE.md

## Common commands

- Install dependencies: `npm install`
- Start development server: `npx expo start`
- Start on Android `npm run android`
- Start on iOS: `npm run ios`
- Start for web: `npm run web`
- Lint: `npm run lint`
- Reset project: `npm run reset-project`

## Project architecture

- TypeScript (strict mode) with Expo/React Native, using file-based routing in `app/`.
- Main application logic and views are in `app/`. Each route corresponds to a file or directory here.
- Shared logic and domain models are under `model/` (assessment/data DTOs/enums) and `services/` (API, storage, and auth).
- Application state is managed via React contexts (`contexts/`).
- Absolute imports with `@/` alias map to the project root.
- Uses expo-router for navigation.