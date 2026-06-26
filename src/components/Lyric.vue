<template>
  <div class="lyric-container" ref="containerRef">
    <div 
      v-if="parsedLyrics.length > 0"
      class="lyric-wrapper"
      :style="{ transform: `translateY(${offsetY}px)` }"
    >
      <p 
        v-for="(line, index) in parsedLyrics" 
        :key="index"
        :class="{ active: currentLineIndex === index }"
      >
        {{ line.text }}
      </p>
    </div>
    <div v-else class="no-lyric">
      暂无歌词
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  lyric: {
    type: String,
    default: ''
  },
  currentTime: {
    type: Number,
    default: 0
  }
})

const currentLineIndex = ref(-1)


// 根据屏幕宽度更新行高的函数
const updateLyricLineHeight = () => {
  if (window.innerWidth <= 768) {
    lyricLineHeight.value = 25
  } else {
    lyricLineHeight.value = 30
  }
}

onMounted(() => {
  updateLyricLineHeight()
  window.addEventListener('resize', updateLyricLineHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateLyricLineHeight)
})

const parsedLyrics = computed(() => {
  if (!props.lyric) return []
  const lines = props.lyric.split('\n')
  const result = []
  // 更加健壮的正则，支持 [00:00.00] 或 [00:00.000] 格式
  const timeRegex = /\[(\d{2}):(\d{2})[.:](\d{2,3})\]/
  
  lines.forEach(line => {
    const match = timeRegex.exec(line)
    if (match) {
      const min = parseInt(match[1])
      const sec = parseInt(match[2])
      const msStr = match[3]
      const ms = parseInt(msStr)
      // 根据毫秒位数动态计算偏移（2位除以100，3位除以1000）
      const time = min * 60 + sec + ms / Math.pow(10, msStr.length)
      const text = line.replace(timeRegex, '').trim()
      if (text) {
        result.push({ time, text })
      }
    }
  })
  return result
})

const lyricLineHeight = ref(30) 

const offsetY = computed(() => {
  if (currentLineIndex.value <= 0) return 0
  return -(currentLineIndex.value * lyricLineHeight.value)
})

watch(() => props.currentTime, (time) => {
  const index = parsedLyrics.value.findIndex((line, i) => {
    const nextLine = parsedLyrics.value[i + 1]
    return time >= line.time && (!nextLine || time < nextLine.time)
  })
  if (index !== -1) {
    currentLineIndex.value = index
  }
})


</script>

<style lang="scss" scoped>
.lyric-container {
  height: 300px;
  overflow: hidden;
  text-align: center;
  position: relative;

  @media (max-width: 768px) {
    height: 200px;
    --lyric-line-height: 25px;
  }

  .lyric-wrapper {
    transition: transform 0.3s ease-out;
    p {
      height: var(--lyric-line-height, 30px);
      line-height: var(--lyric-line-height, 30px);
      margin: 0;
      color: rgba(255,255,255,0.6);
      font-size: 14px;
      transition: all 0.3s;

      @media (max-width: 768px) {
        font-size: 12px;
      }

      &.active {
        color: var(--theme-primary);
        font-size: 16px;
        font-weight: bold;

        @media (max-width: 768px) {
          font-size: 14px;
        }
      }
    }
  }

  .no-lyric {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: rgba(255,255,255,0.5);
    font-size: 16px;
  }
}
</style>
