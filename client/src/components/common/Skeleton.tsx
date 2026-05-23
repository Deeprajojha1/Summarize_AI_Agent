export default function Skeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="skeleton-card">
      {Array.from({ length: lines }).map((_, index) => <span key={index} />)}
    </div>
  );
}
