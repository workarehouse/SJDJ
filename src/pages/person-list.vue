<template>
    <section class="min-h-screen pb-10" style="background: #F5F6F7">
        <!-- 顶部介绍栏 -->
        <div class="bg-white px-4 pt-5 pb-4 shadow-[0_1px_0_0_#e2e8f0]">
            <!-- 头像 + 基本信息 -->
            <div class="flex items-center gap-3.5">
                <!-- 头像 -->
                <div class="relative shrink-0">
                    <div v-if="personAvatar && !avatarLoadError"
                        class="h-14 w-14 overflow-hidden rounded-xl   shadow-sm ring-1 ring-slate-200">
                        <img :src="personAvatar" :alt="personName" class="h-full w-full object-cover"
                            @error="avatarLoadError = true" />
                    </div>
                    <div v-else
                        class="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#267EF0]/10 shadow-sm ring-1 ring-[#267EF0]/20">
                        <span class="text-2xl font-bold text-[#267EF0]">{{ personInitial }}</span>
                    </div>
                </div>
                <!-- 名字 + 职位 -->
                <div class="min-w-0 flex-1">
                    <h2 class="truncate text-base font-bold leading-tight text-slate-900">{{ personName }}</h2>
                    <p v-if="personPost" class="mt-0.5 truncate text-xs text-slate-500">{{ personPost }}</p>
                    <p v-else class="mt-0.5 text-xs text-slate-300">暂无职位信息</p>
                </div>
            </div>

        </div>

        <!-- Header -->
        <div class="sticky top-0 z-20 bg-white shadow-[0_1px_0_0_#e2e8f0]">

            <!-- Tabs + filter row -->
            <div class="flex items-center justify-between px-4 py-2">
                <!-- iOS Segmented Control -->
                <div class="relative flex rounded-lg bg-slate-100 p-0.5">
                    <!-- 滑动指示器 -->
                    <span
                        class="pointer-events-none absolute inset-y-0.5 w-1/3 rounded-md bg-white shadow-sm transition-transform duration-200 ease-out"
                        :style="{ transform: `translateX(${activeTypeIndex * 100}%)` }"></span>
                    <button @click="activeType = 'all'"
                        class="relative z-10 flex-1 whitespace-nowrap rounded-md px-3 py-1 text-xs font-medium transition-colors duration-150"
                        :class="activeType === 'all' ? 'text-slate-800' : 'text-slate-400'">
                        全部 {{ recordCount }}
                    </button>
                    <button @click="activeType = '1'"
                        class="relative z-10 flex-1 whitespace-nowrap rounded-md px-3 py-1 text-xs font-medium transition-colors duration-150"
                        :class="activeType === '1' ? 'text-slate-800' : 'text-slate-400'">
                        督办 {{ superviseCount }}
                    </button>
                    <button @click="activeType = '2'"
                        class="relative z-10 flex-1 whitespace-nowrap rounded-md px-3 py-1 text-xs font-medium transition-colors duration-150"
                        :class="activeType === '2' ? 'text-slate-800' : 'text-slate-400'">
                        备忘录 {{ noteCount }}
                    </button>
                </div>
                <div class="flex items-center gap-1.5">
                    <!-- 搜索图标按钮 -->
                    <button type="button" @click="toggleSearch"
                        class="flex h-6 w-6 items-center justify-center rounded-md border transition-colors"
                        :class="showSearch || keyword ? 'border-[#267EF0]/40 bg-[#267EF0]/10 text-[#267EF0]' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'">
                        <svg class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clip-rule="evenodd" />
                        </svg>
                    </button>
                    <!-- 日期筛选按钮：固定宽度，清除按钮内嵌 -->
                    <div class="flex h-6 items-center rounded-md border transition-colors"
                        :class="hasDateFilter ? 'border-[#267EF0]/40 bg-[#267EF0]/10 text-[#267EF0]' : 'border-slate-200 bg-white text-slate-500'">
                        <button type="button" @click="showDatePicker = true"
                            class="flex items-center gap-1 pl-2 pr-1.5 text-[11px] font-medium">
                            <svg class="h-3 w-3 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                    clip-rule="evenodd" />
                            </svg>
                            <span class=" truncate text-center">{{ hasDateFilter ? dateRange : '日期筛选' }}</span>
                        </button>
                        <!-- 内嵌清除按钮 -->
                        <button v-if="hasDateFilter" type="button" @click.stop="clearDateFilter"
                            class="flex h-full items-center border-l border-[#267EF0]/20 px-1.5 transition-colors hover:bg-[#267EF0]/20">
                            <svg class="h-2.5 w-2.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- 可折叠搜索框 -->
            <Transition enter-active-class="transition-all duration-200 ease-out"
                enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-150 ease-in" leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-1">
                <div v-if="showSearch" class="border-t border-slate-100 px-4 py-2.5">
                    <div class="relative flex items-center">
                        <svg class="pointer-events-none absolute left-3 h-3.5 w-3.5 text-slate-400" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clip-rule="evenodd" />
                        </svg>
                        <input ref="searchInputRef" v-model="keyword" type="text" placeholder="关键字搜索…"
                            class="w-full cursor-text rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-8 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:border-[#267EF0]/40 focus:bg-white focus:ring-2 focus:ring-[#267EF0]/10"
                            @input="onKeywordInput" />
                        <button v-if="keyword" type="button" @click="clearKeyword"
                            class="absolute right-2.5 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-slate-300 text-white transition-colors duration-150 hover:bg-slate-500">
                            <svg class="h-2.5 w-2.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </Transition>
        </div>

        <!-- Records -->
        <div class="mx-auto w-full max-w-md px-4 pt-4 space-y-3">
            <article v-for="item in filteredPersonRecords" :key="item.id"
                class="overflow-hidden rounded-xl bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.08)]">

                <!-- Card Body -->
                <div class="px-4 pt-3 pb-3.5">
                    <!-- 类型行 -->
                    <div class="mb-2.5 flex items-center gap-2">
                        <!-- 类型：iOS SF Symbol 风格胶囊，纯色填充 + 系统字重 -->
                        <span
                            class="inline-flex items-center gap-1 rounded-full px-2.5 py-[3px] text-[11px] font-semibold"
                            :class="item.logsty === '1' ? 'bg-[#267EF0]/10 text-[#267EF0]' : 'bg-[#8E8E93]/10 text-[#8E8E93]'"
                            style="-webkit-font-smoothing: antialiased; letter-spacing: -0.1px;">
                            {{ item.logstytxt }}
                        </span>
                        <!-- 进行中/已作废：极弱，斜杠前缀纯文字 -->
                        <span v-if="item.logsty === '1'" class="text-[10px] text-slate-300">
                            / {{ item.state === 'C' ? '进行中' : '已作废' }}
                        </span>
                        <!-- kpi：仅备忘录显示 -->
                        <span v-if="item.logsty === '2' && item.kpistytxt" class="ml-auto text-[10px] text-slate-400">
                            {{ item.kpistytxt }}
                        </span>
                    </div>
                    <!-- 内容 -->
                    <p class="text-sm leading-relaxed text-slate-800">{{ item.eventmsg }}</p>

                    <!-- 日期信息 -->
                    <div class="mt-3 border-t border-slate-100 pt-2.5">
                        <template v-if="item.logsty === '1'">
                            <div class="grid grid-cols-2 gap-x-4 gap-y-1">
                                <div>
                                    <p class="text-[10px] font-medium uppercase tracking-wide text-slate-400">下达日期</p>
                                    <p class="mt-0.5 text-xs  text-slate-700">{{ item.credat }}</p>
                                </div>
                                <div>
                                    <p class="text-[10px] font-medium uppercase tracking-wide text-slate-400">计划完成日期</p>
                                    <p class="mt-0.5 text-xs  text-slate-700">{{ item.findat }}</p>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div>
                                <p class="text-[10px] font-medium uppercase tracking-wide text-slate-400">记录时间</p>
                                <p class="mt-0.5 text-xs  text-slate-700">{{ item.credat }}</p>
                            </div>
                        </template>
                    </div>
                </div>
            </article>

            <!-- Empty state -->
            <div v-if="filteredPersonRecords.length === 0"
                class="flex flex-col items-center justify-center rounded-xl bg-white px-4 py-16 text-center shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]">
                <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-300">
                    <svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <p class="text-sm font-medium text-slate-600">暂无备忘录</p>
                <p class="mt-1 text-xs text-slate-400">当前筛选范围内没有相关数据</p>
            </div>
        </div>

        <van-calendar v-model:show="showDatePicker" type="range" :show-confirm="false" color="#267EF0"
            :min-date="new Date(2000, 0, 1)" :max-date="new Date()" @confirm="onDateConfirm"
            @cancel="showDatePicker = false" />
    </section>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import { useRoute } from 'vue-router'
