<template>
    <section class="pb-28 min-h-screen">
        <!-- Sticky Header + Tabs -->
        <div class="sticky top-0 z-30 bg-gradient-to-b from-white to-[#F5F6F7] backdrop-blur-xl">
            <div class="mx-auto w-full max-w-md">
                <!-- Tab Switcher -->
                <div class="px-3 pt-5 py-3 ">
                    <div
                        class="relative grid grid-cols-2 rounded-xl bg-[#EBEBEB] p-1 text-center text-sm font-semibold">
                        <span
                            class="pointer-events-none absolute bottom-1 left-1 top-1 w-[calc(50%-0.25rem)] rounded-lg bg-white shadow-[0_2px_10px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.06)]"
                            :class="[
                                activeTab === 'query' ? 'translate-x-full' : 'translate-x-0',
                                isRestoringTab ? 'transition-none' : 'transition-transform duration-250 ease-out',
                            ]"></span>
                        <button class="relative z-10 rounded-lg py-2 transition-colors duration-200"
                            :class="activeTab === 'record' ? 'text-[#267EF0]' : 'text-slate-500 hover:text-slate-700'"
                            @click="switchTab('record')">
                            记录
                        </button>
                        <button class="relative z-10 rounded-lg py-2 transition-colors duration-200"
                            :class="activeTab === 'query' ? 'text-[#267EF0]' : 'text-slate-500 hover:text-slate-700'"
                            @click="switchTab('query')">
                            查询
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="mx-auto w-full max-w-md   ">
            <Transition :css="!isRestoringTab" mode="out-in" enter-active-class="transition-all duration-220 ease-out"
                leave-active-class="transition-all duration-160 ease-in"
                :enter-from-class="tabDirection === 'right' ? 'translate-x-6 opacity-0' : '-translate-x-6 opacity-0'"
                enter-to-class="translate-x-0 opacity-100" leave-from-class="translate-x-0 opacity-100"
                :leave-to-class="tabDirection === 'right' ? '-translate-x-6 opacity-0' : 'translate-x-6 opacity-0'">

                <!-- Record Form -->
                <form id="record-form" v-if="activeTab === 'record'" key="record" class="space-y-2 mx-3  "
                    @submit.prevent="onSubmit">

                    <!-- Card 1: 人员 + 分类 -->
                    <div
                        class="overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)]">
                        <!-- 人员 -->
                        <RouterLink to="/contacts"
                            class="flex min-h-[52px] items-center gap-3 px-4 py-2.5 transition-colors active:bg-black/[0.06]">
                            <span class="shrink-0 whitespace-nowrap text-sm font-medium text-slate-700">人员<span
                                    class="ml-0.5 text-rose-500">*</span></span>
                            <span class="ml-auto flex items-center gap-1.5">
                                <!-- 未选择 -->
                                <span v-if="!selectedContactsData.length" class="text-sm text-slate-400">请选择</span>
                                <!-- 已选择：头像堆叠 + 名称/人数 -->
                                <span v-else class="flex items-center gap-1.5">
                                    <span class="flex -space-x-2">
                                        <div v-for="(contact, i) in selectedContactsData.slice(0, 3)"
                                            :key="contact.acct"
                                            class="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#267EF0] to-[#1a6ad4] text-[9px] font-bold text-white ring-2 ring-white"
                                            :style="{ zIndex: 3 - i }">
                                            <img :src="contact.avatar || defaultAvatar" :alt="contact.usrnam"
                                                class="h-full w-full object-cover" />
                                        </div>
                                        <div v-if="selectedContactsData.length > 3"
                                            class="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[9px] font-bold text-slate-500 ring-2 ring-white">
                                            +{{ selectedContactsData.length - 3 }}
                                        </div>
                                    </span>
                                    <span class="text-xs font-medium text-slate-700">
                                        {{ selectedContactsData.length <= 2 ? contactDisplayText :
                                            `${selectedContactsData.length} 人` }} </span>
                                    </span>
                                    <svg class="h-3.5 w-3.5 shrink-0 text-[#C7C7CC]" viewBox="0 0 20 20" fill="none">
                                        <path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="1.75"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </span>
                        </RouterLink>

                        <div class="mx-4 h-px bg-black/[0.06]"></div>

                        <!-- 分类 -->
                        <div class="flex min-h-[52px] items-center gap-3 px-4 py-2.5">
                            <span class="shrink-0 whitespace-nowrap text-sm font-medium text-slate-700">分类<span
                                    class="ml-0.5 text-rose-500">*</span></span>
                            <div class="ml-auto flex items-center gap-4">
                                <!-- 督办 -->
                                <label class="flex cursor-pointer items-center gap-1.5">
                                    <span
                                        class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150"
                                        :class="form.logsty === '1' ? 'border-[#267EF0]' : 'border-slate-300'">
                                        <span v-if="form.logsty === '1'"
                                            class="h-2 w-2 rounded-full bg-[#267EF0]"></span>
                                    </span>
                                    <input type="radio" v-model="form.logsty" value="1" class="sr-only" />
                                    <span class="text-sm"
                                        :class="form.logsty === '1' ? 'font-medium text-slate-800' : 'text-slate-500'">督办</span>
                                </label>
                                <!-- 备忘录 -->
                                <label class="flex cursor-pointer items-center gap-1.5">
                                    <span
                                        class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150"
                                        :class="form.logsty === '2' ? 'border-[#267EF0]' : 'border-slate-300'">
                                        <span v-if="form.logsty === '2'"
                                            class="h-2 w-2 rounded-full bg-[#267EF0]"></span>
                                    </span>
                                    <input type="radio" v-model="form.logsty" value="2" class="sr-only" />
                                    <span class="text-sm"
                                        :class="form.logsty === '2' ? 'font-medium text-slate-800' : 'text-slate-500'">备忘录</span>
                                </label>
                            </div>
                        </div>

                        <div class="mx-4 h-px bg-black/[0.06]"></div>

                        <!-- 内容 -->
                        <label class="block px-4 pb-3 pt-3">
                            <div class="mb-2">
                                <span class="text-sm font-medium text-slate-700">内容<span
                                        class="ml-0.5 text-rose-500">*</span></span>
                            </div>
                            <textarea v-model="form.eventmsg" rows="4" placeholder="请填写事件详情…"
                                class="w-full resize-none rounded-xl border border-transparent bg-slate-50/80 px-3 py-2.5 text-sm leading-6 text-slate-800 placeholder:text-[#C7C7CC] transition-colors focus-visible:border-[#267EF0]/40 focus-visible:bg-white focus-visible:outline-none"></textarea>
                        </label>
                    </div>

                    <!-- Card 2: 要求完成时间（督办）/ 类别（备忘录） -->
                    <div
                        class="overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)]">
                        <!-- 要求完成时间：仅督办显示 -->
                        <button v-if="form.logsty === '1'" type="button" @click="showCalendar = true"
                            class="flex w-full min-h-[52px] items-center gap-3 px-4 py-2.5 transition-colors active:bg-black/[0.06]">
                            <span class="shrink-0 whitespace-nowrap text-sm font-medium text-slate-700">要求完成时间<span
                                    class="ml-0.5 text-rose-500">*</span></span>
                            <span class="ml-auto flex items-center gap-1 text-sm">
                                <span :class="form.findat ? 'text-slate-800' : 'text-slate-400'">
                                    {{ form.findat || '请选择' }}
                                </span>
                                <svg class="h-3.5 w-3.5 text-[#C7C7CC]" viewBox="0 0 20 20" fill="none">
                                    <path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="1.75"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </span>
                        </button>

                        <!-- 类别：仅备忘录显示 -->
                        <div v-if="form.logsty === '2'" class="px-4 py-2.5">
                            <div class="flex min-h-[52px] items-center gap-3">
                                <span class="shrink-0 whitespace-nowrap text-sm font-medium text-slate-700">类别<span
                                        class="ml-0.5 text-rose-500">*</span></span>
                                <div class="ml-auto flex items-center gap-2">
                                    <button type="button"
                                        class="rounded-full border px-3 py-1 text-xs font-medium transition-all"
                                        :class="form.kpisty === 1 ? 'border-transparent bg-[#26BF4C] text-white shadow-[0_1px_4px_rgba(38,191,76,0.4)]' : 'border-[#C7C7CC]/50 bg-white/60 text-[#8E8E93]'"
                                        @click="form.kpisty = 1">
                                        正向事项
                                    </button>
                                    <button type="button"
                                        class="rounded-full border px-3 py-1 text-xs font-medium transition-all"
                                        :class="form.kpisty === -1 ? 'border-transparent bg-[#FF4650] text-white shadow-[0_1px_4px_rgba(255,70,80,0.4)]' : 'border-[#C7C7CC]/50 bg-white/60 text-[#8E8E93]'"
                                        @click="form.kpisty = -1">
                                        负向事项
                                    </button>
                                </div>
                            </div>
                            <!-- 选择后显示具体事项下拉（另起一行） -->
                            <div v-if="form.kpisty !== null" class="mt-2 px-0">
                                <select v-model="form.kpiselect"
                                    class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                                    <option value="">请选择具体事项</option>
                                    <option v-for="opt in form.kpisty === 1 ? positiveOptions : negativeOptions"
                                        :key="opt" :value="opt">{{ opt }}</option>
                                    <option value="其他">其他</option>
                                </select>
                                <input v-if="form.kpiselect === '其他'" v-model="form.kpiselectOther" type="text"
                                    placeholder="请填写其他事项"
                                    class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                            </div>
                        </div>
                    </div>

                    <van-calendar v-model:show="showCalendar" :show-confirm="false" color="#267EF0"
                        @confirm="onCalendarConfirm" @cancel="showCalendar = false" />
                </form>

                <!-- Query Tab -->
                <div v-else key="query" class="overflow-hidden rounded-2xl  ">
                    <!-- 搜索占位栏 -->
                    <div class="px-3 pt-4">
                        <button type="button" @click="router.push('/search')"
                            class="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-50 bg-white px-3 py-1.5 text-slate-500 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-colors active:bg-slate-50">
                            <svg class="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="none">
                                <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.5" />
                                <path d="M14 14L17.5 17.5" stroke="currentColor" stroke-width="1.5"
                                    stroke-linecap="round" />
                            </svg>
                            <span class="text-sm">搜索人员</span>
                        </button>
                    </div>

                    <div class="mt-4 px-4">
                        <p class="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-[#8E8E93]">最近人员</p>
                        <div
                            class="overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)] divide-y divide-black/[0.05]">
                            <button v-for="person in QueryPeople" :key="person.acct" @click="goToPersonList(person)"
                                class="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors active:bg-black/[0.06]">
                                <div
                                    class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#267EF0] to-[#1a6ad4] text-sm font-semibold text-white shadow-sm overflow-hidden">
                                    <img :src="person.avatar || defaultAvatar" :alt="person.usrnam"
                                        class="h-full w-full object-cover" />
                                </div>
                                <div class="min-w-0 flex-1">
                                    <p class="truncate text-sm font-medium text-slate-900">{{ person.usrnam }}</p>
                                    <p class="truncate text-xs text-slate-500">{{ person.postnam }}</p>
                                </div>
                                <svg class="h-4 w-4 flex-shrink-0 text-[#C7C7CC]" viewBox="0 0 20 20" fill="none">
                                    <path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="1.75"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>

        <!-- Submit Button -->
        <div v-if="activeTab === 'record'" class="fixed inset-x-0 bottom-0 bg-[#F5F6F7]/90 backdrop-blur-xl">
            <div class="mx-auto w-full max-w-md px-4 pt-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
                <button type="submit" form="record-form" :disabled="isSubmitting || submitSuccess"
                    class="h-12 w-full rounded-[14px] bg-[#267EF0] text-[15px] font-semibold tracking-wide text-white shadow-[0_4px_16px_rgba(38,126,240,0.38)] transition-all active:scale-[0.98] active:bg-[#1a6ad4] disabled:opacity-60 disabled:active:scale-100">
                    <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
                        <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
                            <path class="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        提交中…
                    </span>
                    <span v-else-if="submitSuccess" class="flex items-center justify-center gap-2">
                        <!-- 打勾图标 -->
                        <svg class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="none">
                            <path d="M5 10.5L9 14.5L15 7.5" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        提交成功
                    </span>
                    <span v-else>创建</span>
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed, nextTick, onActivated, onMounted, reactive, ref, watch } from 'vue'

