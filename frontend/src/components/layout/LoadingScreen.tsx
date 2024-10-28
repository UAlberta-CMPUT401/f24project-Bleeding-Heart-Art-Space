import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div style={containerStyle}>
      <div style={spinnerStyle} />
      <h2>Loading, please wait...</h2>
    </div>
  );
};

// Define the container style
const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#f5f5f5',
};

// Define the spinner style
const spinnerStyle: React.CSSProperties = {
  width: '50px',
  height: '50px',
  border: '6px solid #f3f3f3',
  borderTop: '6px solid #3498db',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

// Adding global CSS for the spinner animation
const globalStyles = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Inject global styles for the keyframe animation
const styleTag = document.createElement('style');
styleTag.innerHTML = globalStyles;
document.head.appendChild(styleTag);

export default LoadingScreen;