import http from '@/utils/http'

const route = useRoute()

const personName = computed(() => {
    const name = route.query.name
    return typeof name === 'string' && name ? name : '查询人员'
})

const personPost = computed(() => {
    const post = route.query.post
    return typeof post === 'string' && post ? post : ''
})

const personAvatar = computed(() => {
    const avatar = route.query.avatar
    return typeof avatar === 'string' && avatar ? avatar : ''
})

// 头像加载失败时回退到首字母
const avatarLoadError = ref(false)

const personInitial = computed(() => personName.value.charAt(0))

const showDatePicker = ref(false)
const showSearch = ref(false)
const searchInputRef = ref(null)
const selectedDateRange = ref([])
const activeType = ref('all')
const personRecords = ref([])
const keyword = ref('')
let searchTimer = null

const fetchRecords = async () => {
    const [bdat, edat] = selectedDateRange.value.length === 2
        ? [
            selectedDateRange.value[0] + ' 00:00:00',
            selectedDateRange.value[1] + ' 23:59:59',
        ]
        : ['', '']
    const result = await http.post('/searchevents', {
        acct: route.query.acct ?? '',
        bdat,
        edat,
        keyword: keyword.value,
    })
    personRecords.value = result ?? []
}

const onKeywordInput = () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
        fetchRecords()
    }, 400)
}

