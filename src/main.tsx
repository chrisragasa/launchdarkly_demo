import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LDProvider } from 'launchdarkly-react-client-sdk';
import App from './App';

const clientSideID = import.meta.env.VITE_LD_CLIENT_SIDE_ID;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LDProvider clientSideID={clientSideID}>
      <App />
    </LDProvider>
  </StrictMode>,
);
