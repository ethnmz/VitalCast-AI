export default function MetricCard({
  label,
  value,
  unit = '',
  delta = null,
  deltaLabel = '',
  subLabel = '',
  ci = null,
  elevated = false,
  accent = false,
}) {
  const deltaPositive = delta !== null && delta <= 0
  const deltaNegative = delta !== null && delta > 0

  return (
    <div className="metric-card relative overflow-hidden group hover:shadow-md transition-shadow duration-200">
      {/* Accent bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl ${
          elevated ? 'bg-tertiary' : accent ? 'bg-primary' : 'bg-transparent'
        }`}
      />

      <div className="label-tag mb-2">{label}</div>

      <div className="flex items-end gap-1 mb-1">
        <span
          className={`mono-num font-bold leading-none ${
            elevated ? 'text-tertiary' : 'text-secondary'
          }`}
          style={{ fontSize: '2.25rem', lineHeight: 1 }}
        >
          {value}
        </span>
        {unit && (
          <span className="text-gray-400 font-mono text-sm mb-1">{unit}</span>
        )}
      </div>

      {delta !== null && (
        <div
          className={`text-xs font-mono flex items-center gap-1 mb-1 ${
            deltaPositive ? 'text-primary' : 'text-tertiary'
          }`}
        >
          <span>{deltaPositive ? '▲' : '▼'}</span>
          <span>{Math.abs(delta)}{deltaLabel}</span>
          <span className="text-gray-400">vs baseline</span>
        </div>
      )}

      {subLabel && (
        <div className="text-xs text-gray-500 font-medium">{subLabel}</div>
      )}

      {ci && (
        <div className="mt-2 pt-2 border-t border-gray-50">
          <div className="label-tag mb-1">95% CI</div>
          <div className="font-mono text-xs text-gray-500">{ci}</div>
        </div>
      )}
    </div>
  )
}
