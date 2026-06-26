<template>
  <div class="song-detail" v-if="playerStore.currentSong">
    <div class="bg" :style="{ backgroundImage: `url(${playerStore.currentSong.coverImgUrl || playerStore.currentSong.al?.picUrl})` }"></div>
    <div class="back-button" @click="goBack">
      <el-icon><Back /></el-icon>
    </div>
    <div class="content">
      <div class="left">
        <div class="disc" :class="{ playing: playerStore.isPlaying }">
          <img :src="playerStore.currentSong.coverImgUrl || playerStore.currentSong.al?.picUrl" alt="cover" />
        </div>
      </div>
      <div class="right">
        <h1>{{ playerStore.currentSong.name }}</h1>
        <div class="meta">
          <span>歌手：{{ playerStore.currentSong.artist }}</span>
        </div>
        <Lyric :lyric="lyric" :currentTime="playerStore.currentTime" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router' // 引入 useRouter
import { usePlayerStore } from '@/stores/player'
import { getLyric, getSongDetail } from '@/api/song' // 引入 getSongDetail
import Lyric from '@/components/Lyric.vue'
import { Back } from '@element-plus/icons-vue'

const route = useRoute() // 获取路由实例
const router = useRouter() // 获取路由实例
const playerStore = usePlayerStore()
const lyric = ref('')

const goBack = () => {
  router.back()
}

const fetchLyric = async (id) => {
  try {
    const res = await getLyric(id)
    lyric.value = res?.lyric || ''
  } catch (error) {
    console.error('获取歌词失败：', error)
  }
}

// 加载歌曲详情并设置到播放器 store
const loadSongAndLyric = async (songId) => {
  if (!songId) return
  
  if (!playerStore.currentSong || playerStore.currentSong.id !== songId) {
    
    try {
      const res = await getSongDetail(songId) // 获取歌曲详情
      
      if (res && res.code === 200 && res.data) {
        const song = res.data
    
        playerStore.setCurrentSong(song) // 设置当前播放歌曲
        fetchLyric(song.id)
      }
    } catch (error) {
      console.error('歌曲详情获取失败', error)
    }
  } else {
    fetchLyric(songId)
  }
}

onMounted(() => {
  const songId = route.params.id
  
  loadSongAndLyric(songId)
})

watch(() => route.params.id, (newId) => {
  loadSongAndLyric(newId)
})
</script>

<style lang="scss" scoped>
.song-detail {
  position: fixed;
  top: 60px;
  bottom: 70px;
  left: 0;
  right: 0;
  background-color: var(--theme-bg);
  z-index: 50;
  overflow-y: auto;

  .back-button {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 51;
    font-size: 24px;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(5px);
    transition: background-color 0.3s ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.5);
    }
  }

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    filter: blur(50px) brightness(0.5);
    z-index: -1;
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, var(--theme-primary) 0%, transparent 100%);
      opacity: 0.15;
    }
  }

  .content {
    display: flex;
    max-width: 1000px;
    margin: 0 auto;
    padding: 50px 20px;
    color: #fff;

    @media (max-width: 768px) {
      flex-direction: column;
      padding: 20px 10px;
      align-items: center;
    }

    .left {
      flex: 1;
      display: flex;
      justify-content: center;

      @media (max-width: 768px) {
        display: none; /* Hide disc on mobile */
      }
      .disc {
        width: 300px;
        height: 300px;
        border-radius: 50%;
        border: 10px solid rgba(255,255,255,0.1);
        box-shadow: 0 0 30px var(--theme-primary), 0 0 60px rgba(0,0,0,0.3);
        overflow: hidden;
        animation: rotate 20s linear infinite;
        animation-play-state: paused;
        &.playing {
          animation-play-state: running;
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }

    .right {
      flex: 1;
      h1 { 
        margin-bottom: 10px;
        text-shadow: 0 0 20px var(--theme-primary);
      }
      .meta {
        margin-bottom: 30px;
        span { margin-right: 20px; color: rgba(255,255,255,0.7); font-size: 14px; }
      }
    }
  }
}

@keyframes rotate {
  from { transform: rotate(0); }
  to { transform: rotate(360deg); }
}
</style>
