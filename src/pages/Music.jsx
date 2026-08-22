import { useState, useCallback, useRef, useEffect } from 'react'
import FadeIn from '../components/FadeIn'
import '../styles/Music.css'

const songs_mandarin = [
    { name: "再见", artist: "张震岳", comment: "轻装策马青云路，人生从此驭长风。希君生羽翼，一化北冥鱼。毕业季金曲，FM89.9一个时代的落幕", searchKeywords: "高考 听力 电台 2024" },
    { name: "北京欢迎你", artist: "华语群星", comment: "奥运会主题曲，歌手云集，这首歌的录制背后有很多故事", searchKeywords: "陈天佳 2008 刘欢 那英 韩红 孙楠 成龙 王力宏 蔡依林 谢霆锋 周华健 孙燕姿 汪峰 谭晶 李宇春 周笔畅 张靓颖 羽泉 黄晓明 陈坤 林俊杰 容祖儿 任贤齐 陈奕迅 莫文蔚 梁咏琪 韦唯 韩庚" },
    { name: "水手", artist: "郑智化", comment: "属于70、80后的回忆", searchKeywords: "擦干泪 不要怕" },
    { name: "黄昏", artist: "周传雄", comment: "依然记得从你口中说出再见坚决如铁~传奇金曲，调子挺高的", searchKeywords: "" },
    { name: "江南", artist: "林俊杰", comment: "离愁能有多痛~痛有多浓", searchKeywords: "" },
    { name: "Don't Break My Heart", artist: "黑豹乐队", comment: "飞跃黄渡理工BGM，怀旧向 https://b23.tv/M4wFAnj", searchKeywords: "" },
    { name: "好久不见", artist: "陈奕迅", comment: "很治愈的感觉", searchKeywords: "" },
    { name: "这样很好 (Isha's Song)", artist: "陈奕迅", comment: "英雄联盟：双城之战第二季主题曲", searchKeywords: "" },
    { name: "你是我的眼", artist: "萧煌奇", comment: "激昂！", searchKeywords: "" },
    { name: "爱情转移", artist: "陈奕迅", comment: "把一个人的温暖~转移到另一个的胸膛~Eason经典，音乐会精选", searchKeywords: "" },
    { name: "王妃", artist: "萧敬腾", comment: "摇晃的红酒杯~嗨起来！", searchKeywords: "" },
    { name: "光阴的故事", artist: "罗大佑", comment: "罗老师的歌一放怀旧感就来了", searchKeywords: "" },
    { name: "暗香", artist: "沙宝亮", comment: "正如歌名，开始很低沉，副歌有种豁然开朗的感觉", searchKeywords: "" },
    { name: "吻别", artist: "张学友", comment: "我和你吻别~在无人的街，学友代表作", searchKeywords: "" },
    { name: "你的背包", artist: "陈奕迅", comment: "你的背包~背到现在还没烂", searchKeywords: "" },
    { name: "男人KTV", artist: "胡彦斌", comment: "内含吻别+你的背包歌词", searchKeywords: "" },
    { name: "烦恼歌", artist: "张学友", comment: "活泼、诙谐还带点禅意", searchKeywords: "" },
    { name: "凤凰花开的路口", artist: "林志炫", comment: "毕业季经典歌曲，22年FM89.9指定版", searchKeywords: "" },
    { name: "十年", artist: "陈奕迅", comment: "十年之前~我不认识你~你不属于我，Eason伪装走音的一曲", searchKeywords: "" },
    { name: "一场游戏一场梦", artist: "王杰", comment: "抑扬顿挫", searchKeywords: "" },
    { name: "稳稳的幸福", artist: "陈奕迅", comment: "肾宝片金曲，我要稳稳的幸福~", searchKeywords: "广告" },
    { name: "口是心非", artist: "张雨生", comment: "代表作，一路生花抄了这首歌的调子", searchKeywords: "" },
    { name: "我期待", artist: "张雨生", comment: "净化心灵，涤荡灵魂", searchKeywords: "" },
    { name: "情非得已", artist: "庾澄庆", comment: "磁性情歌这一块", searchKeywords: "" },
    { name: "唯一", artist: "王力宏", comment: "Baby~你就是我的唯一~", searchKeywords: "" },
    { name: "无所谓", artist: "杨坤", comment: "无所谓 谁会爱上谁", searchKeywords: "" },
    { name: "过火", artist: "张信哲", comment: "《繁花》指定怀旧金曲，怎么忍心怪你犯了错~是我给你自由过了火~", searchKeywords: "" },
    { name: "伤心太平洋", artist: "任贤齐", comment: "我等的船还不来~我等的人还不明白~", searchKeywords: "" },
    { name: "就是现在", artist: "王力宏", comment: "史上最绝转音", searchKeywords: "" },
    { name: "告白气球", artist: "周杰伦", comment: "板载曲目", searchKeywords: "" },
    { name: "寂寞沙洲冷", artist: "周传雄", comment: "比黄昏调子低，容易哼唱", searchKeywords: "" },
    { name: "童年", artist: "罗大佑", comment: "还真是童年时期听的", searchKeywords: "" },
    { name: "洋葱", artist: "杨宗纬", comment: "如果你愿意一层一层一层地剥开我的心~", searchKeywords: "" },
    { name: "菊花台", artist: "周杰伦", comment: "电影《英雄》主题曲，音乐会精选", searchKeywords: "" },
    { name: "星星点灯", artist: "郑智化", comment: "星星点灯~照亮我的家~门~", searchKeywords: "" },
    { name: "刀剑如梦", artist: "周华健", comment: "侠气", searchKeywords: "" },
    { name: "年少有为", artist: "李荣浩", comment: "假如我年少有为不自卑~", searchKeywords: "" },
    { name: "特别的爱给特别的你", artist: "伍思凯", comment: "特步鞋广告选定曲目", searchKeywords: "" },
    { name: "凡人歌", artist: "李宗盛", comment: "唱的并非凡人调", searchKeywords: "" },
    { name: "贝加尔湖畔", artist: "李健", comment: "很平静，仿佛真的在湖畔旁漫步", searchKeywords: "" },
    { name: "大海", artist: "张雨生", comment: "副歌的大海两个字完美唱出了大海的那种开阔感", searchKeywords: "" },
    { name: "驿站", artist: "毛不易", comment: "普通平凡的美好生活", searchKeywords: "" },
    { name: "淘汰", artist: "陈奕迅", comment: "醒来了~梦散了~你我都走散了~，和hold me now,touch me now一个调子", searchKeywords: "" },
    { name: "秋意浓", artist: "张学友", comment: "略带日式风格", searchKeywords: "" },
    { name: "偷心", artist: "张学友", comment: "是谁偷偷偷走~我~的~~心，《繁花》严选", searchKeywords: "" },
    { name: "白月光", artist: "张信哲", comment: "白月光~照天涯的两端", searchKeywords: "" },
    { name: "单身情歌", artist: "林志炫", comment: "为了爱孤军奋斗~", searchKeywords: "" },
    { name: "突然好想你", artist: "五月天", comment: "代表作，最怕空气突然安静的出处", searchKeywords: "" },
    { name: "走过1999", artist: "张学友", comment: "走过1999世纪最末一分钟~跨世纪", searchKeywords: "" },
    { name: "信仰", artist: "张信哲", comment: "你究竟知道吗", searchKeywords: "" },
    { name: "千里之外", artist: "周杰伦、费玉清", comment: "我送你离开~千里之外~你是否还~~~在", searchKeywords: "" },
    { name: "那些你很冒险的梦", artist: "林俊杰", comment: "痛 太痛了", searchKeywords: "" },
    { name: "美人鱼", artist: "林俊杰", comment: "希食东精选", searchKeywords: "" },
    { name: "清明上河图", artist: "李玉刚", comment: "几秒钟的世界~感叹不平凡的意义~，绝品转音", searchKeywords: "" },
    { name: "最远的你是我最近的爱", artist: "车继铃", comment: "风雨之后~无所谓拥有~萍水相逢（这个逢就很魔性）~你却给我那么（么也是）多", searchKeywords: "" },
    { name: "一千零一夜", artist: "邰正宵", comment: "真的思念啊", searchKeywords: "" },
    { name: "九百九十九朵玫瑰", artist: "邰正宵", comment: "我早已为你种下~九百九十九朵玫瑰~", searchKeywords: "" },
    { name: "我的未来不是梦", artist: "张雨生", comment: "非常有希望的感觉", searchKeywords: "" },
    { name: "情网", artist: "张学友", comment: "令人心碎的歌声", searchKeywords: "" },
    { name: "我是一只小小鸟", artist: "赵传", comment: "想要飞却怎么样也飞不高~", searchKeywords: "" },
    { name: "刚好遇见你", artist: "李玉刚", comment: "魔性，因为我刚好遇见你这一句不断换调", searchKeywords: "" },
    { name: "花心", artist: "周传雄", comment: "九十年代大街小巷传播的又一首歌曲", searchKeywords: "" },
    { name: "一路向北", artist: "周杰伦", comment: "我一路向北~离开有你的季节", searchKeywords: "" },
    { name: "千万次的问", artist: "刘欢", comment: "Time and time again ~ you ask me", searchKeywords: "" },
    { name: "找一个字代替", artist: "邰正宵", comment: "想你就乱、乱、乱头绪~不想又伤、伤、伤自己", searchKeywords: "" },
    { name: "安妮", artist: "王杰", comment: "安妮~我不能失去你", searchKeywords: "" },
    { name: "空城", artist: "杨坤", comment: "这城市那么空~这回忆那么凶 Along~Along~Along", searchKeywords: "" },
    { name: "月亮之上", artist: "凤凰传奇", comment: "我在仰望~月亮~之~上，电台金曲", searchKeywords: "" },
    { name: "我还想她", artist: "林俊杰", comment: "当泪水堵住了胸口~就让沉默~代替所有回答", searchKeywords: "" },
    { name: "别怕我伤心", artist: "张信哲", comment: "一颗爱~你~的心~时时刻刻为你转不停", searchKeywords: "" },
    { name: "爱相随", artist: "周华健", comment: "人分飞~爱相随~哪怕用一生去追", searchKeywords: "" },
    { name: "月亮代表我的心", artist: "邓丽君", comment: "一曲打动我的心~，音乐会精选", searchKeywords: "" },
    { name: "恋曲1990", artist: "罗大佑", comment: "属于中年人的爱情曲", searchKeywords: "" },
    { name: "花海", artist: "周杰伦", comment: "周董经典曲目", searchKeywords: "" },
    { name: "消愁", artist: "毛不易", comment: "高中文艺晚会精选，一杯敬朝阳~一杯敬月光", searchKeywords: "" },
    { name: "修炼爱情", artist: "林俊杰", comment: "修炼爱情的悲欢~我们这些努力不简单", searchKeywords: "" },
    { name: "说谎", artist: "林宥嘉", comment: "平淡，但又悲伤", searchKeywords: "" },
    { name: "祈愿", artist: "张艺兴", comment: "19年FM89.9限定版", searchKeywords: "" },
    { name: "大约在冬季", artist: "齐秦", comment: "音乐会曲目", searchKeywords: "" },
    { name: "犯贱", artist: "徐良、阿悄", comment: "我习惯你走在我的身后~无论什么要求你全都接受~", searchKeywords: "" },
    { name: "涛声依旧", artist: "毛宁", comment: "月落乌啼总是千年的风霜~涛声依旧不见当初的夜晚~", searchKeywords: "" },
    { name: "不如这样", artist: "陈奕迅", comment: "不如这样~我们一直拥抱到天亮~", searchKeywords: "" },
    { name: "路灯下的小姑娘", artist: "杨坤", comment: "亲爱的小妹妹~请你不要不要哭泣~", searchKeywords: "" },
    { name: "宽容", artist: "张信哲", comment: "治愈，没有泪的夜~~晚~是~天堂~", searchKeywords: "" },
    { name: "忘情水", artist: "刘德华", comment: "上世纪风味,给我一杯忘情水~换我一夜不流泪~", searchKeywords: "" },
    { name: "挪威的森林", artist: "伍佰 & China Blue", comment: "那里湖面总是澄清~那里空气充满宁静", searchKeywords: "" },
    { name: "一次就好", artist: "杨宗纬", comment: "世界还小~我陪你去到天涯海角~在没有烦恼的角落里停止寻找~", searchKeywords: "" },
    { name: "一剪梅", artist: "费玉清", comment: "雪~~花飘飘~北方潇潇~", searchKeywords: "" },
    { name: "演员", artist: "薛之谦", comment: "15年附近传遍大街小巷的代表作，该配合你演出的我视而不见~", searchKeywords: "" },
    { name: "Mojito", artist: "周杰伦", comment: "20年FM89.9指定版", searchKeywords: "" },
    { name: "那些年", artist: "胡夏", comment: "最早是在一个游戏小程序上听到的", searchKeywords: "" },
    { name: "轨迹", artist: "周杰伦", comment: "我会发着呆~然后忘记你~接着紧紧闭上眼~，FM89.9指定版", searchKeywords: "" },
    { name: "稻香", artist: "周杰伦", comment: "传唱度很高的周董歌曲，平静且有个性，高中学农晚会歌曲", searchKeywords: "" },
    { name: "乡间的小路", artist: "刘文正", comment: "走在乡间的小路上~暮归的老牛是我同伴~", searchKeywords: "" },
    { name: "三月里的小雨", artist: "刘文正", comment: "绵长又娓娓道来", searchKeywords: "" },
    { name: "海芋恋", artist: "萧敬腾", comment: "18年FM89.9限定版", searchKeywords: "" },
    { name: "爱如潮水", artist: "张信哲", comment: "爱如潮水它将你我包~围~~", searchKeywords: "" },
    { name: "如果这都不算爱", artist: "张学友", comment: "调子比较欢快", searchKeywords: "" },
    { name: "朋友", artist: "周华健", comment: "朋友一生一起走~那些日子不再留~一句话~一辈子", searchKeywords: "" },
    { name: "我", artist: "张国荣", comment: "我就是我~是颜色不一样的烟火~", searchKeywords: "" },
    { name: "新贵妃醉酒", artist: "李玉刚", comment: "爱恨就在一瞬间~举杯对月情似天~", searchKeywords: "" },
    { name: "死了都要爱", artist: "信乐团", comment: "发自肺腑的歌声", searchKeywords: "" },
    { name: "不为谁而作的歌", artist: "林俊杰", comment: "jj特色转音，记忆点很深", searchKeywords: "" },
    { name: "对你爱不完", artist: "郭富城", comment: "对你爱爱爱不完~我可以天天月月年年到永远~，四大天王之一的代表作", searchKeywords: "" },
    { name: "爱要怎么说出口", artist: "赵传", comment: "第一次握你的手~指尖传来你的温柔~", searchKeywords: "" },
    { name: "青花瓷", artist: "周杰伦", comment: "东航指定下机曲目，天青色等烟雨~而我在等你~", searchKeywords: "" },
    { name: "爱的就是你", artist: "王力宏", comment: "FM89.9指定版", searchKeywords: "" },
    { name: "青花", artist: "周传雄", comment: "记忆油膏反复涂抹~无法愈合的伤口~你的回头划伤了沉默~", searchKeywords: "" },
    { name: "心雨", artist: "杨钰莹 毛宁", comment: "因为明天~我要成为别人的新娘~ 本歌为男女歌手分界线", searchKeywords: "" },
    { name: "如愿", artist: "王菲", comment: "21年那阵很火，高中文艺晚会限定版", searchKeywords: "" },
    { name: "明天，你好", artist: "牛奶咖啡", comment: "明天你好~含着泪微笑~，23年FM89.9限定版", searchKeywords: "" },
    { name: "俩俩相忘", artist: "辛晓琪", comment: "副歌记忆点很深，浪涛涛~人渺渺~青春鸟飞去了~", searchKeywords: "" },
    { name: "冬季到台北来看雨", artist: "孟庭苇", comment: "幼时记忆", searchKeywords: "" },
    { name: "你看你看月亮的脸", artist: "孟庭苇", comment: "幼时记忆", searchKeywords: "" },
    { name: "和你一样", artist: "李宇春", comment: "平静、悠长，21年FM89.9限定版", searchKeywords: "" },
    { name: "轻轻的告诉你", artist: "杨钰莹", comment: "温柔的嗓音，唱出了少女的心事", searchKeywords: "" },
    { name: "在水一方", artist: "邓丽君", comment: "我愿逆流而上~依偎在她身旁~", searchKeywords: "" },
    { name: "葬花吟", artist: "陈力", comment: "87版《红楼梦》插曲", searchKeywords: "" },
    { name: "小城故事", artist: "邓丽君", comment: "谈的谈~说的说~小城故事真不错~", searchKeywords: "" },
    { name: "我只在乎你", artist: "邓丽君", comment: "幼时记忆", searchKeywords: "" },
    { name: "宁夏", artist: "梁静茹", comment: "甜嗓，唱出了宁静的快乐感", searchKeywords: "" },
    { name: "恰似你的温柔", artist: "邓丽君", comment: "幼时记忆", searchKeywords: "" },
    { name: "路边的野花不要采", artist: "邓丽君", comment: "记着我的情~记着我的爱~记着有我天天在等待~  千万不要把~我来忘怀~", searchKeywords: "" },
    { name: "外面的世界", artist: "莫文蔚", comment: "FM89.9指定版", searchKeywords: "" },
    { name: "张三的歌", artist: "蔡琴", comment: "我们要飞~到那遥~远地方~", searchKeywords: "" },
    { name: "甜蜜蜜", artist: "邓丽君", comment: "幼时记忆", searchKeywords: "" },
    { name: "但愿人长久", artist: "邓丽君", comment: "幼时记忆", searchKeywords: "" },
    { name: "又见炊烟", artist: "邓丽君", comment: "又见炊烟升起~勾起我回忆~", searchKeywords: "" },
    { name: "哭砂", artist: "张惠妹", comment: "风吹来的砂落在悲伤的眼里~谁都看出我在等你~", searchKeywords: "" },
    { name: "听海", artist: "张惠妹", comment: "听~海哭的声音~", searchKeywords: "" },
    { name: "雨爱", artist: "杨丞琳", comment: "窗外的雨滴~一滴滴累积，希食东精选", searchKeywords: "" },
    { name: "渡口", artist: "蔡琴", comment: "而明日~明日~又隔天~~涯~", searchKeywords: "" },
    { name: "欧若拉", artist: "张韶涵", comment: "帅气开场转音", searchKeywords: "" },
    { name: "下一个天亮", artist: "郭静", comment: "希食东精选", searchKeywords: "" },
    { name: "美酒加咖啡", artist: "邓丽君", comment: "幼时记忆", searchKeywords: "" },
    { name: "最浪漫的事", artist: "赵咏华", comment: "我能想到最浪漫的事~就是和你一起慢慢变老~", searchKeywords: "" },
    { name: "画心", artist: "张靓颖", comment: "爱着你~像心跳~难触摸~画着你~画不出~你的骨骼~", searchKeywords: "" },
    { name: "痒", artist: "黄龄", comment: "来啊~快活啊~反正有大把时光~", searchKeywords: "" },
    { name: "泡沫", artist: "邓紫棋", comment: "代表作，和唱说谎的歌手有故事", searchKeywords: "" },
    { name: "遇见你的时候所有星星都落到我头上", artist: "高姗", comment: "高中学农晚会歌曲", searchKeywords: "" },
    { name: "High歌", artist: "黄龄", comment: "一高一低，很有感觉，符合歌名", searchKeywords: "" },
    { name: "隐形的翅膀", artist: "张韶涵", comment: "高中学农晚会歌曲，治愈向 我终于翱翔~用心凝望不害怕~哪里会有风就飞多远吧", searchKeywords: "" },
    { name: "易燃易爆炸", artist: "陈粒", comment: "图我清真~还图我眼波消魂", searchKeywords: "" },
    { name: "梦醒了", artist: "那英", comment: "如果梦醒时还在一起~请容许我们相依为命~绚烂也许一时~平淡走完一世~", searchKeywords: "" },
    { name: "梦一场", artist: "那英", comment: "早知道是这样~像梦一场~我才不会把爱放在同一个地方~", searchKeywords: "" },
    { name: "默", artist: "那英", comment: "副歌音很高", searchKeywords: "" },
    { name: "日不落", artist: "蔡依林", comment: "我要送你日不落的爱恋~心牵着心把世界走遍~", searchKeywords: "" },
    { name: "后来", artist: "刘若英", comment: "毕业季神曲", searchKeywords: "" },
    { name: "为你我受冷风吹", artist: "林忆莲", comment: "但愿我会就此放下往事~忘了过去有多美~", searchKeywords: "" },
    { name: "至少还有你", artist: "林忆莲", comment: "也许全世界我也可以忘记~就是不愿意失去你的消息~", searchKeywords: "" },
    { name: "笑忘书", artist: "王菲", comment: "将这样的感触~写一封情书~送你我自己~", searchKeywords: "" },
    { name: "流年", artist: "王菲", comment: "流年两个字唱的很有感觉", searchKeywords: "" },
    { name: "开到荼蘼", artist: "王菲", comment: "曲调磅礴大气，充满宿命感", searchKeywords: "" },
    { name: "真的还是假的", artist: "孟庭苇", comment: "幼时记忆", searchKeywords: "" },
    { name: "你究竟有几个好妹妹", artist: "孟庭苇", comment: "幼时记忆", searchKeywords: "" },
    { name: "百年孤寂", artist: "王菲", comment: "悲哀是真的~泪是假的~本来没因果~", searchKeywords: "" },
    { name: "你快乐所以我快乐", artist: "王菲", comment: "平淡，但声音有一种漂浮感", searchKeywords: "" },
    { name: "天空", artist: "王菲", comment: "空灵、细腻", searchKeywords: "" },
    { name: "世界赠予我的", artist: "王菲", comment: "春晚曲目", searchKeywords: "" },
    { name: "童年", artist: "卓依婷", comment: "经典童年歌曲，活泼欢快", searchKeywords: "" },
    { name: "风中有朵雨做的云", artist: "孟庭苇", comment: "幼时记忆", searchKeywords: "" },
    { name: "谁的眼泪在飞", artist: "孟庭苇", comment: "幼时记忆", searchKeywords: "" },
    { name: "羞答答的玫瑰静悄悄地开", artist: "孟庭苇", comment: "幼时记忆", searchKeywords: "" },
    { name: "伊犁欢迎你", artist: "胡瑛", comment: "夏塔BGM", searchKeywords: "" },
    { name: "【十年榜】华语top100", artist: "", comment: "本序号不指向某一首歌曲，起分界线作用，下面的曲目大多只能算是用国语唱的，和早期经典的华语/国语歌曲概念有一定距离", searchKeywords: "" },
    { name: "孤勇者", artist: "陈奕迅", comment: "英雄联盟：双城之战第一季主题曲，已被小学生攻占", searchKeywords: "" },
    { name: "伤不起", artist: "王麟、老猫", comment: "电话打给你~美女又在你怀里~", searchKeywords: "" },
    { name: "路过人间", artist: "郁可唯", comment: "《我们与恶的距离》的插曲，天可怜见~心碎在所难免~", searchKeywords: "" },
    { name: "爸爸去哪儿", artist: "林志颖、KIMI、张亮、天天", comment: "综艺《爸爸去哪儿》的主题曲", searchKeywords: "" },
    { name: "哎呀姑妈", artist: "沙宝亮", comment: "电影《李茶的姑妈》主题曲", searchKeywords: "" },
    { name: "爱的供养", artist: "张靓颖 张杰", comment: "我用尽一生一世来将你供养~只期盼你停住流转的目光~", searchKeywords: "" },
    { name: "我的梦", artist: "张靓颖", comment: "华为主题曲", searchKeywords: "" },
    { name: "十里洋场之北十五里", artist: "", comment: "《同舟共济》舞台剧主题曲，大学军训时期初听，调子记忆点很深", searchKeywords: "" },
    { name: "济向未来", artist: "同济大学学生合唱团", comment: "大学记忆", searchKeywords: "" },
    { name: "当那一天来临", artist: "总政合唱团", comment: "大学军训", searchKeywords: "" },
    { name: "再次与你同行", artist: "熊大 熊二 光头强", comment: "电影十周年主题曲，意义非凡的一首歌。万水千山总有成长也总有分离。珍惜当下，过好每一天。", searchKeywords: "" },
    { name: "我还有点小糊涂", artist: "刘晨", comment: "动画片《熊出没》主题曲", searchKeywords: "" },
    { name: "开学第一课", artist: "TFBOYS", comment: "2016开学第一课主题曲", searchKeywords: "" },
    { name: "青春修炼手册", artist: "TFBOYS", comment: "14年火爆歌曲", searchKeywords: "" },
    { name: "小苹果", artist: "筷子兄弟", comment: "14年火爆歌曲", searchKeywords: "" },
    { name: "早安隆回", artist: "袁树雄", comment: "缝合怪歌曲", searchKeywords: "" },
    { name: "芒种", artist: "音阙诗听、赵方婧", comment: "抖音经典BGM", searchKeywords: "" },
    { name: "这世界那么多人", artist: "莫文蔚", comment: "曲调挺治愈的，土木の小曲", searchKeywords: "" },
    { name: "安和桥", artist: "宋冬野", comment: "我知道~那些夏天~就像青春一样回不来", searchKeywords: "" },
    { name: "生来倔强", artist: "南征北战NZBZ", comment: "有一种理想~照亮了迷茫~在我深感自豪的地方~", searchKeywords: "" },
    { name: "我的未来式", artist: "郭采洁", comment: "大学军训晚会之歌~吵醒了闹区的树木~吸一口纯氧就漂浮", searchKeywords: "" },
    { name: "奇迹再现", artist: "毛华锋", comment: "《迪迦奥特曼》片头曲，大学军训晚会之歌", searchKeywords: "" },
    { name: "我们都一样", artist: "张杰", comment: "努力的往前飞~再累也无所谓~黑夜过后的光芒有多美", searchKeywords: "" },
    { name: "小美满", artist: "周深", comment: "电影《热辣滚烫》主题曲，你看小狗在叫树叶会笑风声在呢喃~不如好好欣赏一秒迷迷糊糊的浪漫", searchKeywords: "" },
    { name: "总以为来日方长", artist: "梅朵", comment: "我们不慌不忙总以为来日方长~我们等待花开却忘了世事无常~", searchKeywords: "" },
    { name: "好运来", artist: "祖海", comment: "气运加成、上岸の小曲", searchKeywords: "" },
    { name: "感恩的心", artist: "欧阳菲菲", comment: "感恩的心~感谢有你~伴我一生~让我有勇气做我自己~", searchKeywords: "" },
    { name: "平凡之路", artist: "朴树", comment: "希望之歌，我曾经跨过山和大海~也穿过人生人海~", searchKeywords: "" },
    { name: "落在生命里的光", artist: "尹昔眠", comment: "你是落在我世界里的一束光~向我奔来~万物都生长", searchKeywords: "" },
    { name: "爸爸妈妈", artist: "李荣浩", comment: "回头去看~这是说了谢谢~反而才亏欠的情感~", searchKeywords: "" },
    { name: "短歌行", artist: "许鹤缤", comment: "古风、辽阔之感", searchKeywords: "" },
    { name: "梦想开始的地方", artist: "SNH48", comment: "小学回忆", searchKeywords: "" },
    { name: "少年先锋队队歌", artist: "蓝天合唱团", comment: "红领巾", searchKeywords: "" },
    { name: "希望风帆", artist: "第三套全国小学生广播体操", comment: "小学广播体操", searchKeywords: "" },
    { name: "舞动青春", artist: "第三套全国中学生广播体操", comment: "初中高中广播体操", searchKeywords: "" },
    { name: "别看我只是一只羊", artist: "古倩敏", comment: "动画片《喜羊羊与灰太狼》主题曲", searchKeywords: "" },
    { name: "吉祥三宝", artist: "布仁巴雅尔", comment: "美好时光海苔广告御用", searchKeywords: "" },
    { name: "风铃", artist: "合唱团", comment: "初中音乐课特供", searchKeywords: "" },
    { name: "相信自己", artist: "零点乐队", comment: "高中等级考前的大会加油歌曲", searchKeywords: "" },
    { name: "起风了", artist: "买辣椒也用券", comment: "疫情时听到的，我曾难自拔于世界之大~也沉溺于其中梦话", searchKeywords: "" },
    { name: "转身即心痛", artist: "谭维维、黄子弘凡", comment: "怎么转身又是一阵心痛~只好攥紧双手任泪横流", searchKeywords: "" },
    { name: "鱼我所欲也", artist: "庞岩", comment: "古风吟唱", searchKeywords: "" },
    { name: "见字如面", artist: "龚子婕JessieG", comment: "希食东精选", searchKeywords: "" },
    { name: "为你放弃全世界", artist: "王琪", comment: "出租车司机特供", searchKeywords: "" },
    { name: "我的天空", artist: "南征北战NZBZ", comment: "电影《青春派》主题曲，有拼搏感", searchKeywords: "" },
    { name: "荷塘月色", artist: "凤凰传奇", comment: "平静中的美好", searchKeywords: "" },
    { name: "最炫民族风", artist: "凤凰传奇", comment: "广场舞鼻祖", searchKeywords: "" },
    { name: "外婆的澎湖湾", artist: "潘安邦", comment: "初中跑操伴奏", searchKeywords: "" },
    { name: "卡路里", artist: "火箭少女101", comment: "电影《西虹市首富》插曲", searchKeywords: "" },
    { name: "布谷鸟", artist: "安子与九妹乐队", comment: "平淡、简单的生活感", searchKeywords: "" },
    { name: "晚晴", artist: "北翼乐队", comment: "希食东精选", searchKeywords: "" },
    { name: "我和我的祖国", artist: "华语群星", comment: "电影《我和我的祖国》主题曲", searchKeywords: "" },
    { name: "难忘今宵", artist: "李谷一", comment: "春晚指定ED", searchKeywords: "" },
    { name: "Ring Ring Ring", artist: "不是花火呀", comment: "出租车司机特供", searchKeywords: "" },
    { name: "少年", artist: "梦然", comment: "仿佛穿越回了疫情初代目的时期", searchKeywords: "" },
    { name: "一路生花", artist: "温奕心", comment: "疫情歌曲，上岸の小曲", searchKeywords: "" },
    { name: "生僻字", artist: "陈柯宇", comment: "初中记忆，鳞次栉比，想起芥川龙之介了", searchKeywords: "" },
    { name: "生僻字 (化学版)", artist: "", comment: "化学图谱概览，拍摄于中国科学院上海有机化学研究所", searchKeywords: "" },
    { name: "最美的期待", artist: "周笔畅", comment: "初中听的，你就是我最美的期待~", searchKeywords: "" },
    { name: "夜空中最亮的星", artist: "逃跑计划", comment: "初中开始就很经典的小曲", searchKeywords: "" },
    { name: "墨梅", artist: "王泓翔、犀", comment: "古风，优雅", searchKeywords: "" },
    { name: "跑操音乐", artist: "", comment: "初中严选", searchKeywords: "" },
    { name: "少年中国说", artist: "张杰", comment: "少年自有少年狂~身似山河挺脊梁~敢将日月再丈量~今朝唯我少年郎", searchKeywords: "" },
    { name: "如果有一天我变得很有钱", artist: "毛不易", comment: "朴素直白的歌词", searchKeywords: "" },
    { name: "耍大牌", artist: "丁当", comment: "电视节目五星体育《弈棋耍大牌》片尾曲", searchKeywords: "" },
    { name: "铃儿响叮当", artist: "", comment: "音乐会精选", searchKeywords: "" },
    { name: "有你真好", artist: "侯磊", comment: "电视剧《急诊室故事》主题曲，拍摄于六院", searchKeywords: "" },
    { name: "不说明的默契", artist: "林渝植", comment: "希食东精选，BGM上头", searchKeywords: "" },
    { name: "海屿你", artist: "马_Crabbit", comment: "这回忆的漩涡~快要把我吞没~求你别离开我~因为~我欠你太多", searchKeywords: "" },
    { name: "飞鸟和蝉", artist: "任然", comment: "北纬线的思念被季风吹远~吹远默念的侧脸~吹远鸣唱的诗篇~", searchKeywords: "" },
    { name: "像我这样的人", artist: "毛不易", comment: "手机铃声，电影《二手杰作》主题曲", searchKeywords: "" },
    { name: "后继者", artist: "任然", comment: "时间真是像是长了脚的妖怪~跑的飞快~", searchKeywords: "" },
    { name: "当你孤单你会想起谁", artist: "郭美美", comment: "你的快乐伤悲~只有我能体会~让我再陪你走一回~", searchKeywords: "" },
    { name: "晚安", artist: "颜人中", comment: "几人份的畅谈~道三两句晚安，希食东精选", searchKeywords: "" },
]

