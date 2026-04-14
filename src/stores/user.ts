import type { MenuObj, UserInfo, userInfoData } from '@/types/user'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { getUserInfo } from '@/api/user'
import { removeToken } from '@/utils/storage'

export const useUserStore = defineStore('user', () => {
  const initialUserInfo: UserInfo = {
    userId: '',
    username: '',
    nickname: '',
    phone: '',
    email: '',
    avatar: '',
    status: 1,
    createTime: '',
  }
  let userInfo = reactive(initialUserInfo)
  const roles = ref<string[]>([])
  const menus = ref<Array<MenuObj>>([])

  function clearUserInfo() {
    Object.assign(userInfo, initialUserInfo)
    roles.value = []
    menus.value = []
  }

  async function updateUserInfo() {
    // Implementation for fetching user info
    const token = localStorage.getItem('token')
    console.log(token, 'eee')
    if (!token) {
      return
    }
    if (!userInfo.userId) {
      try {
        const response = await getUserInfo()
        const data: userInfoData = response.data
        userInfo = data.userInfo
        roles.value = data.roles
        menus.value = data.menus
      } catch (error) {
        clearUserInfo()
        removeToken()
      }
    }
  }

  return {
    userInfo,
    roles,
    menus,
    updateUserInfo,
    clearUserInfo,
  }
})
