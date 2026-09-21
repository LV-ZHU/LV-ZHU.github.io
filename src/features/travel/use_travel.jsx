import { next_map_state } from './state.js'
import { STORAGE_CHINA, STORAGE_WORLD, STORAGE_SHANGHAI, colorMap, loadData, saveData, getStorageKey, countVisited, escapeHtml } from './state.js';
import { useState, useEffect, useRef, useCallback } from 'react'
import * as echarts from 'echarts/core'
import { LinesChart, MapChart } from 'echarts/charts'
import { GeoComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy, limit, getDoc } from 'firebase/firestore'
import { db } from '../../firebase/init'
import { useAuth } from '../../components/AuthProvider'
import { useTheme } from '../../components/ThemeProvider'

echarts.use([MapChart, LinesChart, GeoComponent, TooltipComponent, CanvasRenderer])

export function use_travel() {
  const map_request = useRef(null)
  const sync_timer = useRef(null)
  useEffect(() => () => clearTimeout(sync_timer.current), [])
  const { user } = useAuth()
  const { isDark } = useTheme()
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
      map_request.current?.abort()
      const request = new AbortController()
      map_request.current = request
      setLoading(true)
      setLoadingText('正在加载数据，请稍候...')

      try {
        if (mapType === 'china') {
          if (!geoDataCache.current.chinaCities || !geoDataCache.current.chinaProv) {
            const [resCities, resProv] = await Promise.all([
              fetch('https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/china-cities.json', { signal: request.signal }),
              fetch('https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/china.json', { signal: request.signal }),
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
            const res = await fetch('https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/province/shanghai.json', { signal: request.signal })
            geoDataCache.current.shanghai = await res.json()
          }
          echarts.registerMap('shanghai-map', geoDataCache.current.shanghai)
        } else if (mapType === 'world') {
          if (!geoDataCache.current.world) {
            const res = await fetch('https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/world.json', { signal: request.signal })
            geoDataCache.current.world = await res.json()
          }
          echarts.registerMap('world', geoDataCache.current.world)
        }

        if (request.signal.aborted) return false
        setLoading(false)
        return true
      } catch (e) {
        if (request.signal.aborted) return false
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
    const mapColors = isDark
      ? {
          unvisited: '#30363d',
          border: '#22262b',
          hover: '#455565',
          hoverBorder: '#9cbad6',
          provinceLine: '#9aa7b8',
          tooltipBg: '#22262b',
          tooltipBorder: '#3b424b',
          tooltipText: '#e7ecf3',
        }
      : {
          unvisited: colorMap.unvisited,
          border: mapType === 'china' ? '#f8fafc' : '#f1f5f9',
          hover: '#bacbda',
          hoverBorder: '#557fa3',
          provinceLine: '#334155',
          tooltipBg: '#ffffff',
          tooltipBorder: '#bec5cc',
          tooltipText: '#334155',
        }

    const seriesData = []
    Object.keys(savedData).forEach((name) => {
      const state = savedData[name]
      const empColor = state === 'visited' ? '#406688' : '#487c6b'
      seriesData.push({
        name,
        value: state,
        itemStyle: {
          areaColor: colorMap[state],
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
        backgroundColor: mapColors.tooltipBg,
        borderColor: mapColors.tooltipBorder,
        textStyle: { color: mapColors.tooltipText },
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
            escapeHtml(params.name) +
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
          areaColor: mapColors.unvisited,
          borderColor: mapColors.border,
          borderWidth: mapType === 'shanghai' ? 0.8 : 0.6,
        },
        emphasis: {
          itemStyle: { areaColor: mapColors.hover, borderColor: mapColors.hoverBorder, borderWidth: 1 },
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
        lineStyle: { color: mapColors.provinceLine, width: 2, opacity: 1 },
        silent: true,
      })
    }

    if (chartInstance.current) {
      chartInstance.current.setOption(option, true)
    }
  }, [isDark])

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
          title: mapType === 'world' ? '全球' : '上海',
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
    const chinaVisited = countVisited(china)
    const worldVisited = countVisited(world)
    const shanghaiVisited = countVisited(shanghai)
    const totalVisited = chinaVisited + worldVisited + shanghaiVisited

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
          chinaVisited,
          worldVisited,
          shanghaiVisited,
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
    const nextState = next_map_state(currentState)

    if (nextState === 'unvisited') {
      delete data[params.name]
    } else {
      data[params.name] = nextState
    }
    saveData(storageKey, data)

    updateChartDisplay(currentMapRef.current)
    renderStats(currentMapRef.current, false)

    // Sync to Firestore (always uses latest user via ref)
    clearTimeout(sync_timer.current)
    sync_timer.current = setTimeout(() => syncRef.current(), 200)
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
      if (success && currentMapRef.current === mapType) {
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
      if (success && currentMapRef.current === 'china') {
        updateChartDisplay('china')
        renderStats('china', false)
      }
    })()

    return () => {
      window.removeEventListener('resize', handleResize)
      map_request.current?.abort()
      clearTimeout(sync_timer.current)
      chart.dispose()
      chartInstance.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!loading && chartInstance.current) {
      updateChartDisplay(currentMapRef.current)
    }
  }, [isDark, loading, updateChartDisplay])

  // Leaderboard: real-time listener from Firestore
  useEffect(() => {
    const q = query(
      collection(db, 'travelData'),
      orderBy('visitedCount', 'desc'),
      limit(50)
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
        docs.map((item) => ({
          uid: item.id,
          name: nicknameMap[item.id] || item.displayName || '用户',
          photoURL: item.photoURL || '',
          visitedCount: item.visitedCount || 0,
          chinaVisited: item.chinaVisited || 0,
          worldVisited: item.worldVisited || 0,
          shanghaiVisited: item.shanghaiVisited || 0,
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
            <div className="stat-card-title">省级行政区</div>
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
                <div className="stat-num unvisited">
                  {stats.provTotal}
                </div>
                <div className="stat-label">总数</div>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-title">地级市</div>
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
                <div className="stat-num unvisited">
                  {stats.cityTotal}
                </div>
                <div className="stat-label">总数</div>
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
              <div className="stat-num unvisited">
                {stats.total}
              </div>
              <div className="stat-label">总数</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return { currentMap, loading, loadingText, leaderboard, chartRef, switchMap, handleDeleteRecord, renderStatsCards }
}
