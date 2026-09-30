import { next_map_state } from './state.js'
import { STORAGE_CHINA, STORAGE_WORLD, STORAGE_SHANGHAI, colorMap, loadData as read_local, saveData as write_local, getStorageKey, escapeHtml } from './state.js';
import { useState, useEffect, useRef, useCallback } from 'react'
import * as echarts from 'echarts/core'
import { LinesChart, MapChart } from 'echarts/charts'
import { GeoComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { collection, doc, writeBatch, serverTimestamp, onSnapshot, query, orderBy, limit, getDoc } from 'firebase/firestore'
import { public_name } from '../auth/public_name.js'
import { leaderboard_record } from './privacy.js'
import { db } from '../../firebase/init'
import { useAuth } from '../../components/AuthProvider'
import { useTheme } from '../../components/ThemeProvider'

echarts.use([MapChart, LinesChart, GeoComponent, TooltipComponent, CanvasRenderer])

export function use_travel() {
  const map_request = useRef(null)
  const sync_timer = useRef(null)
  useEffect(() => () => clearTimeout(sync_timer.current), [])
  const { user, nickname, loading: auth_loading } = useAuth()
  const account_ref = useRef(null)
  const ready_ref = useRef(false)
  const published_ref = useRef(true)
  const edit_version = useRef(0)
  const [sync_status, set_sync_status] = useState('')
  const [leaderboard_error, set_leaderboard_error] = useState('')
  const loadData = (key) => read_local(account_ref.current ? `${key}:${account_ref.current}` : key)
  const saveData = (key, data) => write_local(account_ref.current ? `${key}:${account_ref.current}` : key, data)
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
            visited: '去过',
            want: '想去',
            unvisited: '未去',
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

  // Private maps and the public summary are committed atomically.
  const syncTravelToFirestore = useCallback(async () => {
    if (!user || !ready_ref.current || account_ref.current !== user.uid) return
    const china = loadData(STORAGE_CHINA)
    const world = loadData(STORAGE_WORLD)
    const shanghai = loadData(STORAGE_SHANGHAI)
    const version = edit_version.current
    set_sync_status('正在同步…')
    try {
      const batch = writeBatch(db)
      batch.set(doc(db, 'users', user.uid, 'travelPrivate', 'maps'), {
        china, world, shanghai, published: published_ref.current, updatedAt: serverTimestamp(),
      })
      if (published_ref.current) {
        batch.set(doc(db, 'travelLeaderboard', user.uid), {
          ...leaderboard_record(user, { china, world, shanghai }, nickname), updatedAt: serverTimestamp(),
        })
      }
      await batch.commit()
      if (account_ref.current === user.uid && version === edit_version.current) {
        localStorage.removeItem(`travel-dirty:${user.uid}`)
        set_sync_status(published_ref.current ? '已同步。排行榜只公开头像、名称和去过的数量。' : '已同步，你已退出排行榜。')
      }
    } catch (err) {
      if (account_ref.current === user.uid) set_sync_status('云端同步失败，本机记录已保留。请稍后刷新重试。')
      console.error('同步失败:', err)
    }
  }, [user, nickname])

  useEffect(() => {
    let cancelled = false
    clearTimeout(sync_timer.current)
    ready_ref.current = false
    account_ref.current = user?.uid || null
    const refresh = () => {
      renderStats(currentMapRef.current, loading)
      if (!loading) updateChartDisplay(currentMapRef.current)
    }
    refresh()
    if (auth_loading) return
    if (!user) {
      ready_ref.current = true
      set_sync_status('')
      return
    }
    set_sync_status('正在读取你的足迹…')
    ;(async () => {
      try {
        const private_ref = doc(db, 'users', user.uid, 'travelPrivate', 'maps')
        let snapshot = await getDoc(private_ref)
        // Legacy data is read only by its owner, never through a collection query.
        if (!snapshot.exists()) snapshot = await getDoc(doc(db, 'travelData', user.uid))
        if (cancelled) return
        const data = snapshot.exists() ? snapshot.data() : null
        const guest_owner = localStorage.getItem('travel-guest-owner')
        const import_guest = !guest_owner || guest_owner === user.uid
        if (!guest_owner) localStorage.setItem('travel-guest-owner', user.uid)
        published_ref.current = data?.published !== false
        for (const [map, key] of [['china', STORAGE_CHINA], ['world', STORAGE_WORLD], ['shanghai', STORAGE_SHANGHAI]]) {
          // Unsynced account-local changes take precedence, including empty maps.
          const cached = localStorage.getItem(`${key}:${user.uid}`)
          const dirty = localStorage.getItem(`travel-dirty:${user.uid}`)
          const maps = dirty && cached !== null ? loadData(key) : (data?.[map] || (cached !== null ? loadData(key) : import_guest ? read_local(key) : {}))
          if (!saveData(key, maps)) throw new Error('Local storage unavailable')
        }
        ready_ref.current = true
        refresh()
        await syncTravelToFirestore()
      } catch (err) {
        if (!cancelled) set_sync_status('足迹读取失败，请刷新重试。为避免覆盖云端记录，暂时无法标记。')
        console.error('读取足迹失败:', err)
      }
    })()
    return () => { cancelled = true; ready_ref.current = false }
  }, [user, auth_loading]) // eslint-disable-line react-hooks/exhaustive-deps

  // Store latest sync function in ref so the click handler always uses current user
  const syncRef = useRef(syncTravelToFirestore)
  useEffect(() => {
    syncRef.current = syncTravelToFirestore
  }, [syncTravelToFirestore])

  // Handle map click: cycle state unvisited -> visited -> want -> unvisited
  // Stored in a ref so the chart event handler always calls the latest version
  handleMapClickRef.current = (params) => {
    if (!ready_ref.current || account_ref.current !== (user?.uid || null) || !params.name || params.seriesType === 'lines') return

    const storageKey = getStorageKey(currentMapRef.current)
    const data = loadData(storageKey)
    const currentState = data[params.name] || 'unvisited'
    const nextState = next_map_state(currentState)

    if (nextState === 'unvisited') {
      delete data[params.name]
    } else {
      data[params.name] = nextState
    }
    if (!saveData(storageKey, data)) {
      set_sync_status('浏览器无法保存记录，请检查存储设置。')
      return
    }

    edit_version.current += 1
    if (user) localStorage.setItem(`travel-dirty:${user.uid}`, '1')
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

  // Read only the public collection, ranked for the selected map.
  useEffect(() => {
    setLeaderboard([])
    set_leaderboard_error('')
    const count_field = { china: 'chinaVisited', world: 'worldVisited', shanghai: 'shanghaiVisited' }[currentMap]
    const q = query(collection(db, 'travelLeaderboard'), orderBy(count_field, 'desc'), limit(50))
    return onSnapshot(q, (snapshot) => {
      setLeaderboard(snapshot.docs.filter((entry) => entry.data()[count_field] > 0).map((entry) => {
        const data = entry.data()
        return {
          uid: entry.id, name: public_name(data), photoURL: data.photoURL || '',
          chinaVisited: data.chinaVisited || 0, worldVisited: data.worldVisited || 0,
          shanghaiVisited: data.shanghaiVisited || 0, isMe: user?.uid === entry.id,
        }
      }))
    }, (err) => {
      setLeaderboard([])
      set_leaderboard_error('排行榜暂时无法加载。')
      console.error('排行榜读取失败:', err)
    })
  }, [user, currentMap])

  const handleDeleteRecord = useCallback(async () => {
    if (!user || !ready_ref.current || account_ref.current !== user.uid) return
    if (!confirm('退出排行榜？你的私人足迹会保留。')) return
    clearTimeout(sync_timer.current)
    published_ref.current = false
    try {
      const batch = writeBatch(db)
      batch.update(doc(db, 'users', user.uid, 'travelPrivate', 'maps'), { published: false })
      batch.delete(doc(db, 'travelLeaderboard', user.uid))
      await batch.commit()
      set_sync_status('已退出排行榜，足迹仍会同步。')
    } catch (err) {
      published_ref.current = true
      set_sync_status('退出排行榜失败，请重试。')
      console.error('删除失败:', err)
    }
  }, [user])

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

  return { sync_status, leaderboard_error, currentMap, loading, loadingText, leaderboard, chartRef, switchMap, handleDeleteRecord, renderStatsCards }
}