const songs_cantonese = [
    { name: "富士山下", artist: "陈奕迅", comment: "谁都只得那双手~靠拥抱亦难任你拥有，音乐演唱曲目", searchKeywords: "" },
    { name: "七点半钟的阳光", artist: "张天赋", comment: "KFC指定BGM", searchKeywords: "" },
    { name: "海阔天空", artist: "Beyond", comment: "广东省省歌的含金量", searchKeywords: "" },
    { name: "浮夸", artist: "陈奕迅", comment: "调子超高的一首歌", searchKeywords: "" },
    { name: "光辉岁月", artist: "Beyond", comment: "今天只有残留的躯壳~迎接光辉岁月~风雨中抱紧自由~", searchKeywords: "" },
    { name: "漫步人生路", artist: "邓丽君", comment: "让疾风吹呀吹~尽管给我俩考验~小雨点放心洒~早已决心向着前~", searchKeywords: "" },
    { name: "今夜你会不会来", artist: "黎明", comment: "你的爱还在不在~", searchKeywords: "" },
    { name: "夕阳之歌", artist: "梅艳芳", comment: "梅姐！", searchKeywords: "" },
    { name: "爱多一次痛多一次", artist: "谭咏麟", comment: "谁能忍受~一个人痛苦已足够~", searchKeywords: "" },
    { name: "一生中最爱", artist: "谭咏麟", comment: "如痴如醉~还盼你懂珍惜自己~有天真的分离~我都想你~我真的想你", searchKeywords: "" },
]

