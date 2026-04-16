<template>
    <section class="min-h-screen bg-[linear-gradient(180deg,#e9eef5_0%,#f2f5f9_45%,#f5f7fb_100%)] pb-6">
        <div class="sticky top-0 z-20 border-b border-slate-300/80 bg-slate-100/95 backdrop-blur-sm">
            <div class="mx-auto flex w-full max-w-md items-center gap-2 px-3 py-3">
                <RouterLink :to="backToHome"
                    class="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-700 transition-colors hover:bg-slate-200">
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.5 16.5L5 9L12.5 1.5" stroke="currentColor" stroke-width="1.5"
                            stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </RouterLink>
                <div class="min-w-0 flex-1">
                    <h1 class="truncate text-sm font-semibold tracking-tight text-slate-900">{{ personName }} · 事项清单
                    </h1>
                    <p class="text-xs text-slate-600">共 {{ recordCount }} 条记录</p>
                </div>
            </div>
        </div>

        <div class="mx-auto mt-2 w-full max-w-md px-3">
            <div
                class="rounded-md border border-slate-300/90 bg-white/90 p-3 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.55)]">
                <div class="flex items-center justify-between text-xs text-slate-600">
                    <p class="font-medium text-slate-800">分类</p>
                    <div class="flex items-center gap-2">
                        <button type="button" @click="showDatePicker = true"
                            class="rounded-md border px-2 py-1 text-[11px] font-semibold transition-colors" :class="hasDateFilter
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'">
                            日期：{{ dateRange }}
                        </button>
                        <button v-if="hasDateFilter" type="button" @click="clearDateFilter"
                            class="rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-50">
                            清空
                        </button>
                    </div>
                </div>
                <div class="mt-2 flex items-center gap-2 overflow-x-auto pb-1">
                    <span
                        class="inline-flex rounded-full border border-slate-300 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                        全部
                    </span>
                    <span
                        class="inline-flex rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                        督办 {{ superviseCount }}
                    </span>
                    <span
                        class="inline-flex rounded-full border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                        记事 {{ noteCount }}
                    </span>
                </div>
            </div>

            <div class="mt-2 space-y-2">
                <article v-for="item in filteredPersonRecords" :key="item.id"
                    class="relative overflow-hidden rounded-md border border-slate-300 bg-white shadow-[0_10px_22px_-18px_rgba(15,23,42,0.45)]">
                    <div class="absolute left-0 top-0 h-full w-1" :class="typeStripeClass(item.type)"></div>
                    <div class="px-4 py-3">
                        <div class="flex items-center gap-2">
                            <div class="inline-flex items-center gap-2">
                                <span class="rounded-md px-2 py-1 text-[11px] font-semibold"
                                    :class="typeBadgeClass(item.type)">
                                    {{ item.type }}
                                </span>
                                <span v-if="item.type === '督办'" class="rounded-md px-2 py-1 text-[11px] font-semibold"
                                    :class="statusBadgeClass(item.status)">
                                    {{ item.status }}
                                </span>
                            </div>
                        </div>

                        <div class="mt-2 grid grid-cols-[4.5rem_1fr] gap-x-2 gap-y-1.5 text-sm leading-5">
                            <template v-if="item.type === '督办'">
                                <span class="text-slate-500">完成事件</span>
                                <p class="font-medium text-slate-900">{{ item.content }}</p>

                                <span class="text-slate-500">完成时间</span>
                                <p class="font-medium text-slate-800">{{ item.finishedAt }}</p>
                            </template>

                            <template v-else>
                                <span class="text-slate-500">事件内容</span>
                                <p class="font-medium text-slate-900">{{ item.content }}</p>

                                <span class="text-slate-500">记录时间</span>
                                <p class="font-medium text-slate-800">{{ item.recordedAt }}</p>
                            </template>
                        </div>
                    </div>
                </article>

                <div v-if="filteredPersonRecords.length === 0"
                    class="rounded-md border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-500">
                    当前日期范围内暂无记录
                </div>
            </div>
        </div>

        <van-calendar v-model:show="showDatePicker" type="range" :show-confirm="false" color="#16a34a"
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
