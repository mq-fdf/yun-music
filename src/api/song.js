import { mockSongs, mockLyric } from '@/utils/mockData'

const mockDelay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const getSongUrl = async (id) => {
  await mockDelay()
  return {
    code: 200,
    data: [{
      id: id,
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    }]
  }
}

export const getLyric = async (id) => {
  await mockDelay()
  return {
    code: 200,
    lrc: {
      lyric: mockLyric
    }
  }
}

export const getSongDetail = async (ids) => {
  await mockDelay()
  const idList = ids.split(',')
  const songs = idList.map(id => {
    return mockSongs.find(s => s.id == id) || mockSongs[0]
  })
  return {
    code: 200,
    songs: songs
  }
}
