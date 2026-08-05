'use client';

import React from 'react';
import { ErrorView } from './errors/ErrorView';

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

  private reset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorView
          error={this.state.error}
          onRetry={this.reset}
          title="A section of this page stopped working."
          message="The failure has been contained. You can retry without losing access to the rest of the website."
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
