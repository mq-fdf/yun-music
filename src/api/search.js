import { mockSongs } from '@/utils/mockData'

const mockDelay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const searchMusic = async (keywords) => {
  await mockDelay()
  return {
    code: 200,
    result: {
      songs: mockSongs.map(song => ({
        ...song,
        name: `${keywords} - ${song.name}`
      }))
    }
  }
}

export const getHotSearch = async () => {
  await mockDelay()
  return {
    code: 200,
    result: {
      hots: [
        { first: '周杰伦', second: '热门歌手' },
        { first: '林俊杰', second: '人气艺人' },
        { first: '陈奕迅', second: '金曲歌王' },
        { first: '邓紫棋', second: '实力歌手' }
      ]
    }
  }
}
