import type { BlogPost } from "../types/post";

export const fallbackPosts: BlogPost[] = [
  {
    id: "sample-1",
    title: "如何写出更容易维护的前端组件",
    slug: "maintainable-react-components",
    excerpt: "从状态边界、命名、组合方式和测试策略四个维度整理组件设计的基本功。",
    content:
      "<p>组件的可维护性来自清晰边界。把数据获取、交互状态和展示结构拆开，能让未来的需求变化更容易落地。</p><p>命名也很重要。好的命名能把组件承担的职责说清楚，减少阅读者的猜测成本。</p>",
    topic: "工程",
    author: "陈序",
    tags: ["前端", "工程", "React"],
    coverImage:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
    coverAlt: "代码编辑器屏幕",
    status: "published",
    publishedAt: "2026-04-16T00:00:00.000Z",
    createdAt: "2026-04-16T00:00:00.000Z",
    updatedAt: "2026-04-16T00:00:00.000Z",
  },
  {
    id: "sample-2",
    title: "一个周末的城市漫游路线",
    slug: "weekend-city-walk",
    excerpt: "避开热门地标，沿着书店、咖啡馆和老街区重新理解一座城市的节奏。",
    content:
      "<p>城市漫游不需要排满清单。选一条街区，把书店、咖啡馆和菜市场串起来，通常比地标打卡更接近真实生活。</p>",
    topic: "生活",
    author: "苏禾",
    tags: ["生活", "城市", "摄影"],
    coverImage:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
    coverAlt: "街区建筑与阳光",
    status: "published",
    publishedAt: "2026-04-13T00:00:00.000Z",
    createdAt: "2026-04-13T00:00:00.000Z",
    updatedAt: "2026-04-13T00:00:00.000Z",
  },
  {
    id: "sample-3",
    title: "为什么团队需要一份清楚的决策记录",
    slug: "decision-records-for-teams",
    excerpt: "当上下文不可见，团队就会重复争论。决策记录能让协作成本稳定下降。",
    content:
      "<p>决策记录不是为了制造文档负担，而是为了保存团队判断的上下文。它回答三个问题：当时为什么这样选，放弃了什么，未来什么时候应该重新评估。</p>",
    topic: "团队",
    author: "许安",
    tags: ["管理", "团队", "文档"],
    coverImage:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
    coverAlt: "团队在白板前讨论",
    status: "published",
    publishedAt: "2026-04-10T00:00:00.000Z",
    createdAt: "2026-04-10T00:00:00.000Z",
    updatedAt: "2026-04-10T00:00:00.000Z",
  },
  {
    id: "sample-4",
    title: "阅读不是输入，而是重新组织注意力",
    slug: "reading-and-attention",
    excerpt: "从书摘到笔记，再到可引用的观点，阅读需要一条能回到真实问题的路径。",
    content:
      "<p>阅读的目标不是囤积摘录，而是把注意力重新组织到重要问题上。真正有用的笔记，应该能在需要做判断时被再次调用。</p>",
    topic: "阅读",
    author: "林墨",
    tags: ["阅读", "方法", "思考"],
    coverImage:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80",
    coverAlt: "桌面上的打开书本",
    status: "published",
    publishedAt: "2026-04-07T00:00:00.000Z",
    createdAt: "2026-04-07T00:00:00.000Z",
    updatedAt: "2026-04-07T00:00:00.000Z",
  },
];
