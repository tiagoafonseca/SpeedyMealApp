# SpeedyMeal

A minimalist iOS recipe app that helps you decide what to eat — fast. Search by ingredient or dish, browse by category, save your favourites, and let the app surprise you when you can't choose.

---

## Features

- **Search** — find recipes by ingredient or dish name
- **Browse** — filter by category (Beef, Chicken, Seafood, Vegetarian, Pasta, Dessert)
- **Discover** — diverse home feed pulling from multiple food categories
- **Detail view** — ingredients list, step-by-step instructions
- **Favourites** — save and revisit meals, persisted locally
- **Surprise Me** — get a random recipe instantly
- **Auth** — sign up, log in, forgot password, and reset password flow
- **Reset Password** — standalone web page for updating your password via email link

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo (TypeScript) |
| Navigation | React Navigation (NativeStack + BottomTabs) |
| Auth | Supabase Auth (email/password) |
| Recipe data | TheMealDB (free, no API key required) |
| State | React Context + hooks |
| Storage | AsyncStorage (session + favourites) |
| Email | Resend (custom domain SMTP) |
| Reset page | Standalone HTML hosted on Netlify |

---

## Where to Find It

| Resource | URL |
|---|---|
| GitHub repository | https://github.com/tiagoafonseca/SpeedyMeal |
| Password reset page | https://your-netlify-site.netlify.app |
| Supabase project | https://umzguideuxcypcnimypx.supabase.co |

> **Note:** The app runs on Expo Go during development. A production build with TestFlight distribution is planned for a future release.

---

## Branches

| Branch | Purpose |
|---|---|
| `main` | Production-ready code |
| `develop` | Active development |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npx expo start --tunnel

# Scan the QR code with Expo Go on your iPhone
```

---

## Pending Before Production

- [ ] Move Supabase credentials to environment variables (`.env`)
- [ ] Update Figma design with Favourites, Profile, and Bottom Nav screens
- [ ] Apple Developer account + TestFlight setup
