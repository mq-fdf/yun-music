<template>
  <div class="player" v-if="playerStore.currentSong">
    
    <div class="player-content">
      <div class="song-info" @click="goToDetail">
        <img :src="playerStore.currentSong.coverImgUrl" alt="cover" />
        <div class="text">
          <div class="name">{{ playerStore.currentSong.name }}</div>
          <div class="artist">{{ playerStore.currentSong?.artist }}</div>
        </div>
      </div>

      <div class="controls">
        <el-button circle @click="prev"><el-icon><ArrowLeft /></el-icon></el-button>
        <el-button circle type="primary" size="large" @click="togglePlay">
          <el-icon v-if="playerStore.isPlaying"><VideoPause /></el-icon>
          <el-icon v-else><VideoPlay /></el-icon>
        </el-button>
        <el-button circle @click="next"><el-icon><ArrowRight /></el-icon></el-button>
        <el-button type="primary" class="playlist-btn" @click="isShowList = true">播放列表</el-button>
      </div>

      <!-- 播放列表抽屉 -->
      <el-drawer
        v-model="isShowList"
        title="当前播放"
        direction="rtl"
        size="350px"
        custom-class="player-drawer"
      >
        <template #header>
          <div class="drawer-header">
            <span>当前播放 ({{ playerStore.playlist.length }})</span>
          </div>
        </template>
        <div class="list">
          <div 
            v-for="(song, index) in playerStore.playlist" 
            :key="song.id"
            class="item"
            :class="{ active: playerStore.currentSong?.id === song.id }"
            @click="playFromList(song)"
          >
            <div class="song-info-left">
              <div class="song-name-wrap">
                <span class="name">{{ song.name }}</span>
              </div>
              <span class="artist">- {{ song.artist }}</span>
            </div>
            <el-button 
              class="delPlayList"
              link 
              type="danger" 
              title="移除歌曲"
              @click.stop="delToPlaylist(song.id)"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
      </el-drawer>

      <div class="progress-bar">
        <span>{{ formatTime(playerStore.currentTime) }}</span>
        <el-slider 
          :model-value="playerStore.currentTime" 
          :max="playerStore.duration" 
          :show-tooltip="false"
          @input="handleSliderInput"
          @change="handleSliderChange"
        />
        <span>{{ formatTime(playerStore.duration) }}</span>
      </div>
    </div>

    <audio 
      ref="audioRef" 
      :src="playerStore.currentSong.musicUrl"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
      @error="onAudioError"
    ></audio>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { formatTime } from '@/utils/format'
