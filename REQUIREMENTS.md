# CitizenMag - Requirements & Dependencies

## 🔧 System Requirements

### Node.js & Package Manager
- **Node.js**: 18.0.0 or higher
- **npm**: 8.0.0 or higher (or yarn 1.22.0+)

### Operating System
- **Windows**: 10 or higher
- **macOS**: 10.15 or higher
- **Linux**: Ubuntu 18.04+ / CentOS 7+ / Debian 10+

## 📦 Dependencies

### Production Dependencies
- **react**: ^18.2.0
- **react-dom**: ^18.2.0
- **react-router-dom**: ^6.8.0
- **typescript**: ^5.0.0
- **@supabase/supabase-js**: ^2.0.0
- **tailwindcss**: ^3.3.0
- **lucide-react**: ^0.263.0

### Development Dependencies
- **@types/react**: ^18.2.0
- **@types/react-dom**: ^18.2.0
- **@vitejs/plugin-react**: ^4.0.0
- **vite**: ^4.4.0
- **eslint**: ^8.45.0
- **prettier**: ^3.0.0

## 🚀 Installation

### Quick Start
```bash
# Clone the repository
git clone https://github.com/sama-solutions/cityzenmag.git
cd cityzenmag

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

### Environment Variables
Create a `.env.local` file with:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_TWITTER_API_KEY=your_twitter_api_key (optional)
```

## 🔧 Build & Deploy

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Production
```bash
npm run build        # Create optimized build
npm run serve        # Serve production build locally
```

## 📱 PWA Features

### Service Worker
- Automatic caching of static assets
- Offline functionality
- Background sync

### Web App Manifest
- Native app installation
- Custom app icons
- Splash screen configuration

## 🌐 Browser Support

### Minimum Versions
- **Chrome**: 88+
- **Firefox**: 85+
- **Safari**: 14+
- **Edge**: 88+

### PWA Support
- **Chrome**: Full support
- **Firefox**: Partial support
- **Safari**: iOS 14.3+ support
- **Edge**: Full support
