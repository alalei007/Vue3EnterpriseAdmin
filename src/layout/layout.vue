<template>
  <div class="flex flex-col h-screen" ref="menuRowRef">
    <el-row tag="header" align="middle" class="h-15 shrink-0">
      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="px-5">
        <div class="flex items-center gap-2 cursor-pointer p-4">
          <img src="/favicon.ico" alt="logo" class="w-8 h-8 object-contain" />
          <h1 class="text-lg font-semibold">管理系统</h1>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="px-5">
        <div class="flex items-center justify-end gap-4 p-4">
          <el-button @click="toggleDark()" round>
            <el-icon>
              <Moon v-if="isDark" />
              <Sunny v-else />
            </el-icon>
            主题切换
          </el-button>
          <el-dropdown>
            <span class="el-dropdown-link flex items-center gap-1 cursor-pointer">
              <span>{{ userInfo.username }}</span>
              <el-avatar size="small" icon="user" />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">注销</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>

    <el-row tag="section" class="flex-1 min-h-0 overflow-hidden">
      <el-col
        tag="aside"
        :xl="4"
        :lg="4"
        :md="2"
        :sm="3"
        :xs="4"
        class="border-gray-200 overflow-auto"
      >
        <div class="p-4">
          <el-menu
            :default-active="defaultActive"
            :collapse="isCollapseMenu"
            class="el-menu-vertical-demo"
            background-color="transparent"
            text-color="#606266"
            active-text-color="#409EFF"
            :router="true"
          >
            <template v-for="item in menus" :key="item.path">
              <el-sub-menu v-if="item.children" :index="item.path">
                <template #title>
                  <el-icon><component :is="item.icon" /></el-icon>
                  <span>{{ item.title }}</span>
                </template>
                <el-menu-item v-for="child in item.children" :key="child.path" :index="child.path">
                  <el-icon><component :is="child.icon" /></el-icon>
                  <span>{{ child.title }}</span>
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :index="item.path">
                <el-icon><component :is="item.icon" /></el-icon>
                <span>{{ item.title }}</span>
              </el-menu-item>
            </template>
          </el-menu>
        </div>
      </el-col>

      <el-col tag="main" :xl="20" :lg="20" :md="22" :sm="21" :xs="20" class="overflow-auto">
        <div class="min-h-full p-4 ml-4">
          <router-view />
        </div>
      </el-col>
    </el-row>

    <el-row
      tag="footer"
      class="h-15 shrink-0 border-gray-200 flex items-center justify-center text-sm"
    >
      © 2025 后台管理系统 版权所有
    </el-row>
  </div>

  <!-- 非响应式版本 -->
  <!-- <div class="bg-gray-50">
    <el-container class="h-screen">
      <el-header>
        <div class="flex justify-between items-center p-4">
          <div class="flex items-center gap-2 cursor-pointer">
            <img src="/favicon.ico" alt="logo" class="w-8 h-8 object-contain" />
            <h1 class="text-lg font-semibold">管理系统</h1>
          </div>
          <div class="flex items-center gap-4">
            <el-button @click="toggleDark()" round>
              <el-icon>
                <Moon v-if="isDark" />
                <Sunny v-else />
              </el-icon>
              主题切换
            </el-button>
            <el-dropdown>
              <span class="el-dropdown-link flex items-center gap-1">
                <span>{{ userInfo.username }}</span>
                <el-avatar size="small" icon="user" />
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">注销</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-container class="flex-1">
        <el-aside width="200px" class="bg-white border-r border-gray-200">
          <div class="p-4">
            <el-menu
              :default-active="defaultActive"
              class="el-menu-vertical-demo"
              background-color="transparent"
              text-color="#606266"
              active-text-color="#409EFF"
              :router="true"
            >
              <template v-for="item in menus" :key="item.path">
                <el-sub-menu v-if="item.children" :index="item.path">
                  <template #title>
                    <el-icon><component :is="item.icon" /></el-icon>
                    <span>{{ item.title }}</span>
                  </template>
                  <el-menu-item
                    v-for="child in item.children"
                    :key="child.path"
                    :index="child.path"
                  >
                    <el-icon><component :is="child.icon" /></el-icon>
                    <span>{{ child.title }}</span>
                  </el-menu-item>
                </el-sub-menu>
                <el-menu-item v-else :index="item.path">
                  <el-icon><component :is="item.icon" /></el-icon>
                  <span>{{ item.title }}</span>
                </el-menu-item>
              </template>
            </el-menu>
          </div>
        </el-aside>
        <el-main class="bg-white ml-4">
          <div class="min-h-full">
            <router-view />
          </div>
        </el-main>
      </el-container>
      <el-footer
        class="flex items-center justify-center h-14 border-t border-gray-200 text-sm text-gray-500 bg-white"
      >
        © 2025 后台管理系统 版权所有
      </el-footer>
    </el-container>
  </div> -->
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { removeRefreshToken, removeToken } from '@/utils/storage'
import { useDark, useToggle } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

defineOptions({
  name: 'AppLayout',
})

const router = useRouter()
const userStore = useUserStore()
const { userInfo, menus } = storeToRefs(userStore)

const isDark = useDark()
const toggleDark = useToggle(isDark)

function handleLogout() {
  removeToken()
  removeRefreshToken()
  userStore.clearUserInfo()
  router.push('/login')
}

const route = useRoute()
const defaultActive = computed(() => {
  return route.path
})

const menuRowRef = ref<HTMLDivElement | null>(null)
const isCollapseMenu = ref(false)

let timer: number | null = null

function updateMenuCollapse() {
  if (menuRowRef.value) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      isCollapseMenu.value = menuRowRef.value!.offsetWidth < 1200
    }, 100)
  }
}

onMounted(() => {
  window.addEventListener('resize', updateMenuCollapse)
  updateMenuCollapse()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateMenuCollapse)
  if (timer) clearTimeout(timer)
})
</script>
