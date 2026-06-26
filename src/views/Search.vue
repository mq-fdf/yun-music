<template>
  <div class="search">
    <div class="search-input">
      <el-autocomplete
        style="height: 50px; width: 100%;"
        v-model="keywords"
        :fetch-suggestions="querySearchAsync"
        placeholder="搜索音乐、歌手"
        clearable
        @select="handleSelect"
        @keyup.enter="handleSearch"
      >
        <template #append>
          <el-button @click="handleSearch">
            <el-icon><SearchIcon /></el-icon>
          </el-button>
        </template>
      </el-autocomplete>
    </div>

    <!-- 歌曲列表 -->
    <div class="search-results" v-if="songs.length">
      <h3>歌曲列表 ({{ songs.length }})</h3>
      <div class="song-list-container">
        <SongList :songs="songs" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { searchSongs, getSearchSuggestions } from '@/api/song'
import SongList from '@/components/SongList.vue'
import { Search as SearchIcon } from '@element-plus/icons-vue'

const keywords = ref('')
const songs = ref([])

const querySearchAsync = async (queryString, cb) => {
  if (!queryString) {
    cb([])
    return
  }
  try {
    const res = await getSearchSuggestions(queryString)
    if (res && res.length) {
      cb(res)
    } else {
      cb([])
    }
  } catch (error) {
    console.error('获取搜索建议失败:', error)
    cb([])
  }
}

const handleSelect = (item) => {
  keywords.value = item.value
  handleSearch()
}

const handleSearch = async () => {
  if (!keywords.value.trim()) return
  try {
    const res = await searchSongs(keywords.value)
    if (res && res.code === 200 && res.data && res.data.records) {
      songs.value = res.data.records
    } else {
      songs.value = [] // 清空结果
    }
  } catch (error) {
    console.error('搜索失败:', error)
    songs.value = [] // 清空结果
  }
}
</script>

<style lang="scss" scoped>
.search {
  padding: 20px;
  margin: 0 auto;
  .search-input {
    margin-bottom: 30px;
    :deep(.el-input-group__append) {
      background-color: var(--theme-primary);
      color: #fff;
      box-shadow: none;
      border: none;
      .el-button {
        color: #fff;
        margin: -5px -20px;
        padding: 0 30px;
      }
    }
  }
}
</style>
