import { useState, useEffect, useRef, useCallback } from 'react'
import * as echarts from 'echarts'
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy, limit, getDoc } from 'firebase/firestore'
import { db } from '../firebase/init'
import { useAuth } from '../components/AuthProvider'
import FadeIn from '../components/FadeIn'
import '../styles/Travel.css'

const STORAGE_CHINA = 'lv-zhu-travel-map'
const STORAGE_WORLD = 'lv-zhu-travel-map-world'
const STORAGE_SHANGHAI = 'lv-zhu-travel-map-shanghai'
const STATES = ['unvisited', 'visited', 'want']

const colorMap = {
  visited: '#4f46e5',
  want: '#10b981',
  unvisited: '#d1d5db',
}

function loadData(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

function getStorageKey(mapType) {
  if (mapType === 'china') return STORAGE_CHINA
  if (mapType === 'world') return STORAGE_WORLD
  return STORAGE_SHANGHAI
}

function countVisited(data) {
  if (!data) return 0
  return Object.values(data).filter((v) => v === 'visited').length
}

function escapeHtml(str) {
  const div = document.createElement('div')
  div.appendChild(document.createTextNode(str || ''))
  return div.innerHTML
}

export default function Travel() {
  const { user } = useAuth()
  const [currentMap, setCurrentMap] = useState('china')
  const [loading, setLoading] = useState(true)
  const [loadingText, setLoadingText] = useState('获取在线地图中...')
  const [stats, setStats] = useState({ visited: 0, want: 0, total: '...', label: '' })
  const [leaderboard, setLeaderboard] = useState([])

  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const geoDataCache = useRef({
    chinaCities: null,
    chinaProv: null,
    shanghai: null,
    world: null,
  })
  const cityToProvMap = useRef({})
  const provLinesData = useRef([])
  const currentMapRef = useRef(currentMap)
  const handleMapClickRef = useRef(null)

  // Keep ref in sync with state
  useEffect(() => {
    currentMapRef.current = currentMap
  }, [currentMap])

  // Decode polygon helper (for encoded china province boundaries)
  const decodePolygon = useCallback((coordinate, encodeOffsets) => {
    const result = []
    let prevX = encodeOffsets[0]
    let prevY = encodeOffsets[1]
    for (let i = 0; i < coordinate.length; i += 2) {
      let x = coordinate.charCodeAt(i) - 64
      let y = coordinate.charCodeAt(i + 1) - 64
      x = (x >> 1) ^ (-(x & 1))
      y = (y >> 1) ^ (-(y & 1))
      x += prevX
      y += prevY
      prevX = x
      prevY = y
      result.push([x / 1024, y / 1024])
    }
    return result
  }, [])

  // Fetch and register GeoJSON for the current map
  const fetchGeoJSON = useCallback(
    async (mapType) => {
      setLoading(true)
      setLoadingText('正在加载数据，请稍候...')

      try {
        if (mapType === 'china') {
          if (!geoDataCache.current.chinaCities || !geoDataCache.current.chinaProv) {
            const [resCities, resProv] = await Promise.all([
              fetch('https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/china-cities.json'),
              fetch('https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/china.json'),
            ])
            geoDataCache.current.chinaCities = await resCities.json()
            geoDataCache.current.chinaProv = await resProv.json()

            // Build city-to-province mapping
            const provIdMap = {}
            geoDataCache.current.chinaProv.features.forEach((f) => {
              const id = String(f.id || (f.properties && f.properties.id) || '')
              if (id) provIdMap[id.substring(0, 2)] = f.properties.name
            })
            geoDataCache.current.chinaCities.features.forEach((f) => {
              const id = String(f.id || (f.properties && f.properties.id) || '')
              if (id && id.length >= 2 && provIdMap[id.substring(0, 2)]) {
                cityToProvMap.current[f.properties.name] = provIdMap[id.substring(0, 2)]
              }
            })

            // Decode province boundary lines
            provLinesData.current = []
            const isEncoded = geoDataCache.current.chinaProv.UTF8Encoding
            geoDataCache.current.chinaProv.features.forEach((f) => {
              if (!f.geometry) return
              const geomType = f.geometry.type
              const coordinates = f.geometry.coordinates
              const encodeOffsets = f.geometry.encodeOffsets

              if (geomType === 'Polygon') {
                for (let i = 0; i < coordinates.length; i++) {
                  const ring = isEncoded
                    ? decodePolygon(coordinates[i], encodeOffsets[i])
                    : coordinates[i]
                  provLinesData.current.push({ coords: ring })
                }
              } else if (geomType === 'MultiPolygon') {
                for (let i = 0; i < coordinates.length; i++) {
                  const poly = coordinates[i]
                  const polyOffsets = encodeOffsets ? encodeOffsets[i] : null
                  for (let j = 0; j < poly.length; j++) {
                    const ring = isEncoded
                      ? decodePolygon(poly[j], polyOffsets[j])
                      : poly[j]
                    provLinesData.current.push({ coords: ring })
                  }
                }
              }
            })

            echarts.registerMap('china-cities', geoDataCache.current.chinaCities)
          }
        } else if (mapType === 'shanghai') {
          if (!geoDataCache.current.shanghai) {
            const res = await fetch(
              'https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/province/shanghai.json'
            )
            geoDataCache.current.shanghai = await res.json()
          }
          echarts.registerMap('shanghai-map', geoDataCache.current.shanghai)
        } else if (mapType === 'world') {
          if (!geoDataCache.current.world) {
            const res = await fetch(
              'https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/world.json'
            )
            geoDataCache.current.world = await res.json()
          }
          echarts.registerMap('world', geoDataCache.current.world)
        }

        setLoading(false)
        return true
      } catch (e) {
        setLoadingText('在线地图资源加载失败，请重试')
        console.error(e)
        return false
      }
    },
    [decodePolygon]
  )

  // Update chart display with current data
  const updateChartDisplay = useCallback((mapType) => {
    const storageKey = getStorageKey(mapType)
    const savedData = loadData(storageKey)

    const seriesData = []
    Object.keys(savedData).forEach((name) => {
      const state = savedData[name]
      const empColor = state === 'visited' ? '#4338ca' : '#059669'
      seriesData.push({
        name,
        value: state,
        itemStyle: {
          areaColor: colorMap[state],
          shadowColor: 'rgba(0,0,0,0.15)',
          shadowBlur: 3,
        },
        emphasis: {
          itemStyle: {
            areaColor: empColor,
            borderColor: '#f8fafc',
            borderWidth: 1,
          },
        },
      })
    })

    const mapName =
      mapType === 'china'
        ? 'china-cities'
        : mapType === 'world'
        ? 'world'
        : 'shanghai-map'

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: 'rgba(79, 70, 229, 0.2)',
        textStyle: { color: '#334155' },
        formatter(params) {
          if (params.seriesType === 'lines') return ''
          const stateStrMap = {
            visited: '🎈 去过',
            want: '🎯 想去',
            unvisited: '☁️ 未去',
          }
          const val = params.data && params.data.value ? params.data.value : 'unvisited'
          return (
            '<b>' +
            params.name +
            '</b><br/><span style="margin-top:4px;display:inline-block;">' +
            stateStrMap[val] +
            '</span>'
          )
        },
      },
      geo: {
        map: mapName,
        roam: true,
        scaleLimit: { min: 0.5, max: 25 },
        regions: seriesData,
        itemStyle: {
          areaColor: colorMap.unvisited,
          borderColor: mapType === 'china' ? '#f8fafc' : '#f1f5f9',
          borderWidth: mapType === 'shanghai' ? 0.8 : 0.6,
        },
        emphasis: {
          itemStyle: { areaColor: '#c7d2fe', borderColor: '#818cf8', borderWidth: 1 },
        },
      },
      series: [
        {
          name: mapName,
          type: 'map',
          geoIndex: 0,
          data: seriesData,
        },
      ],
    }

    if (mapType === 'china') {
      option.series.push({
        name: 'province-lines',
        type: 'lines',
        coordinateSystem: 'geo',
        polyline: true,
        data: provLinesData.current,
        lineStyle: { color: '#334155', width: 2, opacity: 1 },
        silent: true,
      })
    }

    if (chartInstance.current) {
      chartInstance.current.setOption(option, true)
    }
  }, [])

  // Render stats based on current map and data
  const renderStats = useCallback(
    (mapType, isLoading) => {
      const storageKey = getStorageKey(mapType)
      const savedData = loadData(storageKey)

      if (mapType === 'world' || mapType === 'shanghai') {
        let visitedCount = 0
        let wantCount = 0
        Object.values(savedData).forEach((st) => {
          if (st === 'visited') visitedCount++
          else wantCount++
        })

        const maxCount = isLoading
          ? '...'
          : mapType === 'world'
          ? geoDataCache.current.world
            ? geoDataCache.current.world.features.length
            : 200
          : geoDataCache.current.shanghai
          ? geoDataCache.current.shanghai.features.length
          : 17

        setStats({
          type: 'single',
          title: mapType === 'world' ? '🌍 全球足迹' : '📍 上海足迹',
          labelType: mapType === 'world' ? '国家/地区' : '行政区',
          visited: visitedCount,
          want: wantCount,
          total: maxCount,
        })
      } else {
        let vCity = 0
        let wCity = 0
        const vProv = new Set()
        const wProv = new Set()

        Object.keys(savedData).forEach((cityName) => {
          const state = savedData[cityName]
          const pName = cityToProvMap.current[cityName]
          if (state === 'visited') {
            vCity++
            if (pName) vProv.add(pName)
          } else if (state === 'want') {
            wCity++
            if (pName) wProv.add(pName)
          }
        })

        const maxCityCount = isLoading
          ? '...'
          : geoDataCache.current.chinaCities
          ? geoDataCache.current.chinaCities.features.length
          : 344
        const maxProvCount = isLoading
          ? '...'
          : geoDataCache.current.chinaProv
          ? geoDataCache.current.chinaProv.features.length
          : 34

        setStats({
          type: 'china',
          provVisited: vProv.size,
          provWant: wProv.size,
          provTotal: maxProvCount,
          cityVisited: vCity,
          cityWant: wCity,
          cityTotal: maxCityCount,
        })
      }
    },
    []
  )

  // Sync travel data to Firestore
  const syncTravelToFirestore = useCallback(async () => {
    if (!user) return
    const china = loadData(STORAGE_CHINA)
    const world = loadData(STORAGE_WORLD)
    const shanghai = loadData(STORAGE_SHANGHAI)
    const totalVisited = countVisited(china) + countVisited(world) + countVisited(shanghai)

    try {
      await setDoc(
        doc(db, 'travelData', user.uid),
        {
          photoURL: user.photoURL || '',
          displayName: user.displayName || user.email || '用户',
          china,
          world,
          shanghai,
          visitedCount: totalVisited,
          updatedAt: new Date(),
        },
        { merge: true }
      )
    } catch (err) {
      console.error('同步失败:', err)
    }
  }, [user])

  // Store latest sync function in ref so the click handler always uses current user
  const syncRef = useRef(syncTravelToFirestore)
  useEffect(() => {
    syncRef.current = syncTravelToFirestore
  }, [syncTravelToFirestore])

  // Handle map click: cycle state unvisited -> visited -> want -> unvisited
  // Stored in a ref so the chart event handler always calls the latest version
  handleMapClickRef.current = (params) => {
    if (!params.name || params.seriesType === 'lines') return

    const storageKey = getStorageKey(currentMapRef.current)
    const data = loadData(storageKey)
    const currentState = data[params.name] || 'unvisited'
    const nextState = STATES[(STATES.indexOf(currentState) + 1) % STATES.length]

    if (nextState === 'unvisited') {
      delete data[params.name]
    } else {
      data[params.name] = nextState
    }
    saveData(storageKey, data)

    updateChartDisplay(currentMapRef.current)
    renderStats(currentMapRef.current, false)

    // Sync to Firestore (always uses latest user via ref)
    setTimeout(() => syncRef.current(), 200)
  }

  // Switch map tab
  const switchMap = useCallback(
    async (mapType) => {
      if (chartInstance.current) {
        chartInstance.current.clear()
      }
      setCurrentMap(mapType)
      currentMapRef.current = mapType
      renderStats(mapType, true)
      const success = await fetchGeoJSON(mapType)
      if (success) {
        updateChartDisplay(mapType)
        renderStats(mapType, false)
      }
    },
    [fetchGeoJSON, updateChartDisplay, renderStats]
  )

  // Initialize chart on mount
  useEffect(() => {
    if (!chartRef.current) return

    const chart = echarts.init(chartRef.current)
    chartInstance.current = chart

    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)

    // Use ref-based handler so it always calls the latest version
    chart.on('click', (params) => {
      if (handleMapClickRef.current) handleMapClickRef.current(params)
    })

    // Initial load
    ;(async () => {
      renderStats('china', true)
      const success = await fetchGeoJSON('china')
      if (success) {
        updateChartDisplay('china')
        renderStats('china', false)
      }
    })()

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.dispose()
      chartInstance.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Leaderboard: real-time listener from Firestore
  useEffect(() => {
    const q = query(
      collection(db, 'travelData'),
      orderBy('visitedCount', 'desc'),
      limit(20)
    )

    const unsub = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        setLeaderboard([])
        return
      }

      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))

      // Batch fetch user nicknames from users collection
      const nicknameMap = {}
      await Promise.all(
        docs.map(async (item) => {
          try {
            const userDoc = await getDoc(doc(db, 'users', item.id))
            if (userDoc.exists() && userDoc.data().nickname) {
              nicknameMap[item.id] = userDoc.data().nickname
            }
          } catch {
            // ignore
          }
        })
      )

      setLeaderboard(
        docs.map((item, idx) => ({
          uid: item.id,
          rank: idx + 1,
          name: nicknameMap[item.id] || item.displayName || '用户',
          photoURL: item.photoURL || '',
          visitedCount: item.visitedCount || 0,
          isMe: user && user.uid === item.id,
        }))
      )
    })

    return unsub
  }, [user])

  // Delete leaderboard record
  const handleDeleteRecord = useCallback(
    async (uid) => {
      if (!confirm('确定删除你的排行榜记录？')) return
      try {
        await deleteDoc(doc(db, 'travelData', uid))
      } catch (err) {
        console.error('删除失败:', err)
      }
    },
    []
  )

  // Stats cards rendering
  function renderStatsCards() {
    if (stats.type === 'china') {
      return (
        <div className="map-stats-container">
          <div className="stat-card">
            <div className="stat-card-title">🇨🇳 中国足迹-省级行政区</div>
            <div className="stat-row">
              <div className="stat-item">
                <div className="stat-num">{stats.provVisited}</div>
                <div className="stat-label">去过</div>
              </div>
              <div className="stat-item">
                <div className="stat-num want">{stats.provWant}</div>
                <div className="stat-label">想去</div>
              </div>
              <div className="stat-item">
                <div className="stat-num" style={{ color: '#94a3b8' }}>
                  {stats.provTotal}
                </div>
                <div className="stat-label">省级行政区</div>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-title">🏙️ 中国足迹-地级市</div>
            <div className="stat-row">
              <div className="stat-item">
                <div className="stat-num">{stats.cityVisited}</div>
                <div className="stat-label">去过</div>
              </div>
              <div className="stat-item">
                <div className="stat-num want">{stats.cityWant}</div>
                <div className="stat-label">想去</div>
              </div>
              <div className="stat-item">
                <div className="stat-num" style={{ color: '#94a3b8' }}>
                  {stats.cityTotal}
                </div>
                <div className="stat-label">地级市</div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="map-stats-container">
        <div className="stat-card">
          <div className="stat-card-title">{stats.title}</div>
          <div className="stat-row">
            <div className="stat-item">
              <div className="stat-num">{stats.visited}</div>
              <div className="stat-label">去过</div>
            </div>
            <div className="stat-item">
              <div className="stat-num want">{stats.want}</div>
              <div className="stat-label">想去</div>
            </div>
            <div className="stat-item">
              <div className="stat-num" style={{ color: '#94a3b8' }}>
                {stats.total}
              </div>
              <div className="stat-label">{stats.labelType}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>
          <i className="fas fa-map-marked-alt"></i> Travel
        </h1>
      </div>

      <section className="section">
        <div className="container">
          <FadeIn className="travel-container">
            <div className="section-header">
              <h2 className="section-title">我的足迹</h2>
              <p className="section-desc">点击地图行政板块可切换：未去 → 去过 → 想去</p>
            </div>

            <div className="map-tabs">
              <button
                className={`map-tab ${currentMap === 'shanghai' ? 'active' : ''}`}
                onClick={() => switchMap('shanghai')}
              >
                上海足迹
              </button>
              <button
                className={`map-tab ${currentMap === 'china' ? 'active' : ''}`}
                onClick={() => switchMap('china')}
              >
                中国足迹
              </button>
              <button
                className={`map-tab ${currentMap === 'world' ? 'active' : ''}`}
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

            <div className="echarts-wrapper">
              {loading && (
                <div className="loading-overlay">
                  <div className="lds-dual-ring"></div>
                  {loadingText}
                </div>
              )}
              <div className="map-chart-container" ref={chartRef}></div>
            </div>

            <div className="map-tip">
              提示：点击地图上的区域可以切换"去过/想去/未去"状态，数据将自动保存并同步到排行榜。
            </div>

            {renderStatsCards()}
          </FadeIn>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <FadeIn className="leaderboard">
            <h3 className="leaderboard-title">
              <i className="fas fa-trophy"></i> 足迹排行榜
            </h3>
            {leaderboard.length === 0 ? (
              <div className="leaderboard-empty">暂无数据</div>
            ) : (
              <ul className="leaderboard-list">
                {leaderboard.map((item) => (
                  <li className="leaderboard-item" key={item.uid}>
                    <span
                      className={`leaderboard-rank ${
                        item.rank <= 3 ? `top${item.rank}` : 'other'
                      }`}
                    >
                      {item.rank}
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
                        className="fas fa-user-circle"
                        style={{ fontSize: '1.4rem', color: '#ccc' }}
                      ></i>
                    )}
                    <span className="leaderboard-name">{escapeHtml(item.name)}</span>
                    <span className="leaderboard-count">{item.visitedCount} 个地方</span>
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
                ))}
              </ul>
            )}
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
