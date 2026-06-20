<template>
  <div class="song-detail" v-if="playerStore.currentSong">
    <div class="bg" :style="{ backgroundImage: `url(${playerStore.currentSong.al?.picUrl})` }"></div>
    <div class="content">
      <div class="left">
        <div class="disc" :class="{ playing: playerStore.isPlaying }">
          <img :src="playerStore.currentSong.al?.picUrl" alt="cover" />
        </div>
      </div>
      <div class="right">
        <h1>{{ playerStore.currentSong.name }}</h1>
        <div class="meta">
          <span>歌手：{{ playerStore.currentSong.ar?.[0]?.name }}</span>
          <span>专辑：{{ playerStore.currentSong.al?.name }}</span>
        </div>
        <Lyric :lyric="lyric" :currentTime="playerStore.currentTime" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { getLyric } from '@/api/song'
import Lyric from '@/components/Lyric.vue'

const playerStore = usePlayerStore()
const lyric = ref('')

const fetchLyric = async (id) => {
  try {
    const res = await getLyric(id)
    lyric.value = res.lrc?.lyric || ''
  } catch (error) {
    console.error('Failed to fetch lyric', error)
  }
}

onMounted(() => {
  if (playerStore.currentSong) {
    fetchLyric(playerStore.currentSong.id)
  }
})

watch(() => playerStore.currentSong?.id, (newId) => {
  if (newId) fetchLyric(newId)
})
</script>

<style lang="scss" scoped>
.song-detail {
  position: fixed;
  top: 60px;
  bottom: 70px;
  left: 0;
  right: 0;
  background-color: #fff;
  z-index: 50;
  overflow-y: auto;

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
  }

  .content {
    display: flex;
    max-width: 1000px;
    margin: 0 auto;
    padding: 50px 20px;
    color: #fff;

    .left {
      flex: 1;
      display: flex;
      justify-content: center;
      .disc {
        width: 300px;
        height: 300px;
        border-radius: 50%;
        border: 10px solid rgba(255,255,255,0.1);
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
      h1 { margin-bottom: 10px; }
      .meta {
        margin-bottom: 30px;
        span { margin-right: 20px; color: #ccc; font-size: 14px; }
      }
    }
  }
}

@keyframes rotate {
  from { transform: rotate(0); }
  to { transform: rotate(360deg); }
}
</style>
