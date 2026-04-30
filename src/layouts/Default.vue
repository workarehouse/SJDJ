<!-- 默认布局 -->
<template>
    <main class="h-full">
        <RouterView v-slot="{ Component }">
            <!-- index 页面缓存，保留表单状态；其他页面 ?t 变化时强制刷新 -->
            <keep-alive :include="['index']">
                <component :is="Component"
                    :key="route.name === 'index' ? 'index' : (String(route.name) + (route.query.t || ''))" />
            </keep-alive>
        </RouterView>
    </main>
</template>

<script lang="ts" setup>
const route = useRoute()
</script>