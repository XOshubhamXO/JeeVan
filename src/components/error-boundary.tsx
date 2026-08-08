'use client'

/**
 * JeeVan Global Error Boundary
 * Catches any client-side crash and shows a friendly fallback.
 */

import React from 'react'

interface Props { children: React.ReactNode }
interface State { hasError: boolean; error: Error | null }

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[JeeVan Error]', error.message, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a1508] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-green-900/30 border border-green-700/30 flex items-center justify-center">
              <span className="text-2xl font-bold text-green-300">J</span>
            </div>
            <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
            <p className="text-sm opacity-50 mb-6">
              {this.state.error?.message || 'An unexpected error occurred. Please refresh the page.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
              className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 transition-colors font-medium"
            >
              Refresh Page
            </button>
            <p className="mt-8 text-xs opacity-30">JeeVan · Nalanda, Bihar</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
