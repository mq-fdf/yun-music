# 云音乐 (Yun-Music)

一款基于 Vue 3 + Pinia + Sass 构建的仿网易云音乐在线播放器。支持歌单浏览、搜索、歌词同步滚动及全局播放控制。

## 🛠 技术栈

- **框架**: Vue 3 (Composition API)
- **状态管理**: Pinia
- **路由**: Vue Router
- **网络请求**: Axios
- **样式**: Sass
- **构建工具**: Vite
- **模拟数据**: Mock.js & vite-plugin-mock

## 📁 目录结构

```text
yun-music/
├── mock/                 # Vite-plugin-mock 配置，用于开发环境接口模拟
├── src/
│   ├── api/              # 接口封装与 Mock 数据返回逻辑
│   ├── components/       # 全局公共组件 (播放器、歌词、歌单列表等)
│   ├── layouts/          # 布局组件
│   ├── router/           # 路由配置
│   ├── stores/           # Pinia 状态管理 (播放状态、用户信息)
│   ├── utils/            # 工具函数及静态 Mock 数据源
│   ├── views/            # 页面组件 (首页、搜索、歌单、详情)
│   └── App.vue           # 根组件
└── vite.config.js        # Vite 配置文件 (含路径别名与 Mock 插件配置)
```

## 🔄 Mock 数据与请求机制

本项目采用了一套完善的 **Mock 模拟后端数据** 方案，确保在脱离真实后端接口的情况下，依然能实现完整的业务逻辑。

### 1. Mock 的作用
- **前后端解耦**: 在没有真实后端接口或后端开发滞后时，前端可以根据约定的数据结构自主开发。
- **独立部署**: 支持部署至 GitHub Pages 等静态托管平台，展示完整的交互功能而无需后端服务支持。
- **性能模拟**: 通过人工设置延迟时间，模拟真实的网络请求环境。

### 2. 请求流程分析
项目的请求链路如下：
1. **视图层 (View)**: 组件（如 `Home.vue`）通过生命周期钩子调用 API 函数。
2. **接口层 (API)**: 在 `src/api/` 下的模块（如 `playlist.js`）中定义异步函数。
3. **模拟返回**: API 函数不再通过 Axios 请求真实 URL，而是直接调用 `mockDelay()` 模拟网络开销，并返回 `src/utils/mockData.js` 中的预设数据。

### 3. Mock 数据的封装与返回
项目实现了两种层级的 Mock 封装：

#### A. 开发环境 (vite-plugin-mock)
在开发模式下，通过 `mock/index.js` 使用 **Mock.js** 语法动态生成大量随机数据。
- **封装方式**: 定义接口 URL、方法及响应函数。
- **返回数据**: 利用 `Mock.mock()` 自动生成包含随机图片、文字、ID 的复杂 JSON 对象。

#### B. 生产环境/部署模式 (API Fallback)
为了支持静态部署，在 `src/api/` 的接口文件中直接封装了返回逻辑：
- **数据源**: 统一维护在 `src/utils/mockData.js`。
- **逻辑封装**: 
  ```javascript
  // 以获取歌单详情为例
  export const getPlaylistDetail = async (id) => {
    await mockDelay(500); // 模拟 500ms 网络延迟
    const playlist = mockPlaylists.find(p => p.id == id) || mockPlaylists[0];
    return {
      code: 200,
      playlist: { ...playlist, tracks: mockSongs } // 组装数据并返回
    };
  };
  ```

## 🚀 快速开始

1. **安装依赖**:
   ```bash
   npm install
   ```

2. **本地开发**:
   ```bash
   npm run dev
   ```

3. **项目打包**:
   ```bash
   npm run build
   ```

## 🔗 部署信息

项目已配置 GitHub Actions 自动部署工作流。每次推送到 `main` 分支后，会自动构建并部署至 GitHub Pages。
- **Base URL**: `/yun-music/`
