import { Component } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 text-center">
        <div className="absolute w-96 h-96 rounded-full bg-red-500/5 blur-3xl pointer-events-none" />

        <div className="relative space-y-6 max-w-md">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertTriangle size={36} className="text-red-400" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-black text-foreground">Something Went Wrong</h1>
            <p className="text-muted mt-2 text-sm leading-relaxed">
              An unexpected error occurred. Try refreshing, or go back to the dashboard.
            </p>

            {this.state.error && (
              <div className="mt-4 text-left bg-overlay/5 border border-border/10 rounded-xl px-4 py-3 max-h-28 overflow-auto">
                <p className="text-[11px] font-mono text-red-400 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary text-foreground text-sm font-bold transition-colors"
            >
              <RefreshCw size={15} />
              Try Again
            </button>
            <a
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl border border-border/10 bg-overlay/5 hover:bg-overlay/10 text-foreground/80 text-sm font-semibold transition-colors"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }
}
