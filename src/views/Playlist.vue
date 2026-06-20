<template>
  <div class="playlist-detail" v-if="detail">
    <div class="header">
      <img :src="detail.coverImgUrl" alt="cover" />
      <div class="info">
        <h1>{{ detail.name }}</h1>
        <p class="description">{{ detail.description }}</p>
      </div>
    </div>

    <div class="list-section">
      <h3>歌曲列表 ({{ detail.trackCount }})</h3>
      <SongList :songs="detail.tracks" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getPlaylistDetail } from '@/api/playlist'
import SongList from '@/components/SongList.vue'

const route = useRoute()
const detail = ref(null)

onMounted(async () => {
  try {
    const res = await getPlaylistDetail(route.params.id)
    detail.value = res.playlist
  } catch (error) {
    console.error('Failed to fetch playlist detail', error)
  }
})
</script>

<style lang="scss" scoped>
.playlist-detail {
  padding: 20px;
  .header {
    display: flex;
    gap: 30px;
    margin-bottom: 40px;
    img {
      width: 200px;
      height: 200px;
      border-radius: 8px;
    }
    .info {
      h1 { margin-bottom: 15px; }
      .description {
        color: #666;
        font-size: 14px;
        line-height: 1.6;
      }
    }
  }
}
</style>
