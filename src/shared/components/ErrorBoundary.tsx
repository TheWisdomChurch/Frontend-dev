'use client';

import React from 'react';

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo | null;
};

class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, errorInfo: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
    this.setState({ errorInfo: info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center px-6 text-center">
          <div className="max-w-md">
            <h2 className="text-xl font-semibold text-white">
              Something went wrong
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Please refresh the page or try again later.
            </p>
            {/* Show component stack in development only */}
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-4 text-left text-xs text-red-400">
                <summary>Component Stack</summary>
                <pre className="mt-2 whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
