import React, { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('UI Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-white border border-[#ECECEC] rounded-2xl m-4">
          <span className="text-4xl block mb-2">⚠️</span>
          <h2 className="text-lg font-black text-[#0E2A5A] mb-1">Something went wrong rendering this section</h2>
          <p className="text-xs text-slate-500 mb-4">Please refresh the page or return to shopping.</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-[#0E2A5A] text-white font-bold text-xs px-5 py-2.5 rounded-full hover:bg-[#5A3418] transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