const songs_foreign = [
    { name: "Dai Dai", artist: "Shakira、Burna Boy", comment: "2026 World Cup主题曲，塞万提斯笔下的梦骑士的精神，协作、纪律和共同信念铸就的伟大，Vamossss!", searchKeywords: "" },
    { name: "Lighter", artist: "Jelly Roll、Carin Leon", comment: "2026 World Cup震撼首发, 让我们相约在落基山、尼亚加拉瀑布、尤卡坦半岛，让我们一起去玛雅文明曾经存在过的地方", searchKeywords: "" },
    { name: "Zoo(From Zootopia 2)", artist: "Disney、Shakira", comment: "电影《疯狂动物城2》主题曲", searchKeywords: "" },
    { name: "When I'm Home", artist: "Travis Scott", comment: "电影《奥德赛》片尾曲", searchKeywords: "" },
    { name: "Waka Waka", artist: "Shakira", comment: "2010 World Cup", searchKeywords: "" },
    { name: "Hayya Hayya", artist: "Trinidad Cardona", comment: "2022 World Cup", searchKeywords: "" },
    { name: "Rolling in the deep", artist: "Adele 阿黛尔", comment: "超高转音，高中文艺晚会精选", searchKeywords: "" },
    { name: "The New Dawn", artist: "Nicola Sedda", comment: "低沉，但有力量", searchKeywords: "" },
    { name: "The Miracle", artist: "Nicola Sedda", comment: "高音这一块", searchKeywords: "" },
    { name: "打上花火", artist: "米津玄师", comment: "那一天的忧郁~忧郁起来~", searchKeywords: "" },
    { name: "You Raise Me Up", artist: "Westlife", comment: "合唱团曲目", searchKeywords: "" },
    { name: "Shots", artist: "Imagine Dragons、Broiler", comment: "运动の小曲", searchKeywords: "" },
    { name: "Dream It Possible", artist: "Delacey", comment: "华为主题曲英文版", searchKeywords: "" },
    { name: "Colors (Coca-Cola Anthem)", artist: "Jason Derulo", comment: "2018 World Cup，进球时放的一曲，那个盛夏在徐汇日月光的屏幕上听过好几次", searchKeywords: "" },
    { name: "In Another Life", artist: "Nicola Sedda", comment: "高音这一块", searchKeywords: "" },
    { name: "Top Of The World (1973 remix)", artist: "Carpenters", comment: "经典，无需多言，上头", searchKeywords: "" },
    { name: "The Cup Of Life", artist: "Ricky Martin", comment: "1998 World Cup", searchKeywords: "" },
    { name: "Seasons In The Sun", artist: "Westlife", comment: "变声期后最适合男生唱的歌之一", searchKeywords: "" },
    { name: "The Mirror", artist: "Nicola Sedda", comment: "高音这一块", searchKeywords: "" },
    { name: "Colors", artist: "Nicola Sedda", comment: "高音这一块", searchKeywords: "" },
    { name: "Dreamers", artist: "Jung Kook、FIFA", comment: "2022 World Cup，Look who we are, We are the dreamers", searchKeywords: "" },
    { name: "Yesterday Once More", artist: "Carpenters", comment: "经典，无需多言", searchKeywords: "" },
    { name: "If I Fall", artist: "Nicola Sedda", comment: "高音这一块", searchKeywords: "" },
    { name: "Emotions", artist: "Mariah Carey", comment: "五连升海豚音", searchKeywords: "" },
    { name: "Time of Our Lives", artist: "Toni Braxton、Il Divo", comment: "2006 World Cup", searchKeywords: "" },
    { name: "We Are the World", artist: "Michael Jackson", comment: "mj代表作，初中严选", searchKeywords: "" },
    { name: "Anthem (JS Radio Edit)", artist: "Vangelis", comment: "2002 World Cup", searchKeywords: "" },
    { name: "Good Time", artist: "Owl City、Carly Rae Jepsen", comment: "欢快的旋律", searchKeywords: "" },
    { name: "Un'Estate Italiana", artist: "edoardo bennato", comment: "1990 World Cup", searchKeywords: "" },
    { name: "Tukoh Taka", artist: "Nicki Minaj", comment: "带感小曲，2022 World Cup", searchKeywords: "" },
    { name: "Whistle", artist: "Flo Rida", comment: "节奏感强，初中严选", searchKeywords: "" },
    { name: "Lone Ranger", artist: "Rachel Platten", comment: "励志歌曲", searchKeywords: "" },
    { name: "Take Me Home, Country Roads", artist: "John Denver", comment: "经典民谣", searchKeywords: "" },
    { name: "Lemon Tree", artist: "Fool's Garden", comment: "轻松愉快，初中严选", searchKeywords: "" },
    { name: "This Is It", artist: "Michael Jackson", comment: "据传是mj生前最后一作", searchKeywords: "" },
    { name: "Gloryland", artist: "Daryl Hall And John Oates", comment: "1994 World Cup", searchKeywords: "" },
    { name: "Boom", artist: "Anastacia", comment: "2002 World Cup", searchKeywords: "" },
    { name: "Sailing On A Shell", artist: "Nicola Sedda", comment: "高音这一块", searchKeywords: "" },
    { name: "This Girl", artist: "Kungs", comment: "苹果发布会小曲", searchKeywords: "" },
    { name: "Heal The World", artist: "Michael Jackson", comment: "Make it a better day~，初中严选", searchKeywords: "" },
    { name: "You Are Not Alone", artist: "Michael Jackson", comment: "I am here with you~though you're far away~I am here to stay~，初中严选", searchKeywords: "" },
    { name: "The Sounds of Silence", artist: "Simon & Garfunkel", comment: "宁静、治愈，初中严选", searchKeywords: "" },
    { name: "Proud Of You", artist: "冯曦妤", comment: "温柔、治愈", searchKeywords: "" },
    { name: "The Call", artist: "Nicola Sedda", comment: "高音这一块", searchKeywords: "" },
    { name: "Legends Never Die", artist: "英雄联盟", comment: "英雄联盟主题曲", searchKeywords: "" },
    { name: "Earth Song", artist: "Michael Jackson", comment: "珍惜人类居住的家园，初中严选", searchKeywords: "" },
    { name: "Natural", artist: "Imagine Dragons", comment: "燃！嗨！", searchKeywords: "" },
    { name: "Talking to the Moon", artist: "Bruno Mars", comment: "经典曲目，无需多言", searchKeywords: "" },
    { name: "Bang Bang Bang", artist: "Jessie J", comment: "KTV必点，带动气氛", searchKeywords: "" },
    { name: "Nothing's Going to Change My Love For You", artist: "Westlife", comment: "婚礼必备", searchKeywords: "" },
    { name: "try try try", artist: "Jason Mraz", comment: "欢快，初中严选", searchKeywords: "" },
    { name: "Dancing With Your Ghost", artist: "Sasha Alex Sloan", comment: "手机铃声，低沉、悲伤", searchKeywords: "" },
    { name: "All Falls Down", artist: "Alan Walker", comment: "电音", searchKeywords: "" },
    { name: "Rhythm Of The Rain", artist: "Jason Donovan", comment: "看似欢快实则深沉的情歌，初中严选", searchKeywords: "" },
    { name: "Pop! Goes the Weasel", artist: "", comment: "吓哭了，曾哥最严厉的父亲", searchKeywords: "" },
    { name: "We Are One", artist: "Jennifer Lopez", comment: "2014 World Cup", searchKeywords: "" },
    { name: "Shed a Light", artist: "Robin Schulz", comment: "原神启动の小曲", searchKeywords: "" },
    { name: "Nevada", artist: "Vicetone", comment: "电音神作", searchKeywords: "" },
    { name: "Novera", artist: "Daniel Yount", comment: "空中浩劫の小曲，22卡塔尔世界杯の小曲", searchKeywords: "" },
    { name: "Temple", artist: "Zerky、Liu", comment: "麦克阿瑟の小曲", searchKeywords: "" },
    { name: "Fade", artist: "Alan Walker", comment: "电音", searchKeywords: "" },
    { name: "Free Loop", artist: "Daniel Powter", comment: "治愈中带着希望", searchKeywords: "" },
    { name: "Bing Bing Bing", artist: "", comment: "高中跑操音乐，我鞋带开了(bushi", searchKeywords: "" },
    { name: "Stronger (What Doesn't Kill You)", artist: "Kelly Clarkson", comment: "燃，激昂", searchKeywords: "" },
    { name: "Natural", artist: "Imagine Dragons", comment: "That's the price you pay~Leave behind your heartache cast away~", searchKeywords: "" },
    { name: "Timber", artist: "CDM Project、Lee Oskar", comment: "欧美金曲", searchKeywords: "" },
    { name: "Colors Of The Wind (End Title)", artist: "Vanessa Williams", comment: "电影《风中奇缘》主题曲，初中严选", searchKeywords: "" },
    { name: "A Special Kind of Hero", artist: "Stephanie Lawrence", comment: "1986 World Cup", searchKeywords: "" },
    { name: "Sold Out", artist: "Hawk Nelson", comment: "进球の小曲", searchKeywords: "" },
    { name: "Children of the Dark", artist: "MONO INC.", comment: "运动の小曲", searchKeywords: "" },
    { name: "Wake", artist: "Hillsong Young & Free", comment: "自律の小曲", searchKeywords: "" },
    { name: "We Will Rock You", artist: "Queen", comment: "强劲的节奏感，1994 World Cup", searchKeywords: "" },
    { name: "Jar Of Love (Album Version)", artist: "曲婉婷", comment: "What you want isn't what you have~what you have may not be~be yours~your dream", searchKeywords: "" },
    { name: "Take Me Hand", artist: "Dido", comment: "天使般的嗓音", searchKeywords: "" },
    { name: "너의곁으로 (陪在你身边)", artist: "曹诚模", comment: "幼时记忆", searchKeywords: "" },
    { name: "Je M'appelle Hélène (我的名字叫伊莲)", artist: "Helene Rolles", comment: "经典法语歌，幼时记忆，音乐会精选", searchKeywords: "" },
    { name: "Zombies on Your Lawn", artist: "Laura Shigihara", comment: "PVZ一代通关曲", searchKeywords: "" },
    { name: "only my railgun", artist: "fripSide", comment: "超电磁炮OP", searchKeywords: "" },
    { name: "Floating Shelter", artist: "PinocchioP、初音未来", comment: "I wanna be the MC隐藏关配乐，初音神曲", searchKeywords: "" },
    { name: "LEVEL5 - Judgelight", artist: "水缘无忆", comment: "超电磁炮OP", searchKeywords: "" },
    { name: "It's a small world", artist: "Sherman 兄弟", comment: "洒水车BGM，幼时记忆", searchKeywords: "" },
]

