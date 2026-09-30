import { public_name } from '../auth/public_name.js'
import { countVisited } from './state.js'

// Explicit allowlist: never spread private maps or an authentication profile.
export function leaderboard_record(user, maps, nickname = '') {
  const chinaVisited = countVisited(maps.china)
  const worldVisited = countVisited(maps.world)
  const shanghaiVisited = countVisited(maps.shanghai)
  return {
    displayName: public_name(user, nickname),
    photoURL: user.photoURL || '',
    visitedCount: chinaVisited + worldVisited + shanghaiVisited,
    chinaVisited,
    worldVisited,
    shanghaiVisited,
  }
}
