import React, { useState } from 'react';
import { useCarbonFootprint } from '../useCarbonFootprint';

const CarbonFootprint: React.FC = (props) => {
  const [gCO2, bytesTransferred] = useCarbonFootprint();

  return (
    <div style={styles.container}>
      <h2>Carbon Footprint Overview</h2>
      <p><strong>Bytes Transferred:</strong> {bytesTransferred} bytes</p>
      <p><strong>Total CO2 Emission:</strong> {gCO2.toFixed(4)} grams of CO2</p>
      <p>{props.children}</p>
    </div>
  );
};

// Styles to enhance the visual appearance
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    padding: '20px',
    maxWidth: '400px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
};

const ExampleComponent: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    await fetch('/', { cache: 'no-store' });
    setLoading(false);
  };

  return (
    <CarbonFootprint>
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Data!'}
      </button>
    </CarbonFootprint>
  );
};

export default ExampleComponent;