const songs_instrumental = [
    { name: "The Trial of the Bow / Vengeance", artist: "Ludwig Göransson", comment: "开杀！", searchKeywords: "电影 奥德赛" },
    { name: "Yumeji's Theme", artist: "梅林茂", comment: "电影《花样年华》插曲", searchKeywords: "" },
    { name: "名探侦コナンメインテーマ", artist: "菅野祐悟", comment: "电影《100万ドルの五稜星》主题曲", searchKeywords: "" },
    { name: "ツナ覚醒 (阿纲觉醒)", artist: "佐橋俊彦", comment: "军事の小曲，动漫《家庭教师》的配乐，激昂", searchKeywords: "" },
    { name: "Mountain stream", artist: "Bandari", comment: "舒心，平静", searchKeywords: "" },
    { name: "Arms Dealer", artist: "Pokecale", comment: "车祸警示录第三阶段BGM", searchKeywords: "" },
    { name: "Sunburst", artist: "Tobu、Itro", comment: "充满阳光，充满希望", searchKeywords: "" },
    { name: "平沙落雁", artist: "丝路萧埙音乐天地", comment: "音乐线上智慧树精选", searchKeywords: "" },
    { name: "The First Snowflakes (初雪)", artist: "Bandari", comment: "宁静，高中听力御用BGM", searchKeywords: "" },
    { name: "Neptune Illusion", artist: "Dennis Kuo", comment: "qoqoqo origin精选", searchKeywords: "" },
    { name: "比利蒂斯", artist: "", comment: "幼时记忆", searchKeywords: "" },
    { name: "Kiss The Rain", artist: "纯音乐", comment: "赶暑假生活の小曲", searchKeywords: "" },
    { name: "Choose Your Seeds (In-Game)", artist: "Laura Shigihara", comment: "PVZ选卡音乐", searchKeywords: "" },
    { name: "阳光海岸", artist: "Bandari", comment: "下机の小曲", searchKeywords: "" },
    { name: "Croatian Rhapsody", artist: "Maksim", comment: "克罗地亚狂想曲，幼时记忆", searchKeywords: "" },
    { name: "旅人~第1章~", artist: "SM", comment: "qoqoqo origin精选", searchKeywords: "" },
    { name: "迷雾森林", artist: "Bandari", comment: "Bandari音乐小合集", searchKeywords: "" },
    { name: "Matrimonio De Amor", artist: "Richard Clayderman", comment: "梦中的婚礼，幼时记忆，音乐会精选", searchKeywords: "" },
    { name: "Journey", artist: "Capo Productions", comment: "qoqoqo origin精选", searchKeywords: "" },
    { name: "TVエンディングテーマ", artist: "吉田潔", comment: "qoqoqo origin精选", searchKeywords: "" },
    { name: "Victory", artist: "纯音乐", comment: "进球の小曲", searchKeywords: "" },
    { name: "Caribbean Blue", artist: "Bandari", comment: "迷雾森林里让人印象最深刻的一段", searchKeywords: "" },
    { name: "Dreams", artist: "14", comment: "qoqoqo origin御用", searchKeywords: "" },
    { name: "Largo", artist: "Camerata Cassovia", comment: "初中某区一模听力前奏", searchKeywords: "" },
    { name: "心里的爱", artist: "小兔子", comment: "空中课堂前奏，一段尘封的往事", searchKeywords: "" },
    { name: "The magnificent seven", artist: "Elmer Bernstein", comment: "颁奖の小曲", searchKeywords: "" },
    { name: "The Sounds Of Silence", artist: "Bandari", comment: "Bandari纯音乐版本，带着一种独特的平静感", searchKeywords: "" },
    { name: "我们别时和见时不同", artist: "纯音乐", comment: "Chole严选", searchKeywords: "" },
    { name: "Horizon", artist: "Janji", comment: "进球の小曲", searchKeywords: "" },
    { name: "High Brow Low Down", artist: "Deep East Music", comment: "www.datongbei.com介绍视频配音", searchKeywords: "" },
    { name: "Tabata Wod", artist: "Tabata Songs", comment: "空中课堂体育课锻炼配乐", searchKeywords: "" },
    { name: "开心茶馆", artist: "曾志豪", comment: "《弈棋耍大牌》配乐", searchKeywords: "" },
    { name: "Illusionary Daytime", artist: "Shirfine", comment: "悲伤の小曲，不知道有多少人还记得胡鑫宇", searchKeywords: "" },
    { name: "爱琴海的珍珠", artist: "Paul Mauriat", comment: "幼时记忆", searchKeywords: "" },
    { name: "心动讯息", artist: "BLACKDD", comment: "Chole严选", searchKeywords: "" },
    { name: "欢乐斗地主", artist: "纯音乐", comment: "《欢乐斗地主》配乐", searchKeywords: "" },
    { name: "Time Back (时光倒流)", artist: "Bad Style", comment: "悬疑小曲，熊猫人动漫常用BGM", searchKeywords: "" },
    { name: "Xenogenesis", artist: "TheFatRat", comment: "国象の神之一手", searchKeywords: "" },
    { name: "我在時間尽头等你", artist: "纯音乐", comment: "Chole严选", searchKeywords: "" },
    { name: "回家 (萨克斯)", artist: "纯音乐", comment: "常见于放学场景", searchKeywords: "" },
    { name: "所念皆星河", artist: "纯音乐", comment: "Chole严选", searchKeywords: "" },
    { name: "Music Box Dancer (音乐盒舞者)", artist: "Richard Clayderman", comment: "经典下课铃/考试御用BGM", searchKeywords: "" },
    { name: "地铁跑酷_希腊", artist: "纯音乐", comment: "2023.7《地铁跑酷》BGM", searchKeywords: "" },
    { name: "昼下がりの天使たち (午後の天使たち)", artist: "大野克夫", comment: "欢快の柯南开场小曲", searchKeywords: "" },
    { name: "愉快 轻松 放松", artist: "Lance、纯音乐", comment: "小王不菜呀的御用BGM", searchKeywords: "" },
    { name: "彩云追月", artist: "纯音乐", comment: "《星期音乐会》开场经典曲目", searchKeywords: "" },
    { name: "WAKE UP", artist: "高梨康治", comment: "安徽卫视《男生女生向前冲》主题曲", searchKeywords: "" },
    { name: "Annie's Wonderland (安妮的仙境)", artist: "Bandari", comment: "东航下机の小曲，听力の小曲", searchKeywords: "" },
    { name: "River Flows In You (你的心河)", artist: "Yiruma", comment: "平静，悠长", searchKeywords: "" },
    { name: "推理 (不気味ヴァージョン)", artist: "大野克夫", comment: "破案关键の小曲", searchKeywords: "" },
    { name: "名探偵コナンメインテーマ", artist: "大野克夫", comment: "真相大白の小曲，名侦探柯南主题曲", searchKeywords: "" },
    { name: "鳥の詩 (纯音乐)", artist: "初音未来", comment: "《AIR》主题曲", searchKeywords: "" },
    { name: "attraction", artist: "小澤正澄", comment: "进球の小曲", searchKeywords: "" },
    { name: "Unity", artist: "TheFatRat", comment: "进球の小曲", searchKeywords: "" },
    { name: "Victory", artist: "纯音乐", comment: "进球の小曲", searchKeywords: "" },
    { name: "Star Sky (Instrumental)", artist: "Two Steps From Hell", comment: "进球の小曲", searchKeywords: "" },
    { name: "Witch Parade Assassin", artist: "Ugress", comment: "鳌太线の小曲", searchKeywords: "" },
    { name: "Monody (Phantom version)", artist: "Buy a dreamer、TheFatRat", comment: "进球の小曲", searchKeywords: "" },
    { name: "Horizon (地平线)", artist: "Janji", comment: "进球の小曲", searchKeywords: "" },
    { name: "运动员进行曲", artist: "", comment: "运动会、升旗仪式经典入场音乐", searchKeywords: "" },
    { name: "III. ALLA turca.Allegretto", artist: "内田光子", comment: "上课铃", searchKeywords: "" },
    { name: "Graze the Roof (In-Game)", artist: "Laura Shigihara", comment: "PVZ屋顶", searchKeywords: "" },
    { name: "Funky Stars", artist: "Quazar", comment: "PVZ修改器の小曲", searchKeywords: "" },
    { name: "Rigor Mormist (In-Game)", artist: "Laura Shigihara", comment: "PVZ迷雾", searchKeywords: "" },
    { name: "Crazy Dave (In-Game)", artist: "Laura Shigihara", comment: "PVZ屋顶", searchKeywords: "" },
    { name: "Cerebrawl (In-Game)", artist: "Laura Shigihara", comment: "PVZ砸罐子", searchKeywords: "" },
    { name: "Moongrains (In-Game)", artist: "Laura Shigihara", comment: "PVZ黑夜", searchKeywords: "" },
    { name: "Watery Graves (Fast Version)", artist: "Laura Shigihara", comment: "PVZ泳池PE", searchKeywords: "" },
    { name: "Watery Graves (slow)", artist: "Laura Shigihara", comment: "PVZ泳池", searchKeywords: "" },
    { name: "Brainiac Maniac (In-Game)", artist: "Laura Shigihara", comment: "PVZ僵王", searchKeywords: "" },
    { name: "Zen Garden (In-Game)", artist: "Laura Shigihara", comment: "PVZ禅境花园", searchKeywords: "" },
    { name: "Ultimate Battle (In-Game)", artist: "Laura Shigihara", comment: "PVZ排山倒海", searchKeywords: "" },
    { name: "Grasswalk (In-Game)", artist: "Laura Shigihara", comment: "PVZ白天", searchKeywords: "" },
    { name: "Loonboon (In-Game)", artist: "Laura Shigihara", comment: "PVZ保龄球", searchKeywords: "" },
    { name: "官方配乐", artist: "PVZ2", comment: "B站官方号有各个世界的音乐全收录", searchKeywords: "" },
    { name: "Classic Energy", artist: "Curtis Schwartz", comment: "电视节目《案件聚焦》片头曲", searchKeywords: "" },
    { name: "Leap News Neutral", artist: "Guillaume de La Chapelle", comment: "电视节目《新闻夜线》内容提要曲", searchKeywords: "" },
    { name: "Transit News Neutral", artist: "Various Artists", comment: "电视节目《新闻坊》片尾曲", searchKeywords: "" },
    { name: "Monument", artist: "Various Artists", comment: "电视节目《上海早晨》内容提要曲", searchKeywords: "" },
    { name: "Breaking Boundaries", artist: "Various Artists", comment: "电视节目《新闻坊》片头曲", searchKeywords: "" },
    { name: "Topsy Turvy", artist: "De Wolfe", comment: "电视节目《上海早晨》ED", searchKeywords: "" },
    { name: "媒体大搜索历年片头", artist: "", comment: "电视节目《媒体大搜索》历年片头", searchKeywords: "" },
    { name: "The Reporter", artist: "", comment: "电视节目《新闻坊》内容提要曲", searchKeywords: "" },
    { name: "Headlines Now Theme", artist: "", comment: "电视节目《观众中来》片头曲", searchKeywords: "" },
    { name: "夜的钢琴曲5", artist: "石进", comment: "高中熄灯号", searchKeywords: "" },
    { name: "部队起床号", artist: "纯音乐", comment: "请输入文本，高中起床号", searchKeywords: "" },
    { name: "上课铃", artist: "未知歌手", comment: "高中上课铃", searchKeywords: "" },
    { name: "埃德尔斯坦国家公园", artist: "原声带", comment: "冒险岛经典配乐", searchKeywords: "" },
    { name: "Apple Woods", artist: "Arata Iiyoshi", comment: "宝可梦配乐", searchKeywords: "" },
    { name: "Barren Valley", artist: "Arata Iiyoshi", comment: "宝可梦配乐", searchKeywords: "" },
    { name: "Aegis Cave", artist: "Arata Iiyoshi", comment: "宝可梦配乐", searchKeywords: "" },
    { name: "Brine Cave", artist: "Arata Iiyoshi", comment: "宝可梦配乐", searchKeywords: "" },
    { name: "Monster House!", artist: "Arata Iiyoshi", comment: "宝可梦配乐", searchKeywords: "" },
    { name: "Blizzard Island Rescue Team Medley", artist: "Arata Iiyoshi", comment: "宝可梦配乐", searchKeywords: "" },
    { name: "Vast Ice Mountain Peak", artist: "Arata Iiyoshi", comment: "宝可梦配乐", searchKeywords: "" },
    { name: "Pokemon Exploration Team", artist: "Arata Iiyoshi", comment: "宝可梦配乐", searchKeywords: "" },
    { name: "And I Begin To Wonder", artist: "風のクロノアシリーズ", comment: "风之克罗诺亚配乐", searchKeywords: "" },
    { name: "Mine Of Lights", artist: "風のクロノアシリーズ", comment: "风之克罗诺亚配乐", searchKeywords: "" },
    { name: "Pirate Lagoon", artist: "david wise", comment: "大金刚赛车配乐", searchKeywords: "" },
    { name: "Rainbow Resort", artist: "Arcade Player", comment: "星之卡比配乐", searchKeywords: "" },
    { name: "Home Sweet Grave", artist: "石渡太輔", comment: "I wannaの小曲，本家I wanna be the guy的经典BGM", searchKeywords: "" },
    { name: "スペクタクルスペース", artist: "", comment: "星之卡比配乐", searchKeywords: "" },
    { name: "Baladium's Drive", artist: "風のクロノアシリーズ", comment: "风之克罗诺亚配乐", searchKeywords: "" },
    { name: "ドロシア ソウル", artist: "", comment: "星之卡比配乐", searchKeywords: "" },
    { name: "銀河にねがいを", artist: "石川淳", comment: "星之卡比配乐", searchKeywords: "" },
    { name: "The Closing Encounter I", artist: "風のクロノアシリーズ", comment: "风之克罗诺亚配乐", searchKeywords: "" },
    { name: "飛行砲台カブーラー", artist: "安藤浩和", comment: "星之卡比配乐", searchKeywords: "" },
    { name: "Donkey Kong Country 2", artist: "BKNAPP", comment: "CANSX配乐，超级大金刚2配乐，有种打击乐器感", searchKeywords: "" },
    { name: "神的黄昏", artist: "PinkBeen", comment: "冒险岛配乐", searchKeywords: "" },
    { name: "ミラクルマター", artist: "いしかわ じゅん", comment: "星之卡比配乐", searchKeywords: "" },
    { name: "Fluffing a Duck", artist: "Kevin MacLeod", comment: "Spike Flying配乐", searchKeywords: "" },
    { name: "8bit Faith", artist: "eS=S", comment: "东方配乐", searchKeywords: "" },
    { name: "The Moon (Duck Tales OST)", artist: "Yoshihiro Sakaguchi", comment: "DuckTales配乐", searchKeywords: "" },
    { name: "Black Apple", artist: "AQUAELIE", comment: "东方配乐", searchKeywords: "" },
    { name: "パティのテーマ", artist: "神前暁", comment: "幸运星配乐", searchKeywords: "" },
    { name: "Dr.WILY STAGE 1", artist: "纯音乐", comment: "洛克人配乐", searchKeywords: "" },
    { name: "Bad Apple!!", artist: "上海アリス幻樂団", comment: "东方幻想乡配乐", searchKeywords: "" },
    { name: "林中之城", artist: "StudioEIM", comment: "冒险岛配乐", searchKeywords: "" },
    { name: "空島", artist: "Nintendo Sound Team", comment: "超级马里奥银河2配乐", searchKeywords: "" },
    { name: "Luv Letter (情书)", artist: "DJ OKAWARI", comment: "节奏大师の小曲", searchKeywords: "" },
    { name: "Might Is Right But Tight", artist: "石渡太輔", comment: "I wanna系列Gameover时的配乐", searchKeywords: "" },
    { name: "Dreaming", artist: "Kozoro", comment: "电音，有节奏感", searchKeywords: "" },
    { name: "D小调托卡塔与赋格", artist: "巴赫", comment: "音乐会精选", searchKeywords: "" },
    { name: "地上BGM", artist: "近藤浩治", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "皇家萌卫", artist: "灵空GTTech", comment: "B站搞笑视频精选，空中课堂御用", searchKeywords: "" },
    { name: "致爱丽丝", artist: "贝多芬", comment: "听力御用，音乐会精选，经典曲目", searchKeywords: "" },
    { name: "欢乐颂 第九交响曲", artist: "贝多芬", comment: "音乐会精选，经典曲目", searchKeywords: "" },
    { name: "让爱永在旅途 (Flying With Love)", artist: "国航", comment: "国航BGM", searchKeywords: "" },
    { name: "晴天（纯音乐）", artist: "周杰伦", comment: "吉航BGM", searchKeywords: "" },
]

