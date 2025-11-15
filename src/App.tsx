import { useFlags } from 'launchdarkly-react-client-sdk';

function App() {
  const { newPricingCalculator } = useFlags();

  return (
    <div style={{ backgroundColor: newPricingCalculator ? 'green' : 'red' }}>
      The newPricingCalculator feature flag evaluates to <b>{newPricingCalculator ? 'true' : 'false'}</b>
    </div>
  );
}

export default App;