const toggleSearch = async () => {
    showSearch.value = !showSearch.value
    if (showSearch.value) {
        await nextTick()
        searchInputRef.value?.focus()
    } else {
        // 关闭时清空关键字并重新请求
        if (keyword.value) {
            keyword.value = ''
            fetchRecords()
        }
    }
}

const clearKeyword = () => {
    keyword.value = ''
    fetchRecords()
}

const hasDateFilter = computed(() => selectedDateRange.value.length === 2)

const dateRange = computed(() => {
    if (!hasDateFilter.value) return ''
    // 同年只显示月日，跨年时展示年份
    const start = dayjs(selectedDateRange.value[0])
    const end = dayjs(selectedDateRange.value[1])
    const sameYear = start.year() === end.year()
    if (sameYear) {
        return `${start.format('M/D')}~${end.format('M/D')}`
    }
    return `${start.format('YY/M/D')}~${end.format('YY/M/D')}`
})

const filteredPersonRecords = computed(() => {
    if (activeType.value === 'all') return personRecords.value
    return personRecords.value.filter(item => item.logsty === activeType.value)
})

const activeTypeIndex = computed(() => {
    if (activeType.value === 'all') return 0
    if (activeType.value === '1') return 1
    return 2
})

const recordCount = computed(() => personRecords.value.length)
const superviseCount = computed(() => personRecords.value.filter(i => i.logsty === '1').length)
const noteCount = computed(() => personRecords.value.filter(i => i.logsty === '2').length)

const onDateConfirm = (value) => {
    if (!Array.isArray(value) || value.length !== 2) return
    selectedDateRange.value = value.map(date => dayjs(date).format('YYYY-MM-DD'))
    showDatePicker.value = false
    fetchRecords()
}

const clearDateFilter = () => {
    selectedDateRange.value = []
    fetchRecords()
}

onMounted(() => {
    fetchRecords()
})
</script>

<style scoped></style>

<route lang="yaml">
meta:
    title: 
    layout: Default
</route>
