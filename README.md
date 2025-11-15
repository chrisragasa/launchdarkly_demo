# LaunchDarkly Quickstart Demo

A minimal React application demonstrating the basic functionality of LaunchDarkly feature flags using their official Quickstart Guide.

## Purpose

This project showcases:
- **LaunchDarkly SDK integration** with React
- **Real-time feature flag evaluation** with instant updates (no page reload required)
- **Environment variable management** for secure client-side ID configuration
- **Simple flag-based UI rendering** - background color changes based on flag state

## Tech Stack

- **Vite** - Fast build tool and dev server
- **React 18** - UI framework
- **TypeScript** - Type safety
- **LaunchDarkly React SDK** - Feature flag management

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A LaunchDarkly account (free tier works!)

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Create a `.env.local` file in the project root:
   ```bash
   VITE_LD_CLIENT_SIDE_ID=your-client-side-id-here
   ```
   
   **Where to find your Client-side ID:**
   - Log in to LaunchDarkly
   - Go to **Account Settings** → **Projects** → Select your project
   - Go to **Environments** tab
   - Select your environment (e.g., **Test**)
   - Copy the **Client-side ID** (NOT the SDK key)

3. **Create a feature flag in LaunchDarkly:**
   - Go to your LaunchDarkly dashboard
   - Click **Create flag**
   - Set the **key** to: `new-pricing-calculator`
   - Set the **type** to: Boolean
   - Save the flag
   - Toggle it ON or OFF to test

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:5173](http://localhost:5173)

## How It Works

The app demonstrates real-time feature flag evaluation:

- **Flag ON (true)** → Background turns **green**
- **Flag OFF (false)** → Background turns **red**

Toggle the flag in LaunchDarkly's dashboard and watch the UI update **instantly** without refreshing the page - this demonstrates LaunchDarkly's real-time streaming capabilities.

## Project Structure

```
launchdarkly_demo/
├── src/
│   ├── main.tsx          # LaunchDarkly provider setup
│   └── App.tsx           # Flag evaluation demo
├── .env.local            # Environment variables (create this)
├── .env.example          # Template for environment variables
└── package.json
```

## Key Code Patterns

**Initializing the SDK** (`main.tsx`):
```typescript
import { LDProvider } from 'launchdarkly-react-client-sdk';

const clientSideID = import.meta.env.VITE_LD_CLIENT_SIDE_ID;

<LDProvider clientSideID={clientSideID} context={context}>
  <App />
</LDProvider>
```

**Reading flags** (`App.tsx`):
```typescript
import { useFlags } from 'launchdarkly-react-client-sdk';

const { newPricingCalculator } = useFlags();
// Use the flag value in your component
```

## Environment Variables

This project uses Vite's environment variable system:

- Variables must be prefixed with `VITE_` to be exposed to the client
- Store sensitive values in `.env.local` (git-ignored)
- The `.env.example` file shows the required variables
