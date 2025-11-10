# Framez-HNG-13-Stage-4
HNG Internship Frontend Track Stage 4 Task

# Framez - Social Mobile Application 📱

> A modern, Instagram-inspired social mobile application built with React Native, TypeScript, Expo, React Navigation, and Convex.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)

## ✨ Features

- ✅ **Authentication**: Secure sign-up, login, and logout with persistent sessions
- ✅ **Post Creation**: Share posts with text and images (uploaded to Cloudinary)
- ✅ **Feed**: View all posts in chronological order with pull-to-refresh
- ✅ **Profile**: View user profile with personal posts and statistics
- ✅ **React Navigation**: Professional navigation with stack and tab navigators
- ✅ **Modern UI**: Dark theme, frosted glass effects, rounded images
- ✅ **Real-time Updates**: Powered by Convex for instant data synchronization
- ✅ **Session Persistence**: Stay logged in across app restarts

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React Native + Expo |
| **Language** | TypeScript |
| **Navigation** | React Navigation (Stack + Bottom Tabs) |
| **Backend** | Convex (Real-time database) |
| **State Management** | Zustand + AsyncStorage |
| **Image Upload** | Cloudinary |
| **Icons** | Lucide React Native |
| **UI** | StyleSheet with themed colors |

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ and npm/yarn
- **Expo CLI**: `npm install -g expo-cli`
- **Convex CLI**: `npm install -g convex`
- **Cloudinary Account**: [Sign up here](https://cloudinary.com)
- **Expo Go App**: Download from [App Store](https://apps.apple.com/app/expo-go/id982107779) or [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## 🚀 Quick Start

### 1️⃣ Create Project

```bash
# Create new Expo project with TypeScript
npx create-expo-app framez --template blank-typescript
cd framez
```

### 2️⃣ Install Dependencies

```bash
# Core dependencies
npm install convex zustand @react-native-async-storage/async-storage

# React Navigation
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

# Image handling & UI
npm install expo-image-picker expo-file-system lucide-react-native react-native-svg expo-status-bar
```

### 3️⃣ Setup Convex Backend

```bash
# Initialize Convex
npx convex dev
```

This will:
1. Create a `convex/` folder
2. Open your browser for authentication
3. Create a new Convex project
4. Generate `convex.json` with your deployment URL

### 4️⃣ Configure Cloudinary

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to **Settings** → **Upload** → **Add upload preset**
3. Set preset mode to **"unsigned"**
4. Note your **Cloud Name** and **Preset Name**

### 5️⃣ Setup Environment Variables

Create `.env` in the root directory:

```bash
EXPO_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 6️⃣ Create Project Structure

```bash
mkdir -p src/{components,screens,navigation,store,theme,types,utils}
mkdir -p convex
```

### 7️⃣ Copy Files

Copy all the TypeScript files from the artifacts into the appropriate folders:

```
framez/
├── App.tsx
├── src/
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── TabNavigator.tsx
│   │   └── types.ts
│   ├── screens/
│   │   ├── AuthScreen.tsx
│   │   ├── HomeFeed.tsx
│   │   ├── CreatePost.tsx
│   │   └── ProfileScreen.tsx
│   ├── components/
│   │   ├── Button.tsx
│   │   └── PostCard.tsx
│   ├── store/
│   │   └── authStore.ts
│   ├── theme/
│   │   └── colors.ts
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       └── cloudinary.ts
├── convex/
│   ├── schema.ts
│   ├── auth.ts
│   └── posts.ts
└── package.json
```

### 8️⃣ Run the App

**Terminal 1** - Start Convex backend:
```bash
npx convex dev
```

**Terminal 2** - Start Expo:
```bash
npm start
```

### 9️⃣ Test on Your Device

1. Open **Expo Go** app on your phone
2. Scan the QR code from the terminal
3. App will load on your device! 🎉

## 📂 Project Structure Explained

### Navigation Architecture

The app uses React Navigation with a clear hierarchy:

```
Root Navigator (Stack)
├── Auth Navigator (if not authenticated)
│   └── Login Screen
└── Tab Navigator (if authenticated)
    ├── Home Tab (Stack)
    │   └── HomeFeed
    ├── Create Tab (Stack)
    │   └── CreatePost
    └── Profile Tab (Stack)
        └── Profile
```

**Key Files:**
- `AppNavigator.tsx` - Root navigator that switches between Auth and Main App
- `AuthNavigator.tsx` - Stack navigator for authentication screens
- `TabNavigator.tsx` - Bottom tab navigator with frosted glass effect
- `types.ts` - TypeScript definitions for all navigation params

### Component Architecture

**Reusable Components:**
- `Button.tsx` - 3 variants (primary, secondary, outline) with loading states
- `PostCard.tsx` - Instagram-style post display with like/comment actions

**Screens:**
- `AuthScreen.tsx` - Login/Register with validation
- `HomeFeed.tsx` - Real-time feed with pull-to-refresh
- `CreatePost.tsx` - Post creation with image upload
- `ProfileScreen.tsx` - User profile with stats and posts

### State Management

**Zustand Store** (`authStore.ts`):
```typescript
{
  user: User | null,
  token: string | null,
  isAuthenticated: boolean,
  setUser: (user, token) => void,
  logout: () => void
}
```

Persisted to AsyncStorage for session persistence.

### Theme System

All colors are centrally defined in `src/theme/colors.ts`:

```typescript
THEME = {
  primary: '#E1306C',      // Instagram pink
  secondary: '#405DE6',    // Royal blue
  tertiary: '#5851DB',     // Purple
  background: '#000000',   // Black
  surface: '#1A1A1A',      // Dark gray
  text: '#FFFFFF',         // White
  textSecondary: '#A0A0A0' // Gray
}
```

## 🎨 Design Features

### Bottom Tab Navigation
- **Frosted glass effect** with blur backdrop
- **Active state indicators** with color changes
- **Icon + label** for each tab
- **Adapts to iOS/Android** with appropriate padding

### Post Images
- **Rounded corners** (24px border radius)
- **Max height** of 400px (≈60% of screen)
- **Smooth loading** with placeholder
- **Tap to like** with heart animation

### UI/UX Highlights
- Dark theme optimized for OLED displays
- Consistent spacing and typography
- Pull-to-refresh on feeds
- Loading states for all async operations
- Form validation with helpful error messages

## 🔧 Convex Backend

### Schema (`convex/schema.ts`)

**Users Table:**
```typescript
{
  email: string,
  name: string,
  avatar?: string,
  passwordHash: string,
  createdAt: number
}
```

**Posts Table:**
```typescript
{
  userId: Id<"users">,
  userName: string,
  content: string,
  imageUrl?: string,
  timestamp: number,
  likes: Id<"users">[]  // Array of user IDs
}
```

### Functions

**Authentication:**
- `auth.register(email, name, password)` - Create new account
- `auth.login(email, password)` - Login user
- `auth.getCurrentUser(userId)` - Get user details

**Posts:**
- `posts.createPost(...)` - Create new post
- `posts.getAllPosts(limit)` - Get all posts (paginated)
- `posts.getUserPosts(userId)` - Get user's posts
- `posts.toggleLike(postId, userId)` - Like/unlike post

### Extending the API

The posts query is designed for easy pagination:

```typescript
// Current: Get 50 most recent posts
const posts = useQuery(api.posts.getAllPosts, { limit: 50 });

// Future: Add cursor-based pagination
const posts = useQuery(api.posts.getAllPosts, { 
  limit: 20,
  cursor: lastPostId 
});
```

## 📱 Building & Deployment

### Development Testing

```bash
# Expo Go (fastest for development)
npm start

# iOS Simulator (requires macOS)
npm run ios

# Android Emulator
npm run android
```

### Production Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build Android APK
eas build --platform android --profile preview

# Build iOS IPA (requires Apple Developer account)
eas build --platform ios --profile preview
```

### Deploy to Appetize.io

1. Build Android APK: `eas build --platform android --profile preview`
2. Wait for build to complete (~10-15 minutes)
3. Download the APK file
4. Go to [appetize.io/upload](https://appetize.io/upload)
5. Upload APK and configure:
   - **Platform**: Android
   - **Device**: Pixel 4 or similar
   - **OS Version**: Android 12+
6. Copy your public link: `https://appetize.io/app/xxxxx`

## 🎥 Demo Video Guide

### Script (2-3 minutes)

**0:00-0:20 - Introduction**
- Show app splash screen
- "Welcome to Framez - a social media app for sharing moments"
- Navigate to login screen

**0:20-0:40 - Authentication**
- Click "Sign Up"
- Fill in name, email, password
- Show form validation
- Successfully register and auto-login

**0:40-1:10 - Home Feed**
- Scroll through existing posts
- Tap heart to like a post (show animation)
- Point out timestamps and user avatars
- Pull down to refresh feed

**1:10-1:50 - Create Post**
- Tap "Create" tab in bottom navigation
- Type post content: "Beautiful sunset at the beach! 🌅"
- Tap "Add Photo" button
- Select image from gallery
- Show Cloudinary upload progress
- Tap "Share Post"
- Navigate back to Home to see new post at top

**1:50-2:20 - Profile**
- Tap "Profile" tab
- Show user stats (posts count, total likes)
- Scroll through personal posts
- Demonstrate consistent UI across all screens

**2:20-2:45 - Session Persistence**
- Go to phone home screen
- Force close Expo Go app completely
- Reopen app
- Show user is still logged in (no login screen)
- Navigate through app to prove session persisted

**2:45-3:00 - Closing**
- Quick recap of features
- Show GitHub repository
- Display Appetize.io link
- "Thanks for watching!"

### Recording Tips

- Use screen recording with device frame
- Add captions for key actions
- Keep transitions smooth
- Show loading states and animations
- Include both successful flows and edge cases
- Use a consistent test account

## 🐛 Troubleshooting

### Common Issues

**"Cannot find module 'convex'"**
```bash
npm install convex
npx convex dev
```

**Navigation types not found**
```bash
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
```

**Images not uploading**
- Check Cloudinary credentials in `.env`
- Ensure upload preset is set to "unsigned"
- Verify internet connection

**App crashes on startup**
- Check `EXPO_PUBLIC_CONVEX_URL` is set correctly
- Ensure `npx convex dev` is running
- Clear Expo cache: `npx expo start -c`

**Bottom tab bar not showing**
- Check `tabBarStyle` in `TabNavigator.tsx`
- Ensure `paddingBottom` accounts for device safe area

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation Docs](https://reactnavigation.org/docs/getting-started)
- [Convex Documentation](https://docs.convex.dev/)
- [Cloudinary Upload Guide](https://cloudinary.com/documentation/upload_images)
- [React Native TypeScript](https://reactnative.dev/docs/typescript)

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Instagram for UI/UX inspiration
- Expo team for amazing developer tools
- Convex for real-time backend infrastructure
- React Navigation for routing solution
- Cloudinary for image hosting

---

**Built with ❤️ using React Native, TypeScript, and Expo**

*Star ⭐ this repo if you found it helpful!*