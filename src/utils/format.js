/**
 * 格式化秒数为 mm:ss
 * @param {number} seconds 
 * @returns {string}
 */
export const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '00:00'
  const min = Math.floor(seconds / 60)
  const sec = Math.floor(seconds % 60)
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
}