defineOptions({ name: 'index' })
import dayjs from 'dayjs'
import { useContactSelectionStore } from '@/store/contactSelection'
import { useRoute, useRouter } from 'vue-router'
import http from '@/utils/http'
import Toast from '@/utils/Toast'
import defaultAvatar from '@/assets/default-avatar.svg'

const route = useRoute()
const router = useRouter()

const initialTab = route.query.tab === 'query' || route.query.tab === 'record'
    ? route.query.tab
    : 'record'

const activeTab = ref(initialTab)
const tabDirection = ref('right')
const showCalendar = ref(false)
const isRestoringTab = ref(false)

const tabOrder = {
    record: 0,
    query: 1,
}

const syncTabFromRoute = async () => {
    const routeTab = route.query.tab
    if ((routeTab === 'record' || routeTab === 'query') && routeTab !== activeTab.value) {
        isRestoringTab.value = true
        activeTab.value = routeTab
        await nextTick()
        isRestoringTab.value = false
    }
}

const switchTab = (nextTab) => {
    if (nextTab === activeTab.value)
        return

    tabDirection.value = tabOrder[nextTab] > tabOrder[activeTab.value] ? 'right' : 'left'
    activeTab.value = nextTab

    if (nextTab === 'query') {
        fetchQueryPeople()
    }

    router.replace({
        query: {
            ...route.query,
            tab: nextTab,
        },
    })
}

