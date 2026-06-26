<template>
  <div class="home">
    <section class="recommend">
      <h2>推荐歌单</h2>
      <div class="playlist-grid">
        <div 
          v-for="item in mockPlaylists" 
          :key="item.id" 
          class="playlist-card"
          @click="router.push(`/playlist/${item.id}`)"
        >
          <img :src="item.coverImgUrl" :alt="item.name" />
          <p>{{ item.name }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router' // Import useRouter
import { mockSongs } from '@/mock/mockData.js'

const router = useRouter() // Initialize useRouter

const mockPlaylists = ref([])

// 模拟生成一些歌单数据，每个歌单包含一首歌曲作为封面
// 实际应用中，歌单会有自己的数据结构
const generateMockPlaylists = () => {
  const playlists = []
  for (let i = 0; i < 10; i++) { // 生成10个模拟歌单
    const songIndex = i * 3 % mockSongs.length; // 确保索引不越界
    const song = mockSongs[songIndex];
    playlists.push({
      id: `mock-playlist-${i + 1}`,
      name: `模拟歌单 ${i + 1} - ${song.album}`,
      coverImgUrl: song.coverImgUrl,
      // 可以在这里添加其他歌单相关信息
      songs: mockSongs.slice(songIndex, songIndex + 3) // 模拟每个歌单包含3首歌曲
    });
  }
  mockPlaylists.value = playlists;
};

generateMockPlaylists();

</script>

<style lang="scss" scoped>
.home {
  padding: 20px;
  h2 {
    margin-bottom: 20px;
    border-left: 4px solid var(--theme-primary);
    padding-left: 10px;
    color: var(--theme-text);
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
        border: 1px solid var(--theme-border);
      }
      p {
        margin-top: 8px;
        font-size: 14px;
        color: var(--theme-text);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }
}
</style>
