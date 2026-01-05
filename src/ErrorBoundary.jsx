import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          backgroundColor: '#fee',
          color: '#c00',
          fontFamily: 'monospace',
          fontSize: '14px',
          borderRadius: '4px',
          margin: '20px'
        }}>
          <h2>⚠️ Application Error</h2>
          <p><strong>Error:</strong> {this.state.error?.toString()}</p>
          {this.state.errorInfo && (
            <details style={{ whiteSpace: 'pre-wrap' }}>
              <summary>Error Details</summary>
              {this.state.errorInfo.componentStack}
            </details>
          )}
          <p style={{ marginTop: '20px', fontSize: '12px' }}>
            Check browser console for more details
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
