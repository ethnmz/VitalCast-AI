export default function LiveBadge({ label = 'Live inference' }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-secondary rounded-full px-3 py-1 text-xs font-semibold tracking-wide">
      <span className="relative flex items-center justify-center w-2 h-2">
        <span className="absolute inline-flex w-full h-full rounded-full bg-primary opacity-50 animate-ping" />
        <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-primary" />
      </span>
      {label}
    </span>
  )
}
