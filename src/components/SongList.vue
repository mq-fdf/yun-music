<template>
  <div class="song-list">
    <el-table 
      v-if="songs.length" 
      :data="songs" 
      style="width: 100%"
      height="100%"
      :row-class-name="tableRowClassName"
      @row-click="playSong"
    >
      <el-table-column type="index" label="#" width="50" align="center">
        <template #default="scope">
          <span class="index-text">{{ (scope.$index + 1).toString().padStart(2, '0') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="封面图" width="120" align="center" class-name="hidden-xs-only">
        <template #default="scope">
          <img :src="scope.row.coverImgUrl || scope.row.al?.picUrl" alt="" class="song-cover" />
        </template>
      </el-table-column>
      
      <el-table-column prop="name" label="歌曲" min-width="250" show-overflow-tooltip  align="center" />
      
      <el-table-column label="歌手" width="180" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.artist }}
        </template>
      </el-table-column>
      
      <el-table-column label="专辑" width="200" show-overflow-tooltip class-name="hidden-xs-only">
        <template #default="scope">
          {{ scope.row.album }}
        </template>
      </el-table-column>
      
      <el-table-column label="时长" width="80" align="right">
        <template #default="scope">
          {{ formatTime(scope.row.duration || (scope.row.dt / 1000)) }}
        </template>
      </el-table-column>
      
      <el-table-column label="操作" width="80">
        <template #default="scope">
          <el-button 
            v-if="!isSongInPlaylist(scope.row)"
            class="song-action-btn"
            type="primary" 
            title="添加到播放列表" 
            @click.stop="addToPlaylist(scope.row)"
          >
            <el-icon><Plus /></el-icon>
          </el-button>
          <el-button 
            v-else
            class="song-action-btn"
            type="success" 
            title="已添加到播放列表" 
            disabled
          >
            <el-icon><Check /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { usePlayerStore } from '@/stores/player'
import { formatTime } from '@/utils/format'
import { Plus, Check } from '@element-plus/icons-vue'

defineProps({
  songs: {
    type: Array,
    default: () => []
  }
})

const playerStore = usePlayerStore()

// 检查歌曲是否在播放列表中
const isSongInPlaylist = (song) => {
  return playerStore.playlist.some(item => item.id === song.id)
}

const playSong = (song) => {
  playerStore.setCurrentSong(song)
  playerStore.setPlaying(true)
}

const addToPlaylist = (song) => {
  playerStore.addToPlaylist(song)
}

const tableRowClassName = ({ row }) => {
  if (playerStore.currentSong?.id === row.id) {
    return 'active-row'
  }
  return ''
}
</script>

<style lang="scss" scoped>
.song-list {
  height: 100%;
  overflow: hidden;

  .song-cover {
    width: 50px;
    height: 50px;
    border-radius: 4px;
    object-fit: cover;
  }

  :deep(.el-table) {
    background-color: transparent;
    --el-table-bg-color: transparent;
    --el-table-tr-bg-color: transparent;
    --el-table-header-bg-color: transparent;
    --el-table-border-color: var(--theme-border);
    --el-table-text-color: var(--theme-text);
    --el-table-header-text-color: var(--theme-text-secondary);
    --el-table-row-hover-bg-color: rgba(var(--theme-primary-rgb, 194, 12, 12), 0.05);

    .active-row {
      color: var(--theme-primary);
      background-color: rgba(var(--theme-primary-rgb, 194, 12, 12), 0.1) !important;
      .index-text {
        color: var(--theme-primary);
      }
    }

    .index-text {
      color: var(--theme-text-secondary);
      opacity: 0.8;
    }

    th.el-table__cell {
      font-weight: normal;
      font-size: 13px;
      background-color: var(--theme-bg);
    }

    td.el-table__cell {
      border-bottom: 1px solid var(--theme-border);
      background-color: var(--theme-bg);
    }

    .el-table__row {
      cursor: pointer;
      &:hover > td.el-table__cell {
        background-color: rgba(var(--theme-primary-rgb, 194, 12, 12), 0.05) !important;
      }
    }
  }
  
  .song-action-btn {
    width: 32px;
    height: 32px;
    min-width: unset;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    &:hover {
      opacity: 0.8;
    }
    &.el-button--primary {
      background-color: var(--theme-primary);
      border-color: var(--theme-primary);
      color: #fff;
    }
    &.el-button--success.is-disabled {
      background-color: rgba(var(--theme-primary-rgb), 0.3);
      border-color: rgba(var(--theme-primary-rgb), 0.3);
      color: #fff;
      cursor: not-allowed;
    }
  }
}
</style>
