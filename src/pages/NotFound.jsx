import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1><i className="fas fa-circle-exclamation" /> 404</h1>
        <p>页面未找到</p>
      </div>
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="placeholder-box">
            <i className="fas fa-ghost" />
            <p>这里什么都没有</p>
            <Link to="/" className="card-link" style={{ marginTop: '1rem', display: 'inline-block' }}>返回首页</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
