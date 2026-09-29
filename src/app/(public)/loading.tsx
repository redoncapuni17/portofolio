export default function Loading() {
  return (
    <div className="container-page py-20" aria-busy="true" aria-live="polite">
      <div className="h-3 w-24 animate-pulse rounded bg-wash" />
      <div className="mt-5 h-10 w-2/3 max-w-lg animate-pulse rounded-lg bg-wash" />
      <div className="mt-4 h-4 w-1/2 max-w-md animate-pulse rounded bg-wash" />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-2xl border border-line bg-surface" />
        ))}
      </div>
    </div>
  );
}
