import { use_travel } from '../features/travel/use_travel'







import PageHeader from '../components/PageHeader'
import '../styles/Travel.css'

export default function Travel() {
  const { currentMap, loading, loadingText, leaderboard, chartRef, switchMap, handleDeleteRecord, renderStatsCards } = use_travel()
  return (
    <div className="page-wrapper travel-view">
      <PageHeader title="Travel" />
      <section className="section">
        <div className="container">
          <div className="travel-container">
            <div className="section-header">
              <h2 className="section-title">我的足迹</h2>
              <p className="section-desc">点击地图行政板块可切换：未去 → 去过 → 想去</p>
            </div>

            <div className="map-tabs">
              <button
                className={`map-tab ${currentMap === 'shanghai' ? 'active' : ''}`}
                aria-pressed={currentMap === 'shanghai'}
                type="button"
                onClick={() => switchMap('shanghai')}
              >
                上海足迹
              </button>
              <button
                className={`map-tab ${currentMap === 'china' ? 'active' : ''}`}
                aria-pressed={currentMap === 'china'}
                type="button"
                onClick={() => switchMap('china')}
              >
                中国足迹
              </button>
              <button
                className={`map-tab ${currentMap === 'world' ? 'active' : ''}`}
                aria-pressed={currentMap === 'world'}
                type="button"
                onClick={() => switchMap('world')}
              >
                全球足迹
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

            <div className="map-tip">
              足迹保存在本机，登录后同步到排行榜。
            </div>

            {renderStatsCards()}
          </div>
        </div>
      </section>

      <section className="section travel-detail-1" >
        <div className="container">
          <div className="leaderboard">
            <h3 className="leaderboard-title">
              <i className="fas fa-trophy"></i>{' '}
              {currentMap === 'shanghai' ? '上海' : currentMap === 'china' ? '中国' : '全球'}排行榜
            </h3>
            {leaderboard.length === 0 ? (
              <div className="leaderboard-empty">暂无数据</div>
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
                            title="删除我的记录"
                            onClick={() => handleDeleteRecord(item.uid)}
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