const songs_other = [
    { name: "The King", artist: "Paperman", comment: "最终决战の小曲", searchKeywords: "" },
    { name: "Never Gonna Give You Up", artist: "Rick Astley", comment: "你被骗了", searchKeywords: "" },
    { name: "你看到的我（DJ版）", artist: "黄勇、任书怀", comment: "大哥の小曲", searchKeywords: "" },
    { name: "See you again", artist: "Wiz Khalifa、Charlie Puth", comment: "科比の小曲", searchKeywords: "" },
    { name: "Guitar Battle vs Tom Morello", artist: "Tom Morello", comment: "电摇嘲讽の小曲", searchKeywords: "" },
    { name: "爱河 (DJ版)", artist: "蒋雪儿", comment: "影流之主の小曲", searchKeywords: "" },
    { name: "Halloween", artist: "Amc Orchestra", comment: "紧张の小曲", searchKeywords: "" },
    { name: "for ya", artist: "蒋小呢", comment: "极限国度の小曲", searchKeywords: "" },
    { name: "雪 Distance", artist: "Capper、罗言RollFlash", comment: "耸肩の小曲，高中学农回忆", searchKeywords: "" },
    { name: "Groovin' King", artist: "Taqumi", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "我的滑板鞋", artist: "约瑟翰 庞麦郎", comment: "摩擦~摩擦~在这光滑的地上摩擦~重庆合川回忆", searchKeywords: "" },
    { name: "以下范上", artist: "C-BLOCK", comment: "懂你意思，西班牙巴塞罗那回忆", searchKeywords: "" },
    { name: "Buttercup", artist: "Jack Stauber", comment: "B站搞笑视频精选，抱枕组准备", searchKeywords: "" },
    { name: "Lemon", artist: "米津玄师", comment: "那一天的忧郁~忧郁起来", searchKeywords: "" },
    { name: "春庭雪 (0.9x版DJ Wave版)", artist: "邓寓君(等什么君)", comment: "抖音神曲", searchKeywords: "" },
    { name: "Goyang Ubur Ubur", artist: "Tik Tok Top Music", comment: "印尼宽带の小曲", searchKeywords: "" },
    { name: "Ngana Rindu?", artist: "DJ Lucu、Adit Sparky", comment: "零元购の小曲", searchKeywords: "" },
    { name: "Fade Away (Deaf Kev Remix)", artist: "Jacob Tillberg", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "念诗之王", artist: "小可儿", comment: "B站入站必刷，赵本山春晚鬼畜精选", searchKeywords: "" },
    { name: "Dream Land Days", artist: "Kirby's Dream Band", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "The Happy Troll", artist: "D1ofAquavibe", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "The Party Troll", artist: "D1ofAquavibe", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "Funkytown", artist: "Lipps Inc.", comment: "旋转の小曲", searchKeywords: "" },
    { name: "Funk Caravan", artist: "Mango Audio", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "神经病之歌", artist: "小胡仙儿", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "狂妄之呎", artist: "鬼畜", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "Monkeys Spinning Monkeys", artist: "Kevin MacLeod", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "糖分とらねえとなぁー", artist: "Audio Highs", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "For the Damaged Coda", artist: "Blonde Redhead", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "おふざけモード", artist: "增田俊郎", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "宝贝宝贝（DJ版）", artist: "", comment: "两只老虎爱跳舞", searchKeywords: "" },
    { name: "変態乳牛", artist: "Tom-H@ck", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "Krusty Krab", artist: "Eugene The Dream", comment: "B站搞笑视频精选，动画片《海绵宝宝》配乐", searchKeywords: "" },
    { name: "Beethoven Virus (贝多芬病毒)", artist: "Diana Boncheva", comment: "B站搞笑视频精选，由贝多芬《第五交响曲》改编而来", searchKeywords: "" },
    { name: "Only You (Maxi)", artist: "Rappers Against Racism", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "sans.", artist: "Toby Fox", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "Imperial March", artist: "Kuricorder Quartet", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "Careless Whisper", artist: "George Michael", comment: "暧昧の小曲，B站搞笑视频精选", searchKeywords: "" },
    { name: "ファンファンファンだよ、らき☆すた", artist: "神前暁", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "听我说谢谢你", artist: "李昕融", comment: "听我说谢谢你~因为有你~温暖了四季，疫情时期精选", searchKeywords: "" },
    { name: "Galaxy", artist: "ANANYA NABILA", comment: "顿悟の小曲", searchKeywords: "" },
    { name: "Void-Hongzhe_Cui", artist: "", comment: "营销号御用", searchKeywords: "" },
    { name: "幼女幻奏", artist: "Sing, R. Sing!", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "Pink Panther Theme (Remaster)", artist: "Henry Mancini", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "The Next Episode (原版伴奏)", artist: "Dr. Dre、Kurupt、Nate Dogg", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "Monkeybiz", artist: "D1ofAquavibe", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "Barroom Ballet (酒吧间芭蕾舞团)", artist: "Kevin MacLeod", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "小心な侵入者 (胆小的入侵者)", artist: "根岸贵幸", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "馬鹿ふたり", artist: "折戸伸治", comment: "动漫《赛马娘》配乐，《赛马娘》为哈基米重要起源，B站搞笑视频精选", searchKeywords: "" },
    { name: "Time to Pretend", artist: "Lazer Boomerang", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "恨爱交加", artist: "麦振鸿", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "The X-Files", artist: "The TV Theme Players", comment: "《X档案》主题曲，悬疑の小曲，B站搞笑视频精选", searchKeywords: "" },
    { name: "Blue Sky Athletics", artist: "横田真人", comment: "B站搞笑视频精选，《超级马里奥3》配乐", searchKeywords: "" },
    { name: "温泉わくわくしんちゃん", artist: "浜口史郎", comment: "B站搞笑视频精选，动画片《蜡笔小新》主题曲", searchKeywords: "" },
    { name: "Happy Tree Friends", artist: "Tek", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "Neon Rainbow", artist: "Rameses B、Anna Yvette", comment: "地铁跑酷金避达人の小曲", searchKeywords: "" },
    { name: "Touche, Pussy Cat!", artist: "Scott Bradley", comment: "B站搞笑视频精选，动画片《猫和老鼠》主题曲", searchKeywords: "" },
    { name: "何かがおかしい", artist: "神前暁", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "ドラえもん~!", artist: "菊池俊辅", comment: "B站搞笑视频精选，动画片《哆啦A梦》主题曲", searchKeywords: "" },
    { name: "Title Theme", artist: "", comment: "《愤怒的小鸟》主题曲，B站搞笑视频精选", searchKeywords: "" },
    { name: "新宝岛", artist: "sakanaction鱼韵乐队", comment: "B站入站必刷，舞动鬼畜精选", searchKeywords: "" },
    { name: "骨折り損", artist: "神前晓", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "恋愛サーキュレーション", artist: "花泽香菜", comment: "B站搞笑视频精选，动漫《恋爱循环》OP", searchKeywords: "" },
    { name: "Okamochi & Jersey", artist: "佐藤直纪", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "迈阿密游记", artist: "虞海游Shadow、黑瘦鱼头菌", comment: "蒸汽云宫巡音", searchKeywords: "" },
    { name: "Kak вы (Explicit)", artist: "МиДо", comment: "B站搞笑视频精选，Oh no~Oh no~Oh no no no no no~", searchKeywords: "" },
    { name: "只因你太美", artist: "SWIN-S", comment: "坤坤，传奇老梗", searchKeywords: "" },
    { name: "爱如火", artist: "爱你娜", comment: "短视频御用", searchKeywords: "" },
    { name: "Bygone Bumps", artist: "Deep East Music", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "Micmacs à la gare", artist: "Raphaël Beau", comment: "B站搞笑视频精选", searchKeywords: "" },
    { name: "At The Edge", artist: "千坂", comment: "营销号御用", searchKeywords: "" },
    { name: "Intro", artist: "The xx", comment: "营销号御用，图寻の小曲", searchKeywords: "" },
    { name: "A Little Story (小故事)", artist: "Valentin", comment: "营销号御用", searchKeywords: "" },
    { name: "Sakura Tears", artist: "Snigellin", comment: "营销号御用，樱花泪", searchKeywords: "" },
    { name: "Refrain", artist: "阿南亮子", comment: "营销号御用", searchKeywords: "" },
    { name: "Caravan", artist: "a_hisa", comment: "奥德彪の小曲，营销号御用", searchKeywords: "" },
    { name: "You", artist: "Approaching Nirvana", comment: "营销号御用", searchKeywords: "" },
    { name: "Ngau Hung (MonBet Remix)", artist: "Hoaprox、MonBet", comment: "营销号御用，踩点这一块", searchKeywords: "" },
    { name: "Tassel (流苏)", artist: "Cymophane", comment: "营销号御用", searchKeywords: "" },
    { name: "Despair (绝望)", artist: "SeVen.13", comment: "营销号御用，歌名叫绝望但是绝望中也带着希望", searchKeywords: "" },
    { name: "Solstice", artist: "K-391", comment: "营销号御用，生活小妙招の小曲，电音", searchKeywords: "" },
    { name: "SummerTime", artist: "K-391", comment: "魔性电音，Fade的灵感来源，中国人能飞采样の小曲", searchKeywords: "" },
    { name: "Spring In My Step", artist: "", comment: "营销号御用，生活小妙招の小曲", searchKeywords: "" },
    { name: "Here We Are Again", artist: "Cagnet", comment: "营销号御用，电影《喜剧之王》插曲", searchKeywords: "" },
    { name: "A Thousand Miles", artist: "Josh Vietti", comment: "营销号御用", searchKeywords: "" },
    { name: "Old Threads", artist: "Dec", comment: "营销号御用", searchKeywords: "" },
    { name: "The Right Path", artist: "Thomas Greenberg", comment: "生活常识の小曲，营销号御用", searchKeywords: "" },
    { name: "La Vie Ne Ment Pas", artist: "Nick Shatrishvili", comment: "悲壮の小曲，营销号御用", searchKeywords: "" },
    { name: "Asphyxia (Piano Ver.)", artist: "逆时针向、NSZX", comment: "营销号御用", searchKeywords: "" },
    { name: "Trip (Original Mix)", artist: "Axero", comment: "古早级营销号御用BGM", searchKeywords: "" },
    { name: "热爱105°C的你", artist: "阿肆", comment: "super idol的笑容~都没你的甜~", searchKeywords: "" },
    { name: "我会自己上厕所", artist: "宝宝巴士", comment: "请输入文本", searchKeywords: "" },
    { name: "Orgia (Martin Hansen Mix)(变速版)", artist: "Ottomix、Yano", comment: "磊哥の小曲", searchKeywords: "" },
    { name: "一笑江湖", artist: "闻人听书", comment: "科目三原速曲，原速还是挺古风的", searchKeywords: "" },
    { name: "蜜雪冰城主题曲", artist: "蜜雪冰城", comment: "你爱我~我爱你~蜜雪冰城甜蜜蜜", searchKeywords: "" },
    { name: "快乐的答案", artist: "奶龙", comment: "浦江郊野公园奶龙主题BGM", searchKeywords: "" },
    { name: "念张师", artist: "AI", comment: "张雪峰老师~我还记得你~，中国版See you again", searchKeywords: "" },
    { name: "中国人能飞", artist: "Chalky Wong、揽佬SKAI ISYOURGOD", comment: "SummerTime再焕新春这一块，中国人能飞~黄皮肤才对~讲中文才飞~中国就是美", searchKeywords: "" },
]

