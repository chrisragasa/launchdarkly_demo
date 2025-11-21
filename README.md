# LaunchDarkly Demo

A React application demonstrating LaunchDarkly's feature flagging, user targeting, experimentation, and AI Configs capabilities through a SaaS pricing page example.

## Getting Started

**New to this project?** Start here:

📖 **[SETUP.md](./SETUP.md)** - Installation instructions, environment configuration, and how to run the application

## Understanding the Code

**Want to understand how it works?** Read this:

🔧 **[TECHNICAL_OVERVIEW.md](./TECHNICAL_OVERVIEW.md)** - Deep dive into LaunchDarkly integration, API usage, and architectural decisions

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment
# Create .env.local with your LaunchDarkly Client-side ID
echo "VITE_LD_CLIENT_SIDE_ID=your-client-side-id" > .env.local

# Run the app
npm run dev
```

See [SETUP.md](./SETUP.md) for detailed instructions.

## Features

- 🚩 **Feature Flags** - Toggle between legacy and new pricing UI
- 🎯 **User Targeting** - Target specific users, roles, or regions
- 🧪 **Experimentation** - A/B test with simulated traffic
- 🤖 **AI Configs** - Dynamic AI assistant personalities (optional)
- 🔄 **Real-time Updates** - Change flags without page refresh

## Tech Stack

- React + TypeScript + Vite
- LaunchDarkly React SDK
- Node.js + Express (backend for AI features)
- OpenAI API (optional)
