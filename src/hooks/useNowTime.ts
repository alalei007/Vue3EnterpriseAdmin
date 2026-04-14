import { onMounted, onUnmounted, ref } from 'vue'

export function useNowTime() {
  const currentTime = ref<string>('')
  let timer: number | null = null

  function formatDateTime(time: Date) {
    const year = time.getFullYear()
    const month = (time.getMonth() + 1).toString().padStart(2, '0')
    const day = time.getDate().toString().padStart(2, '0')
    const hours = time.getHours().toString().padStart(2, '0')
    const minutes = time.getMinutes().toString().padStart(2, '0')
    const seconds = time.getSeconds().toString().padStart(2, '0')
    const week = '日一二三四五六'[time.getDay()]

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} 星期${week}`
  }

  function updateTime() {
    currentTime.value = formatDateTime(new Date())
  }

  onMounted(() => {
    updateTime()
    timer = setInterval(updateTime, 1000)
  })

  onUnmounted(() => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  })

  return {
    currentTime,
  }
}
