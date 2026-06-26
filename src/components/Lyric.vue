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
import { ref, computed, watch } from 'vue'

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

const offsetY = computed(() => {
  if (currentLineIndex.value <= 0) return 0
  return -(currentLineIndex.value * 30) 
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
  
  .lyric-wrapper {
    transition: transform 0.3s ease-out;
    p {
      height: 30px;
      line-height: 30px;
      margin: 0;
      color: rgba(255,255,255,0.6);
      font-size: 14px;
      transition: all 0.3s;
      &.active {
        color: var(--theme-primary);
        font-size: 16px;
        font-weight: bold;
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
