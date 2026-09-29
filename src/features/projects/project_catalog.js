export const projects = [
  {
    "slug": "transit-navigator",
    "name": "数据结构课程设计",
    "desc": "数据结构课设 · C++、Dijkstra 与 EasyX",
    "repo": "Data_Structure_Curriculum_Design",
    "subject": "公共交通路线规划",
    "summary": "C++ 编写，使用 Dijkstra 算法计算路线，EasyX 实现图形界面。"
  },
  {
    "slug": "mips-cpu",
    "name": "MIPS 54 条指令 CPU",
    "desc": "计算机组成原理课设 · Verilog",
    "repo": "Computer_Organization_and_Architecture_Course_Design",
    "subject": "计算机组成原理课程设计",
    "summary": "Verilog 实现的 MIPS 54 条指令 CPU。"
  },
  {
    "slug": "cryptography",
    "name": "密码学课程设计",
    "desc": "C++ · RSA、ElGamal 与 PKI",
    "repo": "crypto_course_design",
    "subject": "密码算法与安全邮件",
    "summary": "C++ 实现 RSA、ElGamal，以及证书、PKI 和安全邮件模块。"
  },
  {
    "slug": "fpga",
    "name": "OLED MP3 播放器",
    "desc": "数字逻辑大作业 · Verilog、MP3 与 OLED"
  },
  {
    "slug": "cpp-bighw",
    "name": "C++ BigHW",
    "desc": "C++ 大作业 · 汉诺塔、数织、图像与文本工具"
  },
  {
    "slug": "gembridge-analyzer",
    "name": "桥牌赛事分析工具",
    "desc": "Node.js · CCBA / GemBridge 公开成绩分析",
    "repo": "gembridge-analyzer",
    "subject": "CCBA / GemBridge 赛事分析",
    "summary": "读取公开比赛成绩，用于单副牌复盘、队伍与牌手分析，支持导出 JSON 数据和 Word 报告。"
  },
  {
    "slug": "llm-bot",
    "name": "LLM 聊天机器人",
    "desc": "多平台接入"
  },
  {
    "slug": "gpu",
    "name": "GPU",
    "desc": "介数中心性学习资料"
  }
]

export const repository_projects = projects.filter((project) => project.repo)
