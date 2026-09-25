// 可复用的歌手别名集中维护；searchKeywords 只记录页面上看不到的个别线索。
const artist_aliases = {
    "王力宏": ["Leehom"],
    "蔡依林": ["Jolin"],
    "谢霆锋": ["Nicholas"],
    "孙燕姿": ["Stefanie"],
    "林俊杰": ["JJ"],
    "容祖儿": ["Joey"],
    "陈奕迅": ["Eason"],
    "莫文蔚": ["Karen"],
    "梁咏琪": ["Gigi"],
    "周传雄": ["小刚"],
}

const context_alias_rules = [
    { triggers: ["B站"], aliases: ["哔哩哔哩", "Bilibili"] },
    { triggers: ["BGM", "配乐", "主题曲", "插曲", "片头曲", "片尾曲"], aliases: ["背景音乐", "OST"] },
    { triggers: ["幼时记忆"], aliases: ["童年", "童年回忆"] },
    { triggers: ["FM89.9"], aliases: ["电台", "广播"] },
    { triggers: ["抖音"], aliases: ["短视频", "TikTok"] },
    { triggers: ["营销号"], aliases: ["短视频"] },
    { triggers: ["小学", "初中", "高中", "大学", "军训", "学农", "跑操", "广播体操", "音乐课", "文艺晚会", "毕业季"], aliases: ["校园"] },
    { triggers: ["旅游"], aliases: ["旅行"] },
    { triggers: ["希食东"], aliases: ["大学","同济","嘉定","满天星"] },
    { triggers: ["小学"], aliases: ["高一", "高安路一小"] },
    { triggers: ["初中"], aliases: ["南洋","龙华中路200号"] },
    { triggers: ["高中"], aliases: ["位育","sujia","tx","wyq"] },
    { triggers: ["大学"], aliases: ["同济","Tongji"] },
    { triggers: ["绿群"], aliases: ["绿裙","保研","计算机","CS","研究生","推免","夏令营","预推免"] },
]

function flatten_search_value(value) {
    return Array.isArray(value) ? value.join(' ') : (value || '')
}

function normalize_search_text(value) {
    return String(value || '').normalize('NFKC').toLowerCase().trim()
}

function get_artist_alias_text(song) {
    const credited_artists = `${song.artist || ''} ${flatten_search_value(song.contributors)}`
    return Object.entries(artist_aliases)
        .filter(([artist]) => credited_artists.includes(artist))
        .flatMap(([, aliases]) => aliases)
        .join(' ')
}

function get_context_alias_text(song) {
    const source_text = normalize_search_text([
        song.comment,
        flatten_search_value(song.searchKeywords),
    ].join(' '))

    const aliases = context_alias_rules
        .filter(rule => rule.triggers.some(trigger => source_text.includes(normalize_search_text(trigger))))
        .flatMap(rule => rule.aliases)

    const full_year_aliases = [...source_text.matchAll(/(^|\D)(\d{2})年/g)]
        .map(match => {
            const short_year = Number(match[2])
            return short_year <= 30 ? `20${match[2]}` : `19${match[2]}`
        })

    return [...new Set([...aliases, ...full_year_aliases])].join(' ')
}

export function matches_search(song, query) {
    const terms = normalize_search_text(query).split(/\s+/).filter(Boolean)
    if (terms.length === 0) return true

    const searchable_text = normalize_search_text([
        song.name,
        song.artist,
        song.comment,
        flatten_search_value(song.contributors),
        flatten_search_value(song.searchKeywords),
        get_artist_alias_text(song),
        get_context_alias_text(song),
    ].join(' '))

    return terms.every(term => searchable_text.includes(term))
}

