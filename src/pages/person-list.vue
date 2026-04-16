<template>
    <section class="min-h-screen pb-10" style="background: #f0f4f8">
        <!-- Header -->
        <div class="sticky top-0 z-20 bg-white shadow-[0_1px_0_0_#e2e8f0]">
            <div class="mx-auto flex w-full max-w-md items-center gap-3 px-4 py-3">
                <RouterLink :to="backToHome"
                    class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50">
                    <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none">
                        <path d="M12.5 16.5L5 9L12.5 1.5" stroke="currentColor" stroke-width="1.75"
                            stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </RouterLink>
                <div class="min-w-0 flex-1">
                    <h1 class="truncate text-[15px] font-semibold text-slate-900">{{ personName }}</h1>
                    <p class="text-[11px] text-slate-400">事项清单 · 共 {{ recordCount }} 条</p>
                </div>
                <div
                    class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {{ personName.charAt(0) }}
                </div>
            </div>

            <!-- Tabs + filter row -->
            <div class="flex items-center justify-between border-t border-slate-100 px-4 py-2">
                <div class="flex items-center gap-1">
                    <button
                        class="rounded-md px-3 py-1 text-xs font-semibold transition-colors bg-slate-900 text-white">
                        全部 {{ recordCount }}
                    </button>
                    <button
                        class="rounded-md px-3 py-1 text-xs font-semibold transition-colors text-slate-500 hover:bg-slate-100">
                        督办 {{ superviseCount }}
                    </button>
                    <button
                        class="rounded-md px-3 py-1 text-xs font-semibold transition-colors text-slate-500 hover:bg-slate-100">
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
                        <span class="text-[11px] font-semibold"
                            :class="item.type === '督办' ? 'text-blue-600' : 'text-slate-400'">
                            {{ item.type }}
                        </span>
                        <span v-if="item.type === '督办'" class="text-[11px]"
                            :class="item.status === '进行中' ? 'text-amber-500' : 'text-emerald-500'">
                            {{ item.status }}
                        </span>
                    </div>
                    <!-- 事件内容 -->
                    <p class="text-sm leading-relaxed text-slate-800">{{ item.content }}</p>

                    <!-- 日期信息 -->
                    <div class="mt-3 border-t border-slate-100 pt-2.5">
                        <template v-if="item.type === '督办'">
                            <div class="grid grid-cols-2 gap-x-4 gap-y-1">
                                <div>
                                    <p class="text-[10px] font-medium uppercase tracking-wide text-slate-400">下达日期</p>
                                    <p class="mt-0.5 text-xs font-semibold text-slate-700">{{ item.assignedAt }}</p>
                                </div>
                                <div>
                                    <p class="text-[10px] font-medium uppercase tracking-wide text-slate-400">完成日期</p>
                                    <p class="mt-0.5 text-xs font-semibold text-slate-700">{{ item.finishedAt }}</p>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div>
                                <p class="text-[10px] font-medium uppercase tracking-wide text-slate-400">记录时间</p>
                                <p class="mt-0.5 text-xs font-semibold text-slate-700">{{ item.recordedAt }}</p>
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
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import { useRoute } from 'vue-router'

const route = useRoute()

const personName = computed(() => {
    const name = route.query.name
    return typeof name === 'string' && name ? name : '查询人员'
})

const backToHome = computed(() => {
    const tab = route.query.tab
    return {
        path: '/',
        query: {
            tab: tab === 'query' || tab === 'record' ? tab : 'query',
        },
    }
})

const showDatePicker = ref(false)
const selectedDateRange = ref([])

const hasDateFilter = computed(() => selectedDateRange.value.length === 2)

const dateRange = computed(() => {
    if (!hasDateFilter.value) {
        return 'XX年X月X日 - XX年X月X日'
    }
    return `${dayjs(selectedDateRange.value[0]).format('YYYY年M月D日')} - ${dayjs(selectedDateRange.value[1]).format('YYYY年M月D日')}`
})

const personRecords = computed(() => {
    const baseName = personName.value
    return [
        {
            id: 1,
            type: '督办',
            status: '进行中',
            content: `${baseName} 跟进 XX 任务，明确完成标准并按节点推进`,
            assignedAt: '2026年4月1日',
            finishedAt: '2026年4月30日',
            finishedDate: '2026-04-30',
            recordedAt: '2026年4月30日',
            recordedDate: '2026-04-30',
        },
        {
            id: 2,
            type: '记事',
            status: '已记录',
            content: `${baseName} 对 XX 执行偏差进行说明并形成复盘要点`,
            assignedAt: '2026年4月10日',
            finishedAt: '2026年4月13日',
            finishedDate: '2026-04-13',
            recordedAt: '2026年4月13日',
            recordedDate: '2026-04-13',
        },
        {
            id: 3,
            type: '记事',
            status: '已记录',
            content: `${baseName} 完成 XX 情况汇总并提交阶段性说明`,
            assignedAt: '2026年3月25日',
            finishedAt: '2026年3月30日',
            finishedDate: '2026-03-30',
            recordedAt: '2026年3月30日',
            recordedDate: '2026-03-30',
        },
    ]
})

const filteredPersonRecords = computed(() => {
    if (!hasDateFilter.value) {
        return personRecords.value
    }

    const [start, end] = selectedDateRange.value
    return personRecords.value.filter((item) => {
        const targetDate = item.type === '督办' ? item.finishedDate : item.recordedDate
        if (!targetDate) {
            return false
        }
        const dateValue = dayjs(targetDate)
        return (dateValue.isAfter(dayjs(start).subtract(1, 'day'))
            && dateValue.isBefore(dayjs(end).add(1, 'day')))
    })
})

const recordCount = computed(() => filteredPersonRecords.value.length)

const superviseCount = computed(() => personRecords.value.filter(item => item.type === '督办').length)

const noteCount = computed(() => personRecords.value.filter(item => item.type === '记事').length)

const typeBadgeClass = (type) => {
    if (type === '督办') {
        return 'border border-blue-200 bg-blue-50 text-blue-700'
    }
    return 'border border-slate-300 bg-slate-100 text-slate-700'
}

const typeStripeClass = (type) => {
    return type === '督办' ? 'bg-blue-500' : 'bg-slate-400'
}

const statusBadgeClass = (status) => {
    if (status === '进行中') {
        return 'border border-amber-200 bg-amber-50 text-amber-700'
    }
    return 'border border-emerald-200 bg-emerald-50 text-emerald-700'
}

const onDateConfirm = (value) => {
    if (!Array.isArray(value) || value.length !== 2) {
        return
    }

    const normalizedRange = value.map(date => dayjs(date).format('YYYY-MM-DD'))
    selectedDateRange.value = normalizedRange
    showDatePicker.value = false
}

const clearDateFilter = () => {
    selectedDateRange.value = []
}
</script>

<style scoped></style>

<route lang="yaml">
meta:
    title: 人员列表
    layout: Default
</route>
