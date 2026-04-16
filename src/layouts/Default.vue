<!-- 默认布局 -->
<template>
    <main class="h-full">
        <!-- t 更新时刷新页面  -->
        <RouterView :key="route.name + route.query.t" />
    </main>
</template>

<script lang="ts" setup>
const route = useRoute()
</script>
