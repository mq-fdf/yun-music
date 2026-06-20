<template>
  <div class="search">
    <div class="search-input">
      <input 
        v-model="keywords" 
        type="text" 
        placeholder="搜索音乐、歌手" 
        @keyup.enter="handleSearch"
      />
      <button @click="handleSearch">搜索</button>
    </div>

    <div class="search-results" v-if="songs.length">
      <SongList :songs="songs" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { searchMusic } from '@/api/search'
import SongList from '@/components/SongList.vue'
import { mockSongs } from '@/utils/mockData'

const keywords = ref('')
const songs = ref([])

const handleSearch = async () => {
  if (!keywords.value.trim()) return
  try {
    const res = await searchMusic(keywords.value)
    songs.value = res.result.songs
  } catch (error) {
    console.warn('Search API failed, using mock data', error)
    songs.value = mockSongs.map(song => ({
      ...song,
      name: keywords.value + ' - ' + song.name
    }))
  }
}
</script>

<style lang="scss" scoped>
.search {
  padding: 20px;
  .search-input {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    input {
      flex: 1;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    button {
      padding: 0 20px;
      background-color: #c20c0c;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  }
}
</style>
