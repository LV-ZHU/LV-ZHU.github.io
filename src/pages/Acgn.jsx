import { useState } from 'react'
import FadeIn from '../components/FadeIn'
import '../styles/Acgn.css'

const games = [
  { name: 'I wanna be the guy', url: 'https://delicious-fruit.com/ratings/full.php?s=I+wanna+be+the+guy', icon: 'fas fa-star', review: 'I wanna本家作，发布于2007年' },
  { name: 'I wanna run the marathon', url: 'https://delicious-fruit.com/ratings/full.php?s=I+wanna+run+the+marathon', icon: 'fas fa-star', review: '入坑作，包含马里奥、索尼克、洛克人、高尔夫、VVVVVV、心之卡比等元素' },
  { name: 'I Wanna Kill The Kamilia 3', url: 'https://delicious-fruit.com/ratings/full.php?s=I+wanna+Kill+the+Kamilia+3', icon: 'fas fa-star', review: '请输入文本，超难抄袭向，吓哭了' },
  { name: 'I Wanna Kill The Kamilia 2', url: 'https://delicious-fruit.com/ratings/full.php?s=I+wanna+Kill+the+Kamilia+3', icon: 'fas fa-star', review: '没上一个那么难，但也非常有挑战性' },
  { name: 'I wanna kokomi', url: 'https://delicious-fruit.com/ratings/full.php?s=I+wanna+kokomi', icon: 'fas fa-star', review: '心海可爱捏~内含原神元素反应' },
  { name: 'I wanna see the moon', url: 'https://delicious-fruit.com/ratings/full.php?s=I+wanna+see+the+moon', icon: 'fas fa-star', review: '绕路向代表作，内含解谜，包含陆地、森林、水、洞穴、天空、宇宙等众多场景，并且直接影响了后续一部分i wanna的风格' },
  { name: 'I wanna 完全新手教学', url: 'https://delicious-fruit.com/ratings/full.php?s=I+wanna+完全新手教学', icon: 'fas fa-star', review: '非常详细的教程向新手作，最后有一个画风"突变"的小综合关' },
  { name: 'I wanna be the Logarithmic', url: 'https://delicious-fruit.com/ratings/full.php?s=I+wanna+be+the+Logarithmic', icon: 'fas fa-star', review: '应该是玩过的百击向里面最简单的' },
  { name: 'I wanna three connect', url: 'https://delicious-fruit.com/ratings/full.php?s=I+wanna+three+connect', icon: 'fas fa-star', review: '点赞投币转发谢谢喵~' },
  { name: 'I wanna have a good wifi', url: 'https://delicious-fruit.com/ratings/full.php?s=I+wanna+have+a+good+wifi', icon: 'fas fa-star', review: '印尼宽带の无限循环' },
  { name: 'I wanna go shopping', url: 'https://delicious-fruit.com/ratings/full.php?s=I+wanna+go+shopping', icon: 'fas fa-star', review: '零元购の无限循环' },
  { name: 'I wanna conquer the blow game 1', url: 'https://delicious-fruit.com/ratings/full.php?s=I+wanna+conquer+the+blow+game+1', icon: 'fas fa-star', review: '看似新手向百击，实则最后一个boss还是略带难度的' },
  { name: 'I wanna conquer the blow game 2', url: 'https://delicious-fruit.com/ratings/full.php?s=I+wanna+conquer+the+blow+game+2', icon: 'fas fa-star', review: '百击向，最后两关和本家地图一致' },
  { name: 'I wanna conquer the blow game 3', url: 'https://delicious-fruit.com/ratings/full.php?s=I+wanna+conquer+the+blow+game+3', icon: 'fas fa-star', review: '比前两作难一点，最后boss打的时候要有耐心' },
  { name: 'I wanna bigger p**is', url: 'https://delicious-fruit.com/ratings/full.php?s=I+wanna+bigger+penis', icon: 'fas fa-star', review: '请输入文本 第二大关还真是这个主题，非常逆天，另外内含西游记主题曲' },
  { name: '3 traps in a room', url: 'https://delicious-fruit.com/ratings/full.php?s=3+traps+in+a+room', icon: 'fas fa-star', review: '一面只有3个坑，但依然让人怀疑人生' },
  { name: 'Spike flying', url: 'https://delicious-fruit.com/ratings/full.php?s=Spike+flying', icon: 'fas fa-star', review: '调和级数是一种既发散又收敛的级数.jpg' },
  { name: 'I wanna be the MC', url: 'https://delicious-fruit.com/ratings/full.php?s=I+wanna+be+the+MC', icon: 'fas fa-star', review: '算是比较新手向，注意有隐藏关' },
  { name: 'I wanna chase my dream', url: 'https://delicious-fruit.com/ratings/full.php?s=I+wanna+chase+my+dream', icon: 'fas fa-star', review: '新手向，画风很治愈' },
  { name: 'I wanna qoqoqo origin', url: 'https://delicious-fruit.com/ratings/full.php?s=I+wanna+qoqoqo+origin', icon: 'fas fa-star', review: '百击向，绕路设计的不错，我会告诉你按S可以随时保存？' },
  { name: 'I wanna use computer', url: 'https://delicious-fruit.com/ratings/full.php?s=I+wanna+use+computer', icon: 'fas fa-star', review: '非常有创意的坑向作品' },
  { name: 'I wanna play summer', url: 'https://delicious-fruit.com/ratings/full.php?s=I+wanna+play+summer', icon: 'fas fa-star', review: '2015年的比较古早的短流程作品' },
  { name: 'I wanna be the air', url: 'https://delicious-fruit.com/ratings/full.php?s=I+wanna+be+the+air', icon: 'fas fa-star', review: '融合了解谜、坑向、跳刺的作品，有部分东方角色出现' },
  { name: 'I wanna catch the warp', url: 'https://www.delicious-fruit.com/ratings/game_details.php?id=28306', icon: 'fas fa-star', review: '史诗级大综合，包含推箱子、The Exit 8、PVZ、UnderTale、扫雷、东方等元素' },
  { name: 'Do morning exercises', url: 'https://delicious-fruit.com/ratings/full.php?s=Do+morning+exercises', icon: 'fas fa-star', review: '第三套广播体操~现在开始' },
  { name: 'I wanna ʅ(´◔౪◔)ʃ', url: 'https://delicious-fruit.com/ratings/full.php?s=I+wanna+%CA%85%28%C2%B4%E2%97%94%E0%B1%AA%E2%97%94%29%CA%83', icon: 'fas fa-star', review: '散人玩过的古早微坑向I wanna' },
  { name: 'I Wanna The Maker Medley', url: 'https://delicious-fruit.com/ratings/full.php?s=I+Wanna+The+Maker+Medley', icon: 'fas fa-star', review: '简单实现自己的I wanna' },
  { name: 'I wanna be the DAREJAR', url: 'https://delicious-fruit.com/ratings/full.php?s=I+Wanna+be+the+DAREJAR', icon: 'fas fa-star', review: '可以领悟到触摸式存档的恶意有多深以及I wanna可以有多坑' },
  { name: 'Crimson Needle 2', url: 'https://delicious-fruit.com/ratings/full.php?s=Crimson+Needle+2', icon: 'fas fa-star', review: '著名高难度百击向' },
  { name: 'Crimson Needle 3', url: 'https://delicious-fruit.com/ratings/full.php?s=Crimson+Needle+3', icon: 'fas fa-star', review: '比2更难的超高难度百击向' },
  { name: 'I Wanna be the Blizzard', url: 'https://delicious-fruit.com/ratings/full.php?s=I+Wanna+be+the+Blizzard', icon: 'fas fa-star', review: '蔚蓝风格' },
  { name: 'I wanna grass', url: 'https://delicious-fruit.com/ratings/full.php?s=I+wanna+grass', icon: 'fas fa-star', review: '国人做的好玩坑向' },
  { name: 'I wanna fa trap', url: 'https://delicious-fruit.com/ratings/full.php?s=I+wanna+fa+trap', icon: 'fas fa-star', review: '坑向经典作品' },
  { name: 'Needy KID Overdose', url: 'https://delicious-fruit.com/ratings/full.php?s=Needy+KID+Overdose', icon: 'fas fa-star', review: '主播kid' },
  { name: 'I wanna be the GGM', url: 'https://delicious-fruit.com/ratings/full.php?s=I+wanna+be+the+GGM', icon: 'fas fa-star', review: '新手入门跳刺的不二之选' },
  { name: 'I wanna present an easy game with you', url: 'https://delicious-fruit.com/ratings/full.php?s=I+wanna+present+an+easy+game+with+you', icon: 'fas fa-star', review: '确实简单，注意有隐藏' },
  { name: 'I wanna be the Trapsweeper', url: 'https://delicious-fruit.com/ratings/full.php?s=I+wanna+be+the+Trapsweeper', icon: 'fas fa-star', review: '扫雷风格' },
  { name: 'I wanna Olympic', url: 'https://delicious-fruit.com/ratings/full.php?s=I+wanna+Olympic', icon: 'fas fa-star', review: '奥林匹克风格' },
  { name: 'I wanna be the knight in shining armor', url: 'https://delicious-fruit.com/ratings/full.php?s=I+wanna+be+the+knight+in+shining+armor', icon: 'fas fa-star', review: '蝉堇玩过的综合向长流程作品，有交易系统，非常耐玩' },
  { name: 'Thanks for 2014', url: 'https://delicious-fruit.com/ratings/full.php?s=Thanks+for+2014', icon: 'fas fa-calendar-alt', review: '国人作者Summer的经典贺岁向作品，每年20面，至今仍保持更新' },
  { name: 'Thanks for 2015', url: 'https://delicious-fruit.com/ratings/full.php?s=Thanks+for+2015', icon: 'fas fa-calendar-alt', review: '有时间系统' },
  { name: 'Thanks for 2016', url: 'https://delicious-fruit.com/ratings/full.php?s=Thanks+for+2016', icon: 'fas fa-calendar-alt', review: '' },
  { name: 'Thanks for 2017', url: 'https://delicious-fruit.com/ratings/full.php?s=Thanks+for+2017', icon: 'fas fa-calendar-alt', review: '' },
  { name: 'Thanks for 2018', url: 'https://delicious-fruit.com/ratings/full.php?s=Thanks+for+2018', icon: 'fas fa-calendar-alt', review: '' },
  { name: 'Thanks for 2019', url: 'https://delicious-fruit.com/ratings/full.php?s=Thanks+for+2019', icon: 'fas fa-calendar-alt', review: '' },
  { name: 'Thanks for 2020', url: 'https://delicious-fruit.com/ratings/full.php?s=Thanks+for+2020', icon: 'fas fa-calendar-alt', review: '支持多人联机' },
  { name: 'Thanks for 2021', url: 'https://delicious-fruit.com/ratings/full.php?s=Thanks+for+2021', icon: 'fas fa-calendar-alt', review: '' },
  { name: 'Thanks for 2022', url: 'https://delicious-fruit.com/ratings/full.php?s=Thanks+for+2022', icon: 'fas fa-calendar-alt', review: '' },
  { name: 'Thanks for 2023', url: 'https://delicious-fruit.com/ratings/full.php?s=Thanks+for+2023', icon: 'fas fa-calendar-alt', review: '' },
  { name: 'Thanks for 2024', url: 'https://delicious-fruit.com/ratings/full.php?s=Thanks+for+2024', icon: 'fas fa-calendar-alt', review: '' },
  { name: 'Thanks for 2025', url: 'https://delicious-fruit.com/ratings/full.php?s=Thanks+for+2025', icon: 'fas fa-calendar-alt', review: '' },
]

