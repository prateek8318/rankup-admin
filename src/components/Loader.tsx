interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

const Loader = ({ size = 'medium', text = 'Loading...' }: LoaderProps) => {
  const sizeStyles = {
    small: { width: '20px', height: '20px' },
    medium: { width: '40px', height: '40px' },
    large: { width: '60px', height: '60px' }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '400px',
      gap: '16px'
    }}>
      <div 
        style={{
          ...sizeStyles[size],
          border: '3px solid #e3f2fd',
          borderTop: `3px solid #2563eb`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}
      />
      <div style={{ 
        color: '#2563eb', 
        fontSize: '16px', 
        fontWeight: '500',
        textAlign: 'center'
      }}>
        {text}
      </div>
    </div>
  );
};

// Add spinner animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

export default Loader;

