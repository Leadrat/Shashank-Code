# Frontend React Application

## Getting Started

```bash
cd Frontend
npm install
npm run dev
```

The app will be available at: `http://localhost:5173`

## Technologies Used

- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **React Router**: Navigation
- **Axios**: HTTP client
- **Tailwind CSS**: Styling

## Project Structure

```
src/
├── components/       # Reusable components (LoadingSpinner, Toast)
├── pages/           # Page components
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── GamePage.jsx
│   ├── ScoreboardPage.jsx
│   └── AdminPanel.jsx
├── services/        # API integration
│   └── api.js       # API client configuration
├── App.jsx          # Main app component with routing
└── main.jsx         # Entry point
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Configuration

Update API endpoint in `src/services/api.js` if backend runs on different port.
