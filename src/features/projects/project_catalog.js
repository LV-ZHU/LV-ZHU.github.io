export const projects = [
  {
    "slug": "transit-navigator",
    "name": "数据结构课程设计",
    "desc": "数据结构课设 · C++、Dijkstra 与 EasyX",
    "repo": "Data_Structure_Curriculum_Design",
    "summary": "用图结构组织站点和线路数据，通过 Dijkstra 算法寻找路径，并使用 EasyX 实现图形界面。",
    "features": [
      "邻接表与最小堆实现",
      "站点、线路与连接关系的 CSV 数据读取",
      "路线计算与图形界面展示"
    ]
  },
  {
    "slug": "mips-cpu",
    "name": "MIPS 54 条指令 CPU",
    "desc": "计算机组成原理课设 · Verilog",
    "repo": "Computer_Organization_and_Architecture_Course_Design",
    "summary": "使用 Verilog 进行 MIPS 54 条指令 CPU 设计，记录计算机组成原理课程设计的硬件实现。",
    "features": [
      "MIPS 指令集 CPU 设计",
      "Verilog 硬件描述与工程源码"
    ]
  },
  {
    "slug": "cryptography",
    "name": "密码学课程设计",
    "desc": "C++ · RSA、ElGamal 与 PKI",
    "repo": "crypto_course_design",
    "summary": "以 C++ 实现密码算法及相关应用模块，包含 RSA、ElGamal、证书、PKI 和安全邮件。",
    "features": [
      "RSA 与 ElGamal 算法模块",
      "证书、可信机构与用户模块",
      "安全邮件与测试代码"
    ]
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
    "summary": "读取 CCBA / GemBridge 的公开比赛成绩，用于单副牌复盘、队伍与牌手分析，以及整项赛事的数据整理。",
    "features": [
      "单副牌的 DD、Par、Datum 与 xIMP 分析",
      "对抗、轮次、队伍、牌手与赛事排名查询",
      "带来源和数据质量信息的 JSON 快照，以及 Word 报告导出"
    ]
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
