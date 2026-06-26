import { defineStore } from 'pinia'
import { ElMessage  } from 'element-plus'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    currentSong: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    playlist: [],
    currentIndex: -1
  }),
  actions: {
    setCurrentSong(song) {
      this.currentSong = song
      this.currentIndex = this.playlist.findIndex(s => s.id === song.id)
      if (this.currentIndex === -1) {
        this.playlist.unshift(song) // 将新点的歌放到列表最前面
        this.currentIndex = 0
      }
      this.isPlaying = true
    },
    // 播放整个歌单
    playAll(songs) {
      if (!songs || songs.length === 0) return
      this.playlist = [...songs]
      this.currentIndex = 0
      this.currentSong = this.playlist[0]
      this.isPlaying = true
    },
    // 添加单曲到列表（不立即播放）
    addToPlaylist(song) {
      const index = this.playlist.findIndex(s => s.id === song.id)
      if (index === -1) {
        this.playlist.push(song)
      }
    },
    // 从播放列表移除单曲
    removeFromPlaylist(songId) {
      const initialCurrentSongId = this.currentSong?.id;
      this.playlist = this.playlist.filter(song => song.id !== songId);

      if (initialCurrentSongId === songId) {
        // 如果移除的是当前播放的歌曲
        if (this.playlist.length > 0) {
          // 尝试播放列表中的下一首，如果没有下一首就播放第一首
          this.currentSong = this.playlist[this.currentIndex] || this.playlist[0];
          this.currentIndex = this.playlist.findIndex(s => s.id === this.currentSong.id);
        } else {
          // 播放列表为空
          this.currentSong = null;
          this.currentIndex = -1;
          this.isPlaying = false;
        }
      } else {
        // 如果移除的不是当前播放的歌曲，需要更新 currentIndex 以保持正确性
        if (this.currentSong) {
          const newIndex = this.playlist.findIndex(s => s.id === this.currentSong.id);
          this.currentIndex = newIndex !== -1 ? newIndex : -1;
        } else if (this.playlist.length > 0) {
          // 如果没有当前歌曲但列表不为空，确保 currentIndex 合理
          this.currentIndex = 0;
        } else {
          this.currentIndex = -1;
        }
      }

      if (this.playlist.length === 0) {
        this.isPlaying = false;
        this.currentSong = null;
        this.currentIndex = -1;
      }

      ElMessage({
        plain: true,
        message: '歌曲已从播放列表移除',
        type: 'danger'
      });
    },
    togglePlay() {
      this.isPlaying = !this.isPlaying
    },
    setPlaying(status) {
      this.isPlaying = status
    },
    setCurrentTime(time) {
      this.currentTime = time
    },
    setDuration(duration) {
      this.duration = duration
    },
    setPlaylist(list) {
      this.playlist = list
    },
    next() {
      if (this.playlist.length === 0) return
      if (this.currentIndex === this.playlist.length - 1) {
        ElMessage({
          plain: true,
          message: '已经是最后一首歌了',
          type: 'warning'
        });
        return
      }
      this.currentIndex = (this.currentIndex + 1)
      this.currentSong = this.playlist[this.currentIndex]
    },
    prev() {
      if (this.playlist.length === 0) return
      if (this.currentIndex === 0) {
        ElMessage({
          plain: true,
          message: '已经是第一首歌了',
          type: 'warning'
        });
        return
      }
      this.currentIndex = (this.currentIndex - 1)
      this.currentSong = this.playlist[this.currentIndex]
    }
  }
})
