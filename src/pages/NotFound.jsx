import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="page-wrapper page-direct">
      <section className="section">
        <div className="container empty-state">
          <h1>404</h1>
          <p>页面未找到</p>
          <Link to="/">返回首页</Link>
        </div>
      </section>
    </div>
  )
}
