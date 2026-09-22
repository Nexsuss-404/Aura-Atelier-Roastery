import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetState = () => {
    try {
      localStorage.removeItem('aura_coffee_cart_items');
      localStorage.removeItem('aura_coffee_orders');
      localStorage.removeItem('aura_coffee_loyalty_user');
    } catch {
      // ignore
    }
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F7F4] text-[#1A1A18] flex items-center justify-center p-4 sm:p-8 font-sans">
          <div className="max-w-md w-full bg-white border border-[#1A1A18]/15 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 text-amber-800 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#9D8461] block">
                Session Recovered
              </span>
              <h2 className="font-serif text-3xl font-light text-[#1A1A18] tracking-[-0.02em]">
                Something Interrupted the Atelier
              </h2>
              <p className="text-xs sm:text-sm text-[#1A1A18]/70 leading-relaxed [text-wrap:pretty]">
                The application encountered an unexpected state. Your persisted roastery preferences and orders are guarded.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left bg-[#F8F7F4] border border-[#1A1A18]/10 rounded-xl p-3 text-[11px] font-mono text-[#1A1A18]/70 max-h-24 overflow-y-auto break-all">
                {this.state.error.message || 'Unknown runtime exception'}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 px-4 py-2.5 rounded-full border border-[#1A1A18] bg-[#1A1A18] text-[#F8F7F4] text-xs font-medium uppercase tracking-[0.06em] hover:bg-transparent hover:text-[#1A1A18] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload App</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetState}
                className="flex-1 px-4 py-2.5 rounded-full border border-[#1A1A18]/20 bg-white text-[#1A1A18] text-xs font-medium uppercase tracking-[0.06em] hover:border-red-600 hover:text-red-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Cache</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
