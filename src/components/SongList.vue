<template>
  <div class="song-list">
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>歌曲</th>
          <th>歌手</th>
          <th>专辑</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(song, index) in songs" :key="song.id" @click="playSong(song)">
          <td>{{ index + 1 }}</td>
          <td>{{ song.name }}</td>
          <td>{{ song.ar?.[0]?.name }}</td>
          <td>{{ song.al?.name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { usePlayerStore } from '@/stores/player'

const props = defineProps({
  songs: {
    type: Array,
    default: () => []
  }
})

const playerStore = usePlayerStore()

const playSong = (song) => {
  playerStore.setCurrentSong(song)
  playerStore.setPlaylist(props.songs)
  if (!playerStore.isPlaying) {
    playerStore.togglePlay()
  }
}
</script>

<style lang="scss" scoped>
.song-list {
  table {
    width: 100%;
    border-collapse: collapse;
    th, td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    tr:hover {
      background-color: #f9f9f9;
      cursor: pointer;
    }
  }
}
</style>