const categories = [
    { id: 'mandarin', label: '国语歌单', icon: 'fas fa-headphones', data: songs_mandarin },
    { id: 'cantonese', label: '粤语歌曲', icon: 'fas fa-compact-disc', data: songs_cantonese },
    { id: 'foreign', label: '外语歌曲', icon: 'fas fa-globe', data: songs_foreign },
    { id: 'instrumental', label: '纯音乐', icon: 'fas fa-guitar', data: songs_instrumental },
    { id: 'other', label: '其他', icon: 'fas fa-record-vinyl', data: songs_other },
]

const allSongs = categories.flatMap(cat =>
    cat.data.map((song, idx) => ({ ...song, category: cat.id, index: idx }))
)

function buildUrl(base, query, suffix) {
    return base + encodeURIComponent(query) + (suffix || '')
}

function SongItem({ song, index, category }) {
    const id = `song-${category}-${index}`
    const query = song.name + ' ' + song.artist
    const bilibili = buildUrl('https://search.bilibili.com/all?keyword=', query)
    const netease = buildUrl('https://music.163.com/#/search/m/?s=', query, '&type=1')
    const kugou = buildUrl('https://www.kugou.com/yy/html/search.html#searchType=song&searchKeyWord=', query)
    const qq = buildUrl('https://y.qq.com/n/ryqq/search?w=', query)

    return (
        <li className="music-item" id={id}>
            <div className="music-main">
                <div className="music-icon"><i className="fas fa-music"></i></div>
                <div className="music-info">
                    <div className="music-name">{index + 1}. {song.name}</div>
                    <div className="music-artist">{song.artist}</div>
                </div>
            </div>
            {song.comment && <div className="music-summary">{song.comment}</div>}
            <div className="music-actions">
                <a className="music-link primary" href={bilibili} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-bilibili"></i>Bilibili
                </a>
                <a
                    className="music-link"
                    style={{ borderColor: 'rgba(155, 0, 38, 0.2)', background: '#faf2f4', color: '#b03040' }}
                    href={netease}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <i className="fas fa-music"></i>网易云
                </a>
                <a
                    className="music-link"
                    style={{ borderColor: 'rgba(0, 169, 255, 0.2)', background: '#eff8ff', color: '#1070d0' }}
                    href={kugou}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <i className="fas fa-headphones"></i>酷狗
                </a>
                <a
                    className="music-link"
                    style={{ borderColor: 'rgba(30, 200, 100, 0.2)', background: '#f0fdf4', color: '#108040' }}
                    href={qq}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <i className="fas fa-music"></i>QQ
                </a>
            </div>
        </li>
    )
}

