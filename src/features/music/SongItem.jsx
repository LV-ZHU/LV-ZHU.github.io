import { music_platforms, platform_url } from './catalog'

export default function SongItem({ song, highlighted }) {
  return (
    <li className={`music-item${highlighted ? ' highlight-pulse' : ''}`} id={song.id} tabIndex={-1}>
      <div className="music-info">
        <h3 className="music-name"><span className="music-track-number">{song.source_index + 1}.</span> {song.name}</h3>
        <div className="music-artist">{song.artist}</div>
      </div>
      <div className="music-actions">
        {[music_platforms.slice(0, 2), music_platforms.slice(2)].map((platform_group, group_index) => (
          <div className="music-platform-group" key={group_index}>
          {platform_group.map(platform => (
          <a key={platform.id} className={`music-link service-${platform.id}`} href={platform_url(platform, song)} target="_blank" rel="noopener noreferrer">
            {platform.label}
          </a>
          ))}
          </div>
        ))}
        {song.sourceUrl && <a className="music-link" href={song.sourceUrl} target="_blank" rel="noopener noreferrer">相关来源</a>}
      </div>
      {song.comment && <div className="music-summary">{song.comment}</div>}
    </li>
  )
}
