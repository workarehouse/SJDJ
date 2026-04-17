<template>
    <section class="min-h-screen pb-10" style="background: #f0f4f8">
        <!-- Header -->
        <div class="sticky top-0 z-20 bg-white shadow-[0_1px_0_0_#e2e8f0]">

            <!-- Search row -->
            <div class="px-4 py-2.5">
                <div class="relative flex items-center">
                    <svg class="pointer-events-none absolute left-3 h-3.5 w-3.5 text-slate-400" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clip-rule="evenodd" />
                    </svg>
                    <input v-model="keyword" type="text" placeholder="关键字搜素…"
                        class="w-full cursor-text rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-8 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
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

            <!-- Tabs + filter row -->
            <div class="flex items-center justify-between border-t border-slate-100 px-4 py-2">
                <div class="flex items-center gap-1">
                    <button @click="activeType = 'all'"
                        class="rounded-md px-3 py-1 text-xs font-semibold transition-colors"
                        :class="activeType === 'all' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'">
                        全部 {{ recordCount }}
                    </button>
                    <button @click="activeType = '1'"
                        class="rounded-md px-3 py-1 text-xs font-semibold transition-colors"
                        :class="activeType === '1' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'">
                        督办 {{ superviseCount }}
                    </button>
                    <button @click="activeType = '2'"
                        class="rounded-md px-3 py-1 text-xs font-semibold transition-colors"
                        :class="activeType === '2' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'">
                        记事 {{ noteCount }}
                    </button>
                </div>
                <div class="flex items-center gap-1.5">
                    <button type="button" @click="showDatePicker = true"
                        class="flex items-center gap-1 rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors"
                        :class="hasDateFilter ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'">
                        <svg class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                clip-rule="evenodd" />
                        </svg>
                        {{ hasDateFilter ? dateRange : '日期筛选' }}
                    </button>
                    <button v-if="hasDateFilter" type="button" @click="clearDateFilter"
                        class="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 hover:text-slate-600">
                        <svg class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Records -->
        <div class="mx-auto w-full max-w-md px-4 pt-4 space-y-3">
            <article v-for="item in filteredPersonRecords" :key="item.id"
                class="overflow-hidden rounded-xl bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.08)]">

                <!-- Card Body -->
                <div class="px-4 pt-3 pb-3.5">
                    <!-- 类型行 -->
                    <div class="mb-2.5 flex items-center gap-2">
                        <!-- 类型：主角，实色 badge -->
                        <span class="inline-flex items-center rounded px-2 py-0.5 text-[11px] font-bold tracking-wide"
                            :class="item.logsty === '1' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'">
                            {{ item.logstytxt }}
                        </span>
                        <!-- 进行中/已作废：辅助信息，小圆点 + 轻文字 -->
                        <span v-if="item.logsty === '1'" class="flex items-center gap-1 text-[10px] text-slate-400">
                            <span class="inline-block h-1.5 w-1.5 rounded-full"
                                :class="item.state === 'C' ? 'bg-amber-400' : 'bg-slate-300'"></span>
                            {{ item.state === 'C' ? '进行中' : '已作废' }}
                        </span>
                        <!-- kpi：最弱，纯文字提示 -->
                        <span v-if="item.kpistytxt" class="ml-auto text-[10px] text-slate-400">
                            {{ item.kpistytxt }}
                        </span>
                    </div>
                    <!-- 事件内容 -->
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
                                    <p class="text-[10px] font-medium uppercase tracking-wide text-slate-400">完成日期</p>
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
                <p class="text-sm font-medium text-slate-600">暂无事项记录</p>
                <p class="mt-1 text-xs text-slate-400">当前筛选范围内没有相关数据</p>
            </div>
        </div>

        <van-calendar v-model:show="showDatePicker" type="range" :show-confirm="false" color="#2563eb"
            @confirm="onDateConfirm" @cancel="showDatePicker = false" />
    </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import { useRoute } from 'vue-router'
import http from '@/utils/http'

const route = useRoute()

const personName = computed(() => {
    const name = route.query.name
    return typeof name === 'string' && name ? name : '查询人员'
})

const showDatePicker = ref(false)
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

const clearKeyword = () => {
    keyword.value = ''
    fetchRecords()
}

const hasDateFilter = computed(() => selectedDateRange.value.length === 2)

const dateRange = computed(() => {
    if (!hasDateFilter.value) return ''
    return `${dayjs(selectedDateRange.value[0]).format('YYYY年M月D日')} - ${dayjs(selectedDateRange.value[1]).format('YYYY年M月D日')}`
})

const filteredPersonRecords = computed(() => {
    if (activeType.value === 'all') return personRecords.value
    return personRecords.value.filter(item => item.logsty === activeType.value)
})

const recordCount = computed(() => filteredPersonRecords.value.length)
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
    title: 人员列表
    layout: Default
</route>