const form = reactive({
    logsty: '1',
    eventmsg: '',
    findat: '',
    kpisty: null, // 明确选择后才有值，用于必填校验
    kpiselect: '', // 具体事项下拉选择
    kpiselectOther: '', // 选择其他时的文本
})

// 正向 / 负向事项列表
const positiveOptions = [
    '主动推进工作，无需上级督促盯办',
    '主动担当补位，发现问题自主闭环整改',
    '可独立搭建完整工作框架、落地方案',
    '统筹分工有序，跨岗位协同衔接顺畅，无协作内耗',
    '严守制度流程，全流程合规作业，无越线违规行为',
    '具备建立、优化工作流程、标准能力',
    '承接指令不打折扣，按期保质完成闭环交付',
    '过程主动同步进度，攻坚急事主动兜底担当',
]

const negativeOptions = [
    '工作被动等待，不催不动，缺乏自主担当',
    '遇事推诿甩锅，不主动整改工作问题',
    '缺乏全局思路，方案逻辑杂乱，无法落地使用',
    '统筹排布无序，工作节奏混乱，易返工、易扯皮',
    '无视标准流程，随意简化环节，凭个人经验办事',
    '不具备或抵触建立、优化工作流程、标准化工作',
    '选择性落实工作，拖延应付，常态化交付滞后',
    '履职敷衍无闭环，成果质量差，频繁返工整改',
]

