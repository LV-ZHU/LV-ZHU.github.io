import GitHubLink from './GitHubLink'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-copy">&copy; 2026 LV-ZHU</div>
          <div className="footer-social">
            <GitHubLink
              compact
              href="https://github.com/LV-ZHU"
              title="LV-ZHU"
              meta="GitHub"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}
