# Movie Democracy 🎬

When your friends spend more time arguing about what movie to watch than actually watching one... Let democracy handle the drama! 🗳️✨

A fun and interactive web app that helps groups decide which movie to watch! No more endless debates - let democracy decide your movie night.

## Features ✨

- Add participants and their movie suggestions
- Automatic random voting order
- Real-time vote tracking
- Beautiful dark theme UI
- Tie-breaker system
- Confetti celebration for winners! 🎉

## Prerequisites 📋

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Yarn](https://yarnpkg.com/) (recommended) or npm

## Installation 🚀

1. Clone the repository
```bash
git clone https://github.com/TGduino/Movie-Democracy.git
cd movie-democracy
```

2. Install dependencies
```bash
# Using Yarn (recommended)
yarn install

# Using npm
npm install
```

## Running the App 🎮

1. Start the development server
```bash
# Using Yarn
yarn dev

# Using npm
npm run dev
```

2. Open your browser and navigate to `http://localhost:5173`

## How to Use 🎯

1. **Setup Phase**
   - Add at least 3 participants
   - Each participant suggests one movie
   - Duplicate names or movies are not allowed

2. **Voting Phase**
   - Follow the voting order shown on the left
   - Each participant votes for their preferred movie
   - Can't vote for your own movie

3. **Results**
   - Winner is announced with a celebration
   - In case of a tie, a tie-breaker round begins
   - Start a new game anytime

## Tech Stack 💻

- React 18
- TypeScript
- Vite
- Chakra UI
- Emotion (for styled components)

## Development 🛠️

To build for production:
```bash
# Using Yarn
yarn build

# Using npm
npm run build
```

To preview the production build:
```bash
# Using Yarn
yarn preview

# Using npm
npm run preview
```

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Troubleshooting 🔧

### Common Issues

1. **Long Path Issues (Windows)**
   - Enable long paths in Windows
   - Use a shorter installation directory

2. **Node.js Not Found**
   - Ensure Node.js is properly installed
   - Add Node.js to your system's PATH

3. **Package Manager Issues**
   - Try using Yarn instead of npm
   - Clear package manager cache
   ```bash
   yarn cache clean
   # or
   npm cache clean --force
   ```

### Still Having Issues?

Open an issue in the GitHub repository with:
- Your operating system
- Node.js version (`node -v`)
- Package manager and version
- Error message
- Steps to reproduce 
