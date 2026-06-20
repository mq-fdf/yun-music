import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    currentSong: null,
    playlist: [],
    isPlaying: false,
    playMode: 'sequence', // sequence, loop, random
    currentTime: 0,
    duration: 0,
    volume: 0.7
  }),
  getters: {
    currentIndex: (state) => {
      return state.playlist.findIndex(song => song.id === state.currentSong?.id)
    }
  },
  actions: {
    setCurrentSong(song) {
      this.currentSong = song
    },
    setPlaylist(list) {
      this.playlist = list
    },
    togglePlay() {
      this.isPlaying = !this.isPlaying
    },
    setPlayMode(mode) {
      this.playMode = mode
    },
    setCurrentTime(time) {
      this.currentTime = time
    },
    setDuration(duration) {
      this.duration = duration
    }
  }
})
