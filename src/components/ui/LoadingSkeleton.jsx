export default function LoadingSkeleton({ rows = 3, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton h-14 w-full rounded-xl" style={{ opacity: 1 - i * 0.15 }} />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-card p-5 space-y-4">
      <div className="skeleton h-5 w-1/3 rounded" />
      <div className="skeleton h-10 w-full rounded-xl" />
      <div className="skeleton h-4 w-2/3 rounded" />
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass-card p-5 flex items-center gap-4">
          <div className="skeleton w-12 h-12 rounded-2xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-3 w-2/3 rounded" />
            <div className="skeleton h-6 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
