export default function RouteLoader() {
  return (
    <div className="route-loader" role="status" aria-live="polite">
      <span className="route-loader-mark" aria-hidden="true" />
      <span>正在打开页面</span>
    </div>
  )
}