import { VideoPlay, VideoPause, ArrowLeft, ArrowRight, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus' // 导入ElMessage用于弹窗提示

const playerStore = usePlayerStore()
const router = useRouter()
const audioRef = ref(null)
const isShowList = ref(false)
const isSeeking = ref(false) // 标记是否正在拖动进度条
const wasPlayingBeforeSeeking = ref(false) // 记录拖动前是否在播放

// 音频播放错误事件
const onAudioError = () => {
  console.error('音频播放错误！');
  ElMessage.error('音乐播放失败，请检查网络或更换歌曲。');
  playerStore.setPlaying(false);
};

// 从播放列表点击歌曲播放
const playFromList = (song) => {
  playerStore.setCurrentSong(song)
  playerStore.setPlaying(true)
}

// 从播放列表移除歌曲
const delToPlaylist = (songId) => {
  playerStore.removeFromPlaylist(songId)
}

// 切换播放/暂停状态
const togglePlay = async () => {
  playerStore.togglePlay()
  if (playerStore.isPlaying) {
    try {
      await audioRef.value?.play()
    } catch (error) {
      console.error('togglePlay: 播放失败', error)
      ElMessage.error('播放失败，浏览器可能阻止了自动播放。请尝试再次点击或与页面互动。') // 播放失败时弹窗提示
      playerStore.setPlaying(false) // 播放失败时，将状态设为暂停
    }
  } else {
    audioRef.value?.pause()
  }
}

// 音频时间更新事件
const onTimeUpdate = () => {
  // 如果正在拖动进度条，则不更新currentTime，防止进度条跳动
  if (audioRef.value && !isSeeking.value) {
    playerStore.setCurrentTime(audioRef.value.currentTime)
  }
}

// 音频元数据加载完成事件
const onLoadedMetadata = async () => {
  if (audioRef.value) {
    playerStore.setDuration(audioRef.value.duration)
    if (playerStore.isPlaying) {
      try {
        await audioRef.value.play()
      } catch (error) {
        console.error('onLoadedMetadata: 自动播放失败', error)
        ElMessage.error('自动播放失败，浏览器可能阻止了自动播放。请尝试手动点击播放。')
        playerStore.setPlaying(false)
      }
    }
  }
}

// 处理进度条拖动（input事件，实时触发）
const handleSliderInput = (val) => {
  if (audioRef.value) {
    if (!isSeeking.value) {
      // 拖动开始时，记录当前播放状态并暂停
      wasPlayingBeforeSeeking.value = playerStore.isPlaying 
      playerStore.setPlaying(false) 
      audioRef.value.pause()
      isSeeking.value = true
    }
    audioRef.value.currentTime = val // 实时更新音频当前时间
    playerStore.setCurrentTime(val) // 更新 Pinia 状态
  }
}

// 处理进度条松开（change事件，拖动结束触发）
const handleSliderChange = async (val) => {
  if (audioRef.value) {
    audioRef.value.currentTime = val // 确保音频时间设置为最终值
    playerStore.setCurrentTime(val) // 更新 Pinia 状态
    if (wasPlayingBeforeSeeking.value) {
      // 如果拖动前在播放，则尝试恢复播放
      playerStore.setPlaying(true)
      try {
        await audioRef.value?.play()
      } catch (error) {
        console.error('handleSliderChange: 拖动后播放失败', error)
        ElMessage.error('播放失败，浏览器可能阻止了自动播放。') // 弹窗提示
        playerStore.setPlaying(false) // 播放失败时，将状态设为暂停
      }
    }
    isSeeking.value = false // 结束拖动
    wasPlayingBeforeSeeking.value = false // 重置状态
  }
}

// 播放上一首
const prev = () => {
  playerStore.prev()
  playerStore.setCurrentTime(0)
  // 切换歌曲后，如果之前在播放，则尝试继续播放
  if (playerStore.isPlaying) {
    audioRef.value?.play().catch(error => {
      console.error('prev: 播放上一首失败', error)
      ElMessage.error('切换歌曲后播放失败。') // 弹窗提示
      playerStore.setPlaying(false)
    })
  }
}

// 播放下一首
const next = () => {
  playerStore.next()
  playerStore.setCurrentTime(0)
  // 切换歌曲后，如果之前在播放，则尝试继续播放
  if (playerStore.isPlaying) {
    audioRef.value?.play().catch(error => {
      console.error('next: 播放下一首失败', error)
      ElMessage.error('切换歌曲后播放失败。') // 弹窗提示
      playerStore.setPlaying(false)
    })
  }
}

// 音频播放结束事件
const onEnded = async () => {
  playerStore.next()
  playerStore.setCurrentTime(0)
  if (playerStore.isPlaying) {
    try {
      await audioRef.value?.play()
    } catch (error) {
      console.error('onEnded: 自动播放下一首失败', error)
      ElMessage.error('自动播放下一首失败，可能需要手动点击播放。') // 弹窗提示
      playerStore.setPlaying(false) // 失败后将状态设为暂停
    }
  }
}

// 跳转到歌曲详情页
const goToDetail = () => {
  router.push(`/song/${playerStore.currentSong.id}`)
}

// 监听播放状态变化
watch(() => playerStore.isPlaying, async (newVal) => {
  if (audioRef.value) {
    if (newVal) {
      try {
        await audioRef.value.play()
      } catch (error) {
        console.error('watch playerStore.isPlaying: 尝试播放音乐失败', error)
        ElMessage.error('播放失败，浏览器可能阻止了自动播放。请尝试再次点击播放。') // 弹窗提示
        playerStore.setPlaying(false) // 失败后将状态设为暂停
      }
    } else {
      audioRef.value.pause()
    }
  }
})
</script>

<style lang="scss" scoped>
.player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: var(--theme-bg);
  border-top: 1px solid var(--theme-border);
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  transition: all 0.3s;
  z-index: 100;
  color: var(--theme-text);

  @media (max-width: 768px) {
    height: 150px;
    padding: 0 50px;
  }

  .player-content {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;

    @media (max-width: 768px) {
      flex-direction: column;
      justify-content: center;
      padding-top: 5px;
      gap: 5px;
    }
  }

  .song-info {
    display: flex;
    align-items: center;
    width: 200px;
    cursor: pointer;

    @media (max-width: 768px) {
      width: 100%;
      justify-content: center;
      img {
        width: 30px;
        height: 30px;
        margin-right: 8px;
      }
      .text {
        .name {
          font-size: 14px;
        }
        .artist {
          font-size: 12px;
        }
      }
    }
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
        color: var(--theme-text);
        margin-bottom: 4px;
      }
      .artist {
        font-size: 12px;
        color: var(--theme-text-secondary);
      }
    }
  }

  .controls {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    
    @media (max-width: 768px) {
      gap: 10px;
      .el-button {
        min-width: 36px;
        height: 36px;
        padding: 0;
        font-size: 16px;
        &.el-button--large {
          min-width: 44px;
          height: 44px;
          font-size: 20px;
        }
      }
      .playlist-btn {
        display: none;
      }
    }

    :deep(.el-button--primary) {
      --el-button-bg-color: var(--theme-primary);
      --el-button-border-color: var(--theme-primary);
      --el-button-text-color: #fff !important;
      --el-button-hover-bg-color: color-mix(in srgb, var(--theme-primary), white 15%);
      --el-button-hover-border-color: color-mix(in srgb, var(--theme-primary), white 15%);
      --el-button-hover-text-color: #fff !important;
      --el-button-active-bg-color: color-mix(in srgb, var(--theme-primary), black 10%);
      --el-button-active-border-color: color-mix(in srgb, var(--theme-primary), black 10%);
      --el-button-active-text-color: #fff !important;
    }
    
    :deep(.el-button:not(.el-button--primary)) {
      --el-button-bg-color: transparent;
      --el-button-border-color: var(--theme-border);
      --el-button-text-color: var(--theme-text);
      --el-button-hover-bg-color: rgba(var(--theme-primary-rgb, 194, 12, 12), 0.1);
      --el-button-hover-border-color: var(--theme-primary);
      --el-button-hover-text-color: var(--theme-primary);
    }
    
    :deep(.el-button .el-icon) {
      color: inherit;
    }
    
    .playlist-btn {
      margin-left: 10px;
    }
  }

  :deep(.el-drawer) {
    background-color: var(--theme-bg);
    color: var(--theme-text);
    border-left: 1px solid var(--theme-border);
    
    .el-drawer__header {
      margin-bottom: 0;
      padding: 15px;
      border-bottom: 1px solid var(--theme-border);
      color: var(--theme-text);
      font-weight: bold;
    }
    
    .el-drawer__body {
      padding: 0;
    }
  }

  .list {
    flex: 1;
    overflow-y: auto;
    .item {
        padding: 12px 15px;
        border-bottom: 1px solid var(--theme-border);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between; /* Added to push button to the right */
        font-size: 14px;
        transition: background-color 0.2s;
        
        &:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
        &.active {
          color: var(--theme-primary);
          background-color: rgba(var(--theme-primary-rgb, 194, 12, 12), 0.05);
        }
        
        .song-info-left {
          display: flex;
          align-items: center;
          flex-grow: 1;
          overflow: hidden;
        }
        
        .song-name-wrap {
        display: flex;
        align-items: center;
        gap: 6px;
        max-width: 220px;
        overflow: hidden;
        .name {
          max-width: 160px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .mini-tag {
          font-weight: 500;
          font-size: 10px;
          line-height: 1.3;
        }
      }
      .artist {
        font-size: 12px;
        color: var(--theme-text-secondary);
        margin-left: 8px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .delPlayList {
        flex-shrink: 0;
        margin-left: 10px;
      }
    }
  }

  .progress-bar {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 12px;
    color: var(--theme-text-secondary);
    margin: 0 30px;
    
    @media (max-width: 768px) {
      width: 90%;
      margin-left: 0;
      padding: 0;
      gap: 5px;
    }

    span {
      font-size: 12px;
      @media (max-width: 768px) {
        font-size: 10px;
      }
    }
    :deep(.el-slider) {
      --el-slider-main-bg-color: var(--theme-primary);
      --el-slider-runway-bg-color: var(--theme-border);
      --el-slider-stop-bg-color: var(--theme-border);
    }
  }
}
</style>
