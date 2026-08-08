import React from 'react'

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg ${className}`} style={{background:'var(--bg-secondary)'}} />
}

export function CardSkeleton() {
  return (
    <div className="card p-4 space-y-3">
      <Skeleton className="h-40 w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  )
}