const selectedContactsData = ref([])
const contactSelectionStore = useContactSelectionStore()

const QueryPeople = ref([])

const fetchQueryPeople = async () => {
    const bdat = dayjs().subtract(1, 'month').format('YYYY-MM-DD')
    const edat = dayjs().add(1, 'day').format('YYYY-MM-DD')
    const response = await http.post('/qw/findmyusers', { qryflg: 4, bdat, edat })
    console.log('最近人员查询结果：', response)
    QueryPeople.value = response ?? []
}

const goToPersonList = (person) => {

    console.log('goToPersonList', person)

    router.push({
        path: '/person-list',
        query: {
            acct: person.acct,
            name: person.usrnam,
            post: person.postnam ?? '',
            avatar: person.avatar ?? '',
            tab: 'query',
        },
    })
}

const contactDisplayText = computed(() => {
    return selectedContactsData.value
        .map(contact => contact?.usrnam)
        .filter(Boolean)
        .join(',')
})

const syncContactsFromStore = () => {
    const contacts = contactSelectionStore.selectedContacts
    if (Array.isArray(contacts) && contacts.length > 0) {
        selectedContactsData.value = contacts
    }
}

const onCalendarConfirm = (date) => {
    const pickedDate = Array.isArray(date) ? date[0] : date
    form.findat = dayjs(pickedDate).format('YYYY-MM-DD')
    showCalendar.value = false
}