export default function Music() {
    const [searchQuery, setSearchQuery] = useState('')
    const [categoryFilters, setCategoryFilters] = useState({
        mandarin: true,
        cantonese: true,
        foreign: true,
        instrumental: true,
        other: true,
    })
    const [showAllComments, setShowAllComments] = useState(false)
    const [randomResult, setRandomResult] = useState(null)
    const resultRef = useRef(null)

    useEffect(() => {
        document.body.classList.toggle('show-all-comments', showAllComments)
        return () => document.body.classList.remove('show-all-comments')
    }, [showAllComments])

    const query = searchQuery.toLowerCase().trim()

    const filterMatches = useCallback((song) => {
        if (!query) return true
        const nameMatch = (song.name || '').toLowerCase().includes(query)
        const artistMatch = (song.artist || '').toLowerCase().includes(query)
        const commentMatch = (song.comment || '').toLowerCase().includes(query)
        const hiddenKeywords = Array.isArray(song.searchKeywords)
            ? song.searchKeywords.join(' ')
            : (song.searchKeywords || '')
        const hiddenKeywordMatch = hiddenKeywords.toLowerCase().includes(query)
        return nameMatch || artistMatch || commentMatch || hiddenKeywordMatch
    }, [query])

    const filteredCategories = categories.map(cat => ({
        ...cat,
        data: categoryFilters[cat.id] ? cat.data.filter(filterMatches) : [],
    }))

    const handleFilterChange = (categoryId) => {
        setCategoryFilters(prev => ({ ...prev, [categoryId]: !prev[categoryId] }))
    }

    const handleRandom = () => {
        const checkedIds = Object.entries(categoryFilters)
            .filter(([, checked]) => checked)
            .map(([id]) => id)

        if (checkedIds.length === 0) {
            setRandomResult(null)
            return
        }

        const pool = []
        checkedIds.forEach(catId => {
            const catData = categories.find(c => c.id === catId)?.data || []
            catData.forEach((item, idx) => {
                pool.push({ data: item, category: catId, index: idx })
            })
        })

        if (pool.length === 0) return

        const choice = pool[Math.floor(Math.random() * pool.length)]

        // Clear search if active
        if (searchQuery.trim() !== '') {
            setSearchQuery('')
        }

        setRandomResult(choice)
    }

    const handleToggleComments = (e) => {
        setShowAllComments(e.target.checked)
    }

    return (
        <div className="page-wrapper">
            <div className="page-header">
                <h1><i className="fas fa-music"></i> Music</h1>
                <p>音乐像是时空的存档点，总能让你想起生命中的一些瞬间</p>
            </div>
            <section className="section">
                <div className="container">
                    <FadeIn className="music-controls-panel">
                        <div className="music-search">
                            <i className="fas fa-search search-icon"></i>
                            <input
                                type="text"
                                className="music-search-input"
                                placeholder="搜索歌曲名称、歌手、短评..."
                                autoComplete="off"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    className="clear-btn"
                                    onClick={() => setSearchQuery('')}
                                    title="清除搜索"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            )}
                        </div>

                        <div className="music-randomizer">
                            <div className="randomizer-header">
                                <button className="btn-random" onClick={handleRandom}>
                                    <i className="fas fa-dice"></i> 随机一首
                                </button>
                                <span className="random-help" style={{ marginLeft: 'auto' }}>支持多选类别</span>
                                <label className="toggle-comments-label">
                                    <input
                                        type="checkbox"
                                        checked={showAllComments}
                                        onChange={handleToggleComments}
                                    />
                                    <span>显示所有评论</span>
                                </label>
                            </div>
                            <div className="random-filters">
                                {categories.map(cat => (
                                    <label key={cat.id}>
                                        <input
                                            type="checkbox"
                                            checked={categoryFilters[cat.id]}
                                            onChange={() => handleFilterChange(cat.id)}
                                        />
                                        <span>{cat.id === 'mandarin' ? '国语' : cat.id === 'cantonese' ? '粤语' : cat.id === 'foreign' ? '外语' : cat.id === 'instrumental' ? '纯音乐' : '其他'}</span>
                                    </label>
                                ))}
                            </div>
                            {randomResult && (
                                <div className="random-result" ref={resultRef}>
                                    <div className="random-result-info">
                                        <i className="fas fa-compact-disc fa-spin random-result-icon"></i>
                                        <div className="random-result-text">
                                            <strong>{randomResult.data.name}</strong>
                                            <span>{randomResult.data.artist}</span>
                                            {randomResult.data.comment && (
                                                <div className="random-result-comment">{randomResult.data.comment}</div>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        className="btn-jump"
                                        onClick={() => {
                                            const elemId = `song-${randomResult.category}-${randomResult.index}`
                                            const el = document.getElementById(elemId)
                                            if (el) {
                                                el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                                                el.classList.add('highlight-pulse')
                                                setTimeout(() => el.classList.remove('highlight-pulse'), 2000)
                                            }
                                        }}
                                    >
                                        <i className="fas fa-location-arrow"></i> 跳转播放
                                    </button>
                                </div>
                            )}
                        </div>
                    </FadeIn>

                    {filteredCategories.map(cat => (
                        <FadeIn key={cat.id} className="music-category">
                            <h3 className="music-category-title">
                                <i className={cat.icon}></i> {cat.label}
                            </h3>
                            <ul className="music-list">
                                {cat.data.map((song, idx) => (
                                    <SongItem
                                        key={`${cat.id}-${idx}`}
                                        song={song}
                                        index={idx}
                                        category={cat.id}
                                    />
                                ))}
                            </ul>
                            <p className="music-summary-count">共 {cat.data.length} 首。</p>
                        </FadeIn>
                    ))}
                </div>
            </section>
        </div>
    )
}
