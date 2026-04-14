<template>
  <div class="flex items-center justify-end min-h-screen bg-gray-100">
    <el-card class="w-[400px] p-6 mr-24">
      <h2 class="text-2xl font-bold mb-6 text-center">登录</h2>
      <el-form :model="form" :rules="rules" @submit.prevent="handleLogin">
        <el-form-item label="用户名" :label-width="80" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" :label-width="80" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="w-full" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
import { login } from '@/api/user'
import router from '@/router'
import type { LoginData } from '@/types/user'
import { setRefreshToken, setToken } from '@/utils/storage'
const form = reactive({
  username: '',
  password: '',
})
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}
const handleLogin = async () => {
  const res = await login(form.username, form.password)
  const data: LoginData = res.data
  setToken(data.token)
  setRefreshToken(data.refreshToken)

  router.push('/dashboard')
}
</script>