const anime = [
  { name: '阳光咖啡厅之新友纪', url: 'https://search.bilibili.com/all?keyword=%E9%98%B3%E5%85%89%E5%92%96%E5%95%A1%E5%8E%85%E4%B9%8B%E6%96%B0%E5%8F%8B%E7%BA%AA', icon: 'fas fa-play-circle', review: '推荐沪语版，平纪公众号出品' },
]

const novels = [
  { name: '十日终焉', url: 'https://fanqienovel.com/reader/7173216089122439711', icon: 'fas fa-bookmark', review: '番茄顶流，无需多言' },
  { name: '诡舍', url: 'https://fanqienovel.com/reader/7257740371885556224', icon: 'fas fa-bookmark', review: '品鉴时间在2024年5月份，嗯，就很难评，每天晚上看一整个血门，可以认为是看了A岛的动物园怪谈入坑这个风格的' },
  { name: '逆天邪神', url: 'https://read.zongheng.com/chapter/408586/6905692.html', icon: 'fas fa-bookmark', review: '咕咕咕鼻祖' },
]

export default function Acgn() {
  const [showAll, setShowAll] = useState(false)

  const handleToggle = () => {
    const next = !showAll
    setShowAll(next)
    document.body.classList.toggle('show-all-comments', next)
  }

  return (
    <div className="page-wrapper">
      <label className="acgn-toggle">
        <input type="checkbox" checked={showAll} onChange={handleToggle} />
        显示所有个人评价
      </label>
      <div className="page-header">
        <h1><i className="fas fa-gamepad" /> ACGN</h1>
      </div>
      <section className="section">
        <div className="container">
          <div className="acgn-section">
            <div className="acgn-header game">
              <i className="fas fa-gamepad" /> 游戏
            </div>
            <FadeIn className="media-grid">
              {games.map((item, index) => (
                <div key={index} className="media-item game">
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <i className={item.icon} />
                    <span>{item.name}</span>
                  </a>
                  {item.review && <div className="media-review">{item.review}</div>}
                </div>
              ))}
            </FadeIn>
          </div>

          <div className="acgn-section">
            <div className="acgn-header anime">
              <i className="fas fa-film" /> 动漫
            </div>
            <FadeIn className="media-grid">
              {anime.map((item, index) => (
                <div key={index} className="media-item anime">
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <i className={item.icon} />
                    <span>{item.name}</span>
                  </a>
                  {item.review && <div className="media-review">{item.review}</div>}
                </div>
              ))}
            </FadeIn>
          </div>

          <div className="acgn-section">
            <div className="acgn-header novel">
              <i className="fas fa-book" /> 小说
            </div>
            <FadeIn className="media-grid">
              {novels.map((item, index) => (
                <div key={index} className="media-item novel">
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <i className={item.icon} />
                    <span>{item.name}</span>
                  </a>
                  {item.review && <div className="media-review">{item.review}</div>}
                </div>
              ))}
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  )
}
