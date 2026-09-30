import { use_travel } from '../features/travel/use_travel'



import PageHeader from '../components/PageHeader'
import '../styles/Travel.css'

export default function Travel() {
  const { sync_status, leaderboard_error, currentMap, loading, loadingText, leaderboard, chartRef, switchMap, handleDeleteRecord, renderStatsCards } = use_travel()
  return (
    <div className="page-wrapper travel-view">
      <PageHeader title="Travel" />
      <section className="section">
        <div className="container">
          <div className="travel-container">
            <div className="section-header">
              <h2 className="section-title">我的足迹</h2>
            </div>

            <div className="map-tabs">
              <button
                className={`map-tab ${currentMap === 'shanghai' ? 'active' : ''}`}
                aria-pressed={currentMap === 'shanghai'}
                type="button"
                onClick={() => switchMap('shanghai')}
              >
                上海
              </button>
              <button
                className={`map-tab ${currentMap === 'china' ? 'active' : ''}`}
                aria-pressed={currentMap === 'china'}
                type="button"
                onClick={() => switchMap('china')}
              >
                中国
              </button>
              <button
                className={`map-tab ${currentMap === 'world' ? 'active' : ''}`}
                aria-pressed={currentMap === 'world'}
                type="button"
                onClick={() => switchMap('world')}
              >
                世界
              </button>
            </div>

            <div className="map-legend">
              <div className="legend-item">
                <span className="legend-dot visited"></span> 去过
              </div>
              <div className="legend-item">
                <span className="legend-dot want"></span> 想去
              </div>
              <div className="legend-item">
                <span className="legend-dot unvisited"></span> 未去
              </div>
            </div>

            <div className="echarts-wrapper" aria-busy={loading}>
              {loading && (
                <div className="loading-overlay">
                  <div className="lds-dual-ring"></div>
                  {loadingText}
                </div>
              )}
              <div className="map-chart-container" ref={chartRef}></div>
            </div>

            {sync_status && <div className="map-tip" role="status">
              {sync_status}
            </div>}

            {renderStatsCards()}
          </div>
        </div>
      </section>

      <section className="section travel-detail-1" >
        <div className="container">
          <div className="leaderboard">
            <h3 className="leaderboard-title">

              {currentMap === 'shanghai' ? '上海' : currentMap === 'china' ? '中国' : '全球'}排行榜
            </h3>
            {leaderboard.length === 0 ? (
              <div className="leaderboard-empty">{leaderboard_error || '还没有人记录去过的地点。'}</div>
            ) : (
              <ul className="leaderboard-list">
                {[...leaderboard]
                  .sort((a, b) => {
                    const getCount = (item) => {
                      if (currentMap === 'shanghai') return item.shanghaiVisited
                      if (currentMap === 'china') return item.chinaVisited
                      return item.worldVisited
                    }
                    return getCount(b) - getCount(a)
                  })
                  .filter((item) => {
                    const getCount = (it) => {
                      if (currentMap === 'shanghai') return it.shanghaiVisited
                      if (currentMap === 'china') return it.chinaVisited
                      return it.worldVisited
                    }
                    return getCount(item) > 0
                  })
                  .map((item, idx) => {
                    const count =
                      currentMap === 'shanghai'
                        ? item.shanghaiVisited
                        : currentMap === 'china'
                        ? item.chinaVisited
                        : item.worldVisited
                    const rank = idx + 1
                    return (
                      <li className="leaderboard-item" key={item.uid}>
                        <span
                          className={`leaderboard-rank ${rank <= 3 ? `top${rank}` : 'other'}`}
                        >
                          {rank}
                        </span>
                        {item.photoURL ? (
                          <img
                            className="leaderboard-avatar"
                            src={item.photoURL}
                            alt=""
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <i
                            className="fas fa-user-circle travel-detail-2"

                          ></i>
                        )}
                        <span className="leaderboard-name">{item.name}</span>
                        <span className="leaderboard-count">{count} 个地方</span>
                        {item.isMe && (
                          <button
                            className="leaderboard-delete"
                            title="退出排行榜"
                            aria-label="退出排行榜"
                            onClick={handleDeleteRecord}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        )}
                      </li>
                    )
                  })}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
