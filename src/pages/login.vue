<template>
    <div v-show="token" class="flex h-screen w-full items-center justify-center bg-gray-50">
        <div class="text-center">
            <div class="mb-4 flex justify-center">
                <!-- 加载中的旋转图标 -->
                <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
            </div>
            <h2 class="mb-2 text-xl font-semibold text-gray-800">正在登录中...</h2>
        </div>
    </div>
</template>

<script setup lang="ts">
import store from 'store'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
// 从路由中获取token, 并设置到authStore中
const { token } = route.query

onMounted(() => {
    console.log('Login page mounted');

    if (token) {
        store.set('token', token)
    }
})
</script>