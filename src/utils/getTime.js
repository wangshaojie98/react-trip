export default function getTime () {
  let now = new Date()
  let year = now.getFullYear() // 年
  let month = now.getMonth() + 1 // 月
  let day = now.getDate() // 日

  let hh = now.getHours() // 时
  let mm = now.getMinutes() // 分
  let ss = now.getSeconds()

  let time = {
    date1: `${year}年${month}月${day}日`,
    date2: `${year}/${month}/${day}`,
    date3: `${year}年${month}月${day}日/${hh}:${mm}:${ss}`,
    date4: `${hh}:${mm}:${ss}`
  }
  return time
}