<template>
  <div class="player" v-if="playerStore.currentSong">
    <div class="song-info" @click="goToDetail">
      <img :src="playerStore.currentSong.al?.picUrl" alt="cover" />
      <div class="text">
        <div class="name">{{ playerStore.currentSong.name }}</div>
        <div class="artist">{{ playerStore.currentSong.ar?.[0]?.name }}</div>
      </div>
    </div>

    <div class="controls">
      <button @click="prev">Prev</button>
      <button @click="togglePlay">{{ playerStore.isPlaying ? 'Pause' : 'Play' }}</button>
      <button @click="next">Next</button>
    </div>

    <div class="progress-bar">
      <span>{{ formatTime(playerStore.currentTime) }}</span>
      <input 
        type="range" 
        :value="playerStore.currentTime" 
        :max="playerStore.duration" 
        @input="onSeek"
      />
      <span>{{ formatTime(playerStore.duration) }}</span>
    </div>

    <audio 
      ref="audioRef" 
      :src="songUrl"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
    ></audio>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { formatTime } from '@/utils/format'

const playerStore = usePlayerStore()
const router = useRouter()
const audioRef = ref(null)

// Mock audio URL - 使用公共可用的示例音频
const songUrl = computed(() => {
  const songId = playerStore.currentSong?.id || 1001
  const sampleTracks = [
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  ]
  return sampleTracks[songId % sampleTracks.length]
})

const togglePlay = () => {
  playerStore.togglePlay()
  if (playerStore.isPlaying) {
    audioRef.value?.play()
  } else {
    audioRef.value?.pause()
  }
}

const onTimeUpdate = () => {
  if (audioRef.value) {
    playerStore.setCurrentTime(audioRef.value.currentTime)
  }
}

const onLoadedMetadata = () => {
  if (audioRef.value) {
    playerStore.setDuration(audioRef.value.duration)
    if (playerStore.isPlaying) {
      audioRef.value.play()
    }
  }
}

const onSeek = (e) => {
  if (audioRef.value) {
    const time = parseFloat(e.target.value)
    audioRef.value.currentTime = time
    playerStore.setCurrentTime(time)
  }
}

const prev = () => {
  const currentIndex = playerStore.currentIndex
  const newIndex = currentIndex > 0 ? currentIndex - 1 : playerStore.playlist.length - 1
  if (playerStore.playlist.length > 0) {
    playerStore.setCurrentSong(playerStore.playlist[newIndex])
    playerStore.setCurrentTime(0)
  }
}

const next = () => {
  const currentIndex = playerStore.currentIndex
  const newIndex = (currentIndex + 1) % playerStore.playlist.length
  if (playerStore.playlist.length > 0) {
    playerStore.setCurrentSong(playerStore.playlist[newIndex])
    playerStore.setCurrentTime(0)
  }
}

const onEnded = () => {
  next()
}

const goToDetail = () => {
  router.push(`/song/${playerStore.currentSong.id}`)
}

watch(() => playerStore.isPlaying, (newVal) => {
  if (audioRef.value) {
    newVal ? audioRef.value.play() : audioRef.value.pause()
  }
})

watch(() => playerStore.currentSong?.id, () => {
  if (audioRef.value && playerStore.isPlaying) {
    audioRef.value.play()
  }
})
</script>

<style lang="scss" scoped>
.player {
  height: 70px;
  background-color: #fff;
  border-top: 1px solid #ddd;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);

  .song-info {
    display: flex;
    align-items: center;
    width: 200px;
    cursor: pointer;
    img {
      width: 50px;
      height: 50px;
      border-radius: 4px;
      margin-right: 10px;
    }
    .text {
      overflow: hidden;
      .name {
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .artist {
        font-size: 12px;
        color: #888;
      }
    }
  }

  .controls {
    flex: 1;
    display: flex;
    justify-content: center;
    gap: 20px;
    button {
      padding: 5px 15px;
      cursor: pointer;
    }
  }

  .progress-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 300px;
    font-size: 12px;
    input {
      flex: 1;
    }
  }
}
</style>
