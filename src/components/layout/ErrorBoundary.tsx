// components/ErrorBoundary.tsx
'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Client-side error:', error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center p-4">
            <div
              className="max-w-md w-full text-center p-8 rounded-2xl shadow-lg border"
              style={{
                backgroundColor: 'white',
                borderColor: 'rgba(239, 68, 68, 0.2)',
              }}
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Oops! Something went wrong
              </h2>

              <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
                <p className="text-red-700 font-medium mb-2">Error Details:</p>
                <p className="text-red-600 text-sm">
                  {this.state.error?.message || 'An unexpected error occurred'}
                </p>
              </div>

              <p className="text-gray-600 mb-8">
                We apologize for the inconvenience. Please try refreshing the
                page or contact support if the problem persists.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleRefresh}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Page
                </button>

                <button
                  onClick={() => this.setState({ hasError: false })}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Try Again
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-500 text-sm">
                  Need help?{' '}
                  <a
                    href="mailto:support@wisdomhouse.com"
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Contact Support
                  </a>
                </p>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
