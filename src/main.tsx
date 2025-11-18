import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LDProvider } from 'launchdarkly-react-client-sdk';
import App from './App';

const clientSideID = import.meta.env.VITE_LD_CLIENT_SIDE_ID;

// Default user context for LaunchDarkly
const defaultUser = {
  kind: 'user',
  key: 'user-anonymous',
  name: 'Anonymous User',
  email: 'anonymous@example.com',
  role: 'guest',
  region: 'US-West',
  country: 'USA',
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LDProvider 
      clientSideID={clientSideID}
      context={defaultUser}
    >
      <App />
    </LDProvider>
  </StrictMode>,
);
