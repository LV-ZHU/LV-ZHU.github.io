export default function GitHubLink({
  href,
  title,
  meta = 'GitHub 仓库',
  actionLabel = '查看',
  compact = false,
  className = '',
}) {
  const classes = [
    'github-link',
    compact ? 'github-link-compact' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <a
      className={classes}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${title}（在 GitHub 中打开）`}
    >
      <span className="github-link-icon" aria-hidden="true">
        <i className="fab fa-github" />
      </span>
      <span className="github-link-copy">
        <span className="github-link-title">{title}</span>
        {meta && <span className="github-link-meta">{meta}</span>}
      </span>
      {!compact && (
        <span className="github-link-action" aria-hidden="true">
          {actionLabel}
          <i className="fas fa-arrow-up-right-from-square" />
        </span>
      )}
    </a>
  )
}
