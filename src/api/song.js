import { mockSongs } from '@/mock/mockData'

/**
 * 模拟搜索歌曲的 API
 * @param {string} keywords 搜索关键词
 * @returns {Promise<object>} 模拟的 API 响应
 */
export function searchSongs(keywords) {
  return new Promise(resolve => {
    setTimeout(() => {
      const lowerCaseKeywords = keywords.toLowerCase()
      const filteredSongs = mockSongs.filter(song =>
        song.name.toLowerCase().includes(lowerCaseKeywords) ||
        song.artist.toLowerCase().includes(lowerCaseKeywords) ||
        song.album.toLowerCase().includes(lowerCaseKeywords)
      )

      resolve({
        code: 200,
        data: {
          records: filteredSongs,
          total: filteredSongs.length
        },
        msg: '搜索成功'
      })
    }, 100) // 模拟网络延迟
  })
}



// 模拟获取歌曲详情的 API (用于 SongDetail.vue)
export function getSongDetail(id) {
  return new Promise(resolve => {
    setTimeout(() => {
      const song = mockSongs.find(s => s.id == id)

      if (song) {
        resolve({
          code: 200,
          data: song,
          msg: '获取歌曲详情成功'
        })
      } else {
        resolve({
          code: 404,
          msg: '歌曲未找到'
        })
      }
    }, 500)
  })
}

/**
 * 模拟批量获取歌曲播放地址的 API
 * @param {Array<string>} songIdList 歌曲 ID 列表
 * @returns {Promise<object>} 模拟的 API 响应
 */
export function getSongPlayUrlBatch(songIdList) {
  return new Promise(resolve => {
    setTimeout(() => {
      const playUrls = songIdList.map(id => {
        const song = mockSongs.find(s => s.id == id);
        return {
          id: id,
          url: song.musicUrl
        };
      });

      resolve({
        code: 200,
        data: playUrls,
        msg: '批量获取歌曲播放地址成功'
      });
    }, 300);
  });
}

/**
 * 模拟获取歌曲歌词的 API
 * @param {number|string} id 歌曲 ID
 * @returns {Promise<object>} 模拟的 API 响应
 */
export function getLyric(id) {
  return new Promise(resolve => {
    setTimeout(() => {
      const song = mockSongs.find(s => s.id == id)
      if (song && song.lyric) {
        resolve({
          code: 200,
          lyric: song.lyric,
          msg: '获取歌词成功'
        })
      } else {
        resolve({
          code: 404,
          msg: '歌词未找到或歌曲不存在'
        })
      }
    }, 300)
  })
}

/**
 * 模拟获取搜索建议的 API
 * @param {string} keywords 搜索关键词
 * @returns {Promise<Array<object>>} 模拟的搜索建议列表
 */
export function getSearchSuggestions(keywords) {
  return new Promise(resolve => {
    setTimeout(() => {
      const lowerCaseKeywords = keywords.toLowerCase()
      const suggestions = []

      // 从歌曲名称中查找建议
      mockSongs.forEach(song => {
        if (song.name.toLowerCase().includes(lowerCaseKeywords)) {
          suggestions.push({ value: song.name, category: '歌曲' })
        }
        if (song.artist.toLowerCase().includes(lowerCaseKeywords) && !suggestions.some(s => s.value === song.artist)) {
          suggestions.push({ value: song.artist, category: '歌手' })
        }
        if (song.album.toLowerCase().includes(lowerCaseKeywords) && !suggestions.some(s => s.value === song.album)) {
          suggestions.push({ value: song.album, category: '专辑' })
        }
      })

      // 限制建议数量，并去重
      const uniqueSuggestions = Array.from(new Set(suggestions.map(s => s.value)))
        .map(value => suggestions.find(s => s.value === value))
        .slice(0, 8); // 最多返回8个建议

      resolve(uniqueSuggestions)
    }, 200) // 模拟网络延迟
  })
}
