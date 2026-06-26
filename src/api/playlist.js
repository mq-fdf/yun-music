import { mockSongs } from '@/mock/mockData'

// 模拟的歌单数据，与 Home.vue 中生成歌单的逻辑保持一致
const mockPlaylistsData = (() => {
  const playlists = []
  for (let i = 0; i < 10; i++) { // 生成10个模拟歌单
    const songIndex = i * 3 % mockSongs.length;
    const song = mockSongs[songIndex];
    playlists.push({
      id: `mock-playlist-${i + 1}`,
      name: `模拟歌单 ${i + 1} - ${song.album}`,
      coverImgUrl: song.coverImgUrl,
      description: `这是关于 ${song.album} 的一个很棒的歌单。`,
      songs: mockSongs.slice(songIndex, songIndex + 3) // 模拟每个歌单包含3首歌曲
    });
  }
  return playlists;
})();

/**
 * 模拟获取歌单详情的 API
 * @param {string} id 歌单 ID
 * @returns {Promise<object>} 模拟的 API 响应
 */
export function getPlaylistDetail(id) {
  return new Promise(resolve => {
    setTimeout(() => {
      const playlist = mockPlaylistsData.find(p => p.id === id)
      if (playlist) {
        resolve({
          code: 200,
          data: { // 歌单详情通常会放在 data 字段下
            id: playlist.id,
            name: playlist.name,
            coverImgUrl: playlist.coverImgUrl,
            description: playlist.description
          },
          msg: '获取歌单详情成功'
        })
      } else {
        resolve({
          code: 404,
          msg: '歌单未找到'
        })
      }
    }, 500)
  })
}

/**
 * 模拟获取歌单歌曲列表的 API
 * @param {string} id 歌单 ID
 * @param {number} limit 歌曲数量限制
 * @returns {Promise<object>} 模拟的 API 响应
 */
export function getPlaylistSongs(id, limit = 30) {
  return new Promise(resolve => {
    setTimeout(() => {
      const playlist = mockPlaylistsData.find(p => p.id === id)
      if (playlist) {
        resolve({
          code: 200,
          data: playlist.songs.slice(0, limit),
          msg: '获取歌单歌曲成功'
        })
      } else {
        resolve({
          code: 404,
          msg: '歌单未找到'
        })
      }
    }, 500)
  })
}