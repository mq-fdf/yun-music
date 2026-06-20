/**
 * 格式化时间 (秒 -> mm:ss)
 * @param {number} second 
 */
export const formatTime = (second) => {
  if (!second) return '00:00'
  const min = Math.floor(second / 60)
  const sec = Math.floor(second % 60)
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
}

/**
 * 格式化播放量
 * @param {number} count 
 */
export const formatCount = (count) => {
  if (count < 10000) return count
  if (count < 100000000) return (count / 10000).toFixed(1) + '万'
  return (count / 100000000).toFixed(1) + '亿'
}
