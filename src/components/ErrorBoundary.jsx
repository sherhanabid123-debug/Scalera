import React from "react";

/**
 * Minimal error boundary. Wrap decorative / device-dependent subtrees (e.g. the
 * canvas background) so a failure there degrades gracefully instead of taking
 * down the whole page. Renders `fallback` (default: nothing) on error.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // Keep it quiet in production; useful during dev.
    if (import.meta.env.DEV) console.warn("[ErrorBoundary] caught:", error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

export default ErrorBoundary;
