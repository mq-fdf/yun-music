<template>
  <div class="lyric-container" ref="containerRef">
    <div 
      class="lyric-wrapper"
      :style="{ transform: `translateY(${offsetY}px)` }"
    >
      <p 
        v-for="(line, index) in parsedLyrics" 
        :key="index"
        :class="{ active: currentLineIndex === index }"
        ref="lineRefs"
      >
        {{ line.text }}
      </p>
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

const containerRef = ref(null)
const lineRefs = ref([])
const currentLineIndex = ref(-1)

const parsedLyrics = computed(() => {
  if (!props.lyric) return []
  const lines = props.lyric.split('\n')
  const result = []
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
  
  lines.forEach(line => {
    const match = timeRegex.exec(line)
    if (match) {
      const min = parseInt(match[1])
      const sec = parseInt(match[2])
      const ms = parseInt(match[3])
      const time = min * 60 + sec + (ms > 99 ? ms / 1000 : ms / 100)
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
  // Simplified offset calculation
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
      color: #666;
      font-size: 14px;
      &.active {
        color: #c20c0c;
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
}
</style>
