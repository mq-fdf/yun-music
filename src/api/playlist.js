import { mockPlaylists, mockSongs, mockLyric } from '@/utils/mockData'

// 模拟延迟，模拟网络请求
const mockDelay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const getPersonalizedPlaylist = async (limit = 30) => {
  await mockDelay()
  return {
    code: 200,
    result: mockPlaylists.slice(0, limit)
  }
}

export const getPlaylistDetail = async (id) => {
  await mockDelay()
  const playlist = mockPlaylists.find(p => p.id == id) || mockPlaylists[0]
  return {
    code: 200,
    playlist: {
      ...playlist,
      coverImgUrl: playlist.picUrl,
      description: '这是一个精选歌单，包含了各种风格的好听歌曲。',
      trackCount: mockSongs.length,
      tracks: mockSongs
    }
  }
}
