export default function Tutoring() {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1><i className="fas fa-chalkboard-teacher" /> Tutoring</h1>
      </div>
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">教培资料，初高中原创试题合集</h2>
          </div>
          <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <a
              href="https://github.com/LV-ZHU/collection-of-original-test-papers"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#24292e', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontWeight: 500, transition: 'background-color 0.2s' }}
            >
              <i className="fab fa-github" />跳转到GitHub仓库查看
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
