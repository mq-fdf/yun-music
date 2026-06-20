import Mock from 'mockjs'

export default [
  {
    url: '/personalized',
    method: 'get',
    response: () => {
      return {
        code: 200,
        result: Mock.mock({
          'result|10': [{
            'id|+1': 1001,
            'name': '@ctitle(5, 10)',
            'picUrl': '@image("300x300", "#c20c0c", "歌单封面")',
            'playCount|10000-1000000': 1,
            'creator': {
              'avatarUrl': '@image("100x100")',
              'nickname': '@cname'
            }
          }]
        }).result
      }
    }
  },
  {
    url: '/playlist/detail',
    method: 'get',
    response: ({ query }) => {
      const id = query.id || 1001
      return {
        code: 200,
        playlist: Mock.mock({
          id: id,
          name: '精选歌单 ' + id,
          coverImgUrl: '@image("300x300", "#c20c0c", "歌单")',
          description: '@csentence(20, 50)',
          trackCount: 20,
          'tracks|20': [{
            'id|+1': 100001,
            'name': '@ctitle(3, 8)',
            'ar|1-3': [{
              id: '@id',
              name: '@cname'
            }],
            'al': {
              id: '@id',
              name: '@ctitle(3, 6)',
              picUrl: '@image("300x300")'
            },
            'dt|200000-400000': 1
          }]
        })
      }
    }
  },
  {
    url: '/search',
    method: 'get',
    response: ({ query }) => {
      const keywords = query.keywords || '音乐'
      return {
        code: 200,
        result: {
          songs: Mock.mock({
            'songs|30': [{
              'id|+1': 200001,
              'name': keywords + '@ctitle(1, 5)',
              'ar|1-3': [{
                id: '@id',
                name: '@cname'
              }],
              'al': {
                id: '@id',
                name: '@ctitle(3, 6)',
                picUrl: '@image("300x300")'
              },
              'dt|200000-400000': 1
            }]
          }).songs
        }
      }
    }
  },
  {
    url: '/lyric',
    method: 'get',
    response: () => {
      const lrcText = `[00:00.00]歌曲标题
[00:03.00]演唱：歌手名
[00:06.00]
[00:08.50]这是第一句歌词
[00:12.30]第二句歌词跟着唱
[00:16.00]第三句歌词很精彩
[00:20.45]第四句旋律很优美
[00:24.00]副歌部分很动人
[00:28.20]让我们一起摇摆
[00:32.00]音乐是心灵的慰藉
[00:36.50]快乐就在这里
[00:40.00]继续这段旅程
[00:44.30]我们永远在一起
[00:48.00]啦啦啦啦啦
[00:52.50]歌声传四方`
      
      return {
        code: 200,
        lrc: {
          lyric: lrcText
        }
      }
    }
  },
  {
    url: '/search/hot',
    method: 'get',
    response: () => {
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
  },
  {
    url: '/song/detail',
    method: 'get',
    response: ({ query }) => {
      const ids = query.ids || '100001'
      return {
        code: 200,
        songs: [Mock.mock({
          id: ids.split(',')[0],
          name: '@ctitle(3, 8)',
          'ar|1-3': [{ id: '@id', name: '@cname' }],
          'al': { id: '@id', name: '@ctitle(3, 6)', picUrl: '@image("300x300")' }
        })]
      }
    }
  }
]