const resetForm = () => {
    form.logsty = '1'
    form.eventmsg = ''
    form.findat = ''
    form.kpisty = null
    form.kpiselect = ''
    form.kpiselectOther = ''
    selectedContactsData.value = []
    contactSelectionStore.clearSelectedContacts()
}

const isSubmitting = ref(false)
const submitSuccess = ref(false)

const onSubmit = async () => {
    if (isSubmitting.value || submitSuccess.value) return

    // 基础必填校验
    if (!selectedContactsData.value.length) {
        Toast.info('请选择人员')
        return
    }
    if (!form.eventmsg.trim()) {
        Toast.info('请填写内容')
        return
    }
    // 督办：要求完成时间必填
    if (form.logsty === '1' && !form.findat) {
        Toast.info('请选择要求完成时间')
        return
    }
    // 备忘录：类别必填（kpisty 默认为 1，但若未主动选择则为 null）
    if (form.logsty === '2' && form.kpisty === null) {
        Toast.info('请选择类别')
        return
    }
    // 备忘录：已选择类别后须选择具体事项或填写其他
    if (form.logsty === '2' && form.kpisty !== null) {
        if (!form.kpiselect) {
            Toast.info('请选择具体事项')
            return
        }
        if (form.kpiselect === '其他' && !form.kpiselectOther.trim()) {
            Toast.info('请填写其他事项')
            return
        }
    }

    isSubmitting.value = true
    try {
        const toUsers = selectedContactsData.value.map(c => c.acct).filter(Boolean).join(',')
        await http.post('/qw/saveevent', {
            eventmsg: form.eventmsg,
            findat: form.findat,
            kpisty: form.kpisty,
            logsty: form.logsty,
            kpistyitem: form.kpiselect === '其他' ? form.kpiselectOther : form.kpiselect,
            toUsers,
        })
        submitSuccess.value = true
        setTimeout(() => {
            submitSuccess.value = false
            resetForm()
        }, 1000)
    } finally {
        isSubmitting.value = false
    }
}

onMounted(() => {
    syncContactsFromStore()
    fetchQueryPeople()
})

onActivated(() => {
    syncTabFromRoute()
    syncContactsFromStore()
})

watch(() => route.query.tab, () => {
    syncTabFromRoute()
})

// 切换分类时重置联动字段
watch(() => form.logsty, () => {
    form.findat = ''
    form.kpisty = null
})

// 切换正/负向时重置具体下拉与其他文本
watch(() => form.kpisty, () => {
    form.kpiselect = ''
    form.kpiselectOther = ''
})
</script>

<style scoped></style>

<route lang="yaml">
meta:
    title: 事件登记
    layout: Default
</route>