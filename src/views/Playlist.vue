<template>
  <div class="playlist-detail">
    <!-- 详情头部 -->
    <div class="header" v-if="detail">
      <img :src="detail.coverImgUrl" alt="cover" />
      <div class="info">
        <h1>{{ detail.name }}</h1>
        <p class="description">{{ detail.description }}</p>
        <div class="actions">
          <button class="play-all" @click="playAll">播放全部</button>
        </div>
      </div>
    </div>

    <!-- 歌曲列表 -->
    <div class="list-section">
      <h3>歌曲列表 ({{ songs.length }})</h3>
      <div class="song-list-container">
        <SongList :songs="songs" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getPlaylistDetail, getPlaylistSongs } from '@/api/playlist'
import { getSongPlayUrlBatch } from '@/api/song'
import { usePlayerStore } from '@/stores/player'
import SongList from '@/components/SongList.vue'

const route = useRoute()
const playerStore = usePlayerStore()
const detail = ref(null)
const songs = ref([])

const playAll = () => {
  if (songs.value.length > 0) {
    playerStore.playAll(songs.value)
  }
}

// 封装数据获取逻辑
const fetchData = async () => {
  const playlistId = route.params.id
  if (!playlistId) return

  try {
    // 1. 获取歌单详情
    const detailRes = await getPlaylistDetail(playlistId)
    if (detailRes && detailRes.code === 200) {
      detail.value = detailRes.data
    }

    // 2. 获取歌曲列表 (默认30条)
    const songsRes = await getPlaylistSongs(playlistId, 30)
    if (songsRes && songsRes.code === 200 && songsRes.data) {
      const songIdList = songsRes.data.map(song => song.id)
      // 批量获取歌曲播放地址
      const playUrlRes = await getSongPlayUrlBatch(songIdList)

      if (playUrlRes && playUrlRes.code === 200 && playUrlRes.data) {
        const playUrlMap = new Map()
        playUrlRes.data.forEach(item => {
          playUrlMap.set(item.id, item)
        })
        // 将播放地址合并到歌曲列表中
        songs.value = songsRes.data.map(song => {
          const playInfo = playUrlMap.get(song.id)
          return {
            ...song,
            playUrl: playInfo?.url || '',
            br: playInfo?.br || 0,
            level: playInfo?.level || ''
          }
        })
      }
    }
  } catch (error) {
    console.error('获取歌单数据失败:', error)
  }
}

onMounted(async () => {
  await fetchData()
})

// 监听路由参数变化，重新加载数据
watch(() => route.params.id, async (newId, oldId) => {
  if (newId !== oldId) {
    await fetchData()
  }
}, { immediate: true }) // immediate: true 确保组件初始化时也执行一次
</script>

<style lang="scss" scoped>
.playlist-detail {
  padding: 20px;
  display: flex;
  flex-direction: column;
  /* 60px 是 NavBar 高度，80px 是 Player 预留高度 */
  height: calc(100vh - 140px); 
  overflow: hidden; // 禁止整页滚动，由内部容器处理滚动

  .header {
    display: flex;
    gap: 30px;
    margin-bottom: 20px;
    flex-shrink: 0; // 头部不压缩
    img {
      width: 180px;
      height: 180px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      h1 { margin-bottom: 12px; font-size: 24px; color: var(--theme-text); }
      .description {
        color: var(--theme-text-secondary);
        font-size: 14px;
        line-height: 1.6;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin-bottom: 20px;
      }
      .actions {
        .play-all {
          background-color: var(--theme-primary);
          color: #fff;
          border: none;
          padding: 10px 25px;
          border-radius: 20px;
          font-size: 15px;
          cursor: pointer;
          transition: transform 0.2s;
          &:hover {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }
      }
    }
  }

  .list-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0; // 关键：允许 flex 子元素收缩并启用内部滚动
    
    h3 {
      margin-bottom: 12px;
      flex-shrink: 0;
      font-size: 18px;
    }

    .song-list-container {
      flex: 1;
      overflow-y: auto;
      border-radius: 8px;
      background: rgba(var(--theme-primary-rgb, 194, 12, 12), 0.03);
      padding-right: 4px; // 为滚动条留出空间
      
      &::-webkit-scrollbar {
        width: 6px;
      }
      &::-webkit-scrollbar-thumb {
        background: rgba(var(--theme-text-rgb, 51, 51, 51), 0.1);
        border-radius: 3px;
      }
      &:hover::-webkit-scrollbar-thumb {
        background: rgba(var(--theme-text-rgb, 51, 51, 51), 0.2);
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .playlist-detail {
    height: auto; // 移动端可以允许长滚动
    overflow: visible;
    .header {
      flex-direction: column;
      align-items: center;
      text-align: center;
      img { width: 150px; height: 150px; }
    }
    .list-section {
      height: 400px; // 移动端给列表一个固定高度
    }
  }
}
</style>
