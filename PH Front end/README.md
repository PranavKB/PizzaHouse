# Pizza House Frontend

A modern React + TypeScript frontend for the Pizza House ordering system. Built with Vite for fast development and optimized builds.

## Technologies Used

- React 18
- TypeScript
- Vite
- SCSS / CSS Modules
- ESLint (with recommended and type-checked rules)
- React Context API
- Axios (or fetch for API calls)

## Features

- User authentication and session management
- Dynamic pizza menu with filtering and sorting
- Shopping cart and order management
- Profile management
- Responsive UI for mobile and desktop
- API integration with the Pizza House backend

## Project Structure

```
PH Front end/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images, icons, etc.
│   ├── components/         # Reusable UI components
│   ├── config/             # Configuration files/constants
│   ├── context/            # React Context providers
│   ├── pages/              # Route-level components
│   ├── services/           # API modules (e.g., axios)
│   ├── styles/             # SCSS/CSS modules
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # ReactDOM entry point
│   ├── index.css           # Global styles
│   └── vite-env.d.ts       # Vite env types
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

3. **Lint and format code**
   ```bash
   npm run lint
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env` file in the root for API endpoints and secrets:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

## API Integration

This frontend communicates with the Pizza House backend (Spring Boot).  
Update API endpoints in `src/config` as needed.

## Best Practices

- Use TypeScript for type safety.
- Organize code into `components`, `pages`, and feature folders.
- Use React Context for shared state (auth, cart, etc).
- Write modular SCSS/CSS for component-level styles.
- Follow ESLint and Prettier for code quality.
- Use environment variables for API URLs and secrets.
- Store assets in `public` and `src/assets`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes with clear messages
4. Push to your branch
5. Create a Pull Request


---

For backend setup and more details, see [`PH Back end/README.md`](../PH%20Back%20end/README.md).