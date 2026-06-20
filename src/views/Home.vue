<template>
  <div class="home">
    <section class="recommend">
      <h2>推荐歌单</h2>
      <div class="playlist-grid">
        <div 
          v-for="item in playlists" 
          :key="item.id" 
          class="playlist-card"
          @click="$router.push(`/playlist/${item.id}`)"
        >
          <img :src="item.picUrl" :alt="item.name" />
          <p>{{ item.name }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getPersonalizedPlaylist } from '@/api/playlist'
import { mockPlaylists } from '@/utils/mockData'

const playlists = ref([])

onMounted(async () => {
  try {
    const res = await getPersonalizedPlaylist(10)
    playlists.value = res.result
  } catch (error) {
    console.warn('API failed, using mock data', error)
    playlists.value = mockPlaylists
  }
})
</script>

<style lang="scss" scoped>
.home {
  padding: 20px;
  h2 {
    margin-bottom: 20px;
    border-left: 4px solid #c20c0c;
    padding-left: 10px;
  }
  .playlist-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
    .playlist-card {
      cursor: pointer;
      img {
        width: 100%;
        aspect-ratio: 1;
        border-radius: 8px;
        object-fit: cover;
      }
      p {
        margin-top: 8px;
        font-size: 14px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }
}
</style>
