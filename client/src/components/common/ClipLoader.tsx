export default function ClipLoader({ label = 'Loading' }: { label?: string }) {
  return <span className="clip-loader" aria-label={label} />;
}
