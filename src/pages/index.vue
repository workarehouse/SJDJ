<template>
    <section class="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-[#F5F6F8] pb-28">
        <!-- Sticky Header + Tabs -->
        <div class="sticky top-0 z-30   backdrop-blur-xl">
            <div class="mx-auto w-full max-w-md">
                <!-- Tab Switcher -->
                <div class="px-4 py-3">
                    <div
                        class="relative grid grid-cols-2 rounded-xl bg-[#EBEBEB] p-1 text-center text-sm font-semibold">
                        <span
                            class="pointer-events-none absolute bottom-1 left-1 top-1 w-[calc(50%-0.25rem)] rounded-lg bg-white shadow-[0_2px_10px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.06)]"
                            :class="[
                                activeTab === 'query' ? 'translate-x-full' : 'translate-x-0',
                                isRestoringTab ? 'transition-none' : 'transition-transform duration-250 ease-out',
                            ]"></span>
                        <button class="relative z-10 rounded-lg py-2 transition-colors duration-200"
                            :class="activeTab === 'record' ? 'text-blue-700' : 'text-slate-500 hover:text-slate-700'"
                            @click="switchTab('record')">
                            记录
                        </button>
                        <button class="relative z-10 rounded-lg py-2 transition-colors duration-200"
                            :class="activeTab === 'query' ? 'text-blue-700' : 'text-slate-500 hover:text-slate-700'"
                            @click="switchTab('query')">
                            查询
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="mx-auto w-full max-w-md  pt-4">
            <Transition :css="!isRestoringTab" mode="out-in" enter-active-class="transition-all duration-220 ease-out"
                leave-active-class="transition-all duration-160 ease-in"
                :enter-from-class="tabDirection === 'right' ? 'translate-x-6 opacity-0' : '-translate-x-6 opacity-0'"
                enter-to-class="translate-x-0 opacity-100" leave-from-class="translate-x-0 opacity-100"
                :leave-to-class="tabDirection === 'right' ? '-translate-x-6 opacity-0' : 'translate-x-6 opacity-0'">

                <!-- Record Form -->
                <form id="record-form" v-if="activeTab === 'record'" key="record" class="space-y-3"
                    @submit.prevent="onSubmit">

                    <!-- Card 1: 事件人员 + 事件分类 -->
                    <div
                        class="overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)]">
                        <!-- 事件人员 -->
                        <RouterLink to="/contacts"
                            class="flex min-h-[52px] items-center gap-3 px-4 py-2.5 transition-colors active:bg-black/[0.06]">
                            <span class="shrink-0 whitespace-nowrap text-sm font-medium text-slate-700">事件人员<span
                                    class="ml-0.5 text-rose-500">*</span></span>
                            <span class="ml-auto flex items-center gap-1.5">
                                <!-- 未选择 -->
                                <span v-if="!selectedContactsData.length" class="text-sm text-slate-400">请选择</span>
                                <!-- 已选择：头像堆叠 + 名称/人数 -->
                                <span v-else class="flex items-center gap-1.5">
                                    <span class="flex -space-x-2">
                                        <div v-for="(contact, i) in selectedContactsData.slice(0, 3)"
                                            :key="contact.acct"
                                            class="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-[9px] font-bold text-white ring-2 ring-white"
                                            :style="{ zIndex: 3 - i }">
                                            <img v-if="contact.avatar" :src="contact.avatar" :alt="contact.usrnam"
                                                class="h-full w-full object-cover" />
                                            <span v-else>{{ contact.usrnam?.charAt(0) }}</span>
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

                        <!-- 事件分类 -->
                        <div class="flex min-h-[52px] items-center gap-3 px-4 py-2.5">
                            <span class="shrink-0 whitespace-nowrap text-sm font-medium text-slate-700">事件分类<span
                                    class="ml-0.5 text-rose-500">*</span></span>
                            <div class="ml-auto flex items-center gap-2">
                                <button type="button"
                                    class="rounded-full border px-3 py-1 text-xs font-medium transition-all"
                                    :class="form.logsty === '1' ? 'border-transparent bg-[#007AFF] text-white shadow-[0_1px_4px_rgba(0,122,255,0.35)]' : 'border-[#C7C7CC]/50 bg-white/60 text-[#8E8E93]'"
                                    @click="form.logsty = '1'">
                                    督办
                                </button>
                                <button type="button"
                                    class="rounded-full border px-3 py-1 text-xs font-medium transition-all"
                                    :class="form.logsty === '2' ? 'border-transparent bg-[#007AFF] text-white shadow-[0_1px_4px_rgba(0,122,255,0.35)]' : 'border-[#C7C7CC]/50 bg-white/60 text-[#8E8E93]'"
                                    @click="form.logsty = '2'">
                                    记事
                                </button>
                            </div>
                        </div>

                        <div class="mx-4 h-px bg-black/[0.06]"></div>

                        <!-- 事件内容 -->
                        <label class="block px-4 pb-3 pt-3">
                            <div class="mb-2">
                                <span class="text-sm font-medium text-slate-700">事件内容<span
                                        class="ml-0.5 text-rose-500">*</span></span>
                            </div>
                            <textarea v-model="form.eventmsg" rows="4" placeholder="请填写事件详情…"
                                class="w-full resize-none rounded-xl border border-transparent bg-slate-50/80 px-3 py-2.5 text-sm leading-6 text-slate-800 placeholder:text-[#C7C7CC] transition-colors focus-visible:border-[#007AFF]/40 focus-visible:bg-white focus-visible:outline-none"></textarea>
                        </label>
                    </div>

                    <!-- Card 2: 完成时间 + 事项类别 -->
                    <div
                        class="overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)]">
                        <!-- 完成时间 -->
                        <button type="button" @click="showCalendar = true"
                            class="flex w-full min-h-[52px] items-center gap-3 px-4 py-2.5 transition-colors active:bg-black/[0.06]">
                            <span class="shrink-0 whitespace-nowrap text-sm font-medium text-slate-700">完成时间<span
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

                        <div class="mx-4 h-px bg-black/[0.06]"></div>

                        <!-- 事项类别 -->
                        <div class="flex min-h-[52px] items-center gap-3 px-4 py-2.5">
                            <span class="shrink-0 whitespace-nowrap text-sm font-medium text-slate-700">事项类别<span
                                    class="ml-0.5 text-rose-500">*</span></span>
                            <div class="ml-auto flex items-center gap-2">
                                <button type="button"
                                    class="rounded-full border px-3 py-1 text-xs font-medium transition-all"
                                    :class="form.kpisty === 1 ? 'border-transparent bg-[#34C759] text-white shadow-[0_1px_4px_rgba(52,199,89,0.4)]' : 'border-[#C7C7CC]/50 bg-white/60 text-[#8E8E93]'"
                                    @click="form.kpisty = 1">
                                    加分项
                                </button>
                                <button type="button"
                                    class="rounded-full border px-3 py-1 text-xs font-medium transition-all"
                                    :class="form.kpisty === -1 ? 'border-transparent bg-[#FF3B30] text-white shadow-[0_1px_4px_rgba(255,59,48,0.4)]' : 'border-[#C7C7CC]/50 bg-white/60 text-[#8E8E93]'"
                                    @click="form.kpisty = -1">
                                    减分项
                                </button>
                            </div>
                        </div>
                    </div>

                    <van-calendar v-model:show="showCalendar" :show-confirm="false" color="#2563eb"
                        @confirm="onCalendarConfirm" @cancel="showCalendar = false" />
                </form>

                <!-- Query Tab -->
                <div v-else key="query" class="overflow-hidden rounded-2xl  ">
                    <SearchBar @select="goToPersonList" />

                    <div class="mt-6 px-4">
                        <p class="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-[#8E8E93]">最近人员</p>
                        <div
                            class="overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)] divide-y divide-black/[0.05]">
                            <button v-for="person in QueryPeople" :key="person.acct" @click="goToPersonList(person)"
                                class="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors active:bg-black/[0.06]">
                                <div
                                    class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-sm font-semibold text-white shadow-sm overflow-hidden">
                                    <img v-if="person.avatar" :src="person.avatar" :alt="person.usrnam"
                                        class="h-full w-full object-cover" />
                                    <span v-else>{{ person.usrnam?.charAt(0) }}</span>
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
        <div v-if="activeTab === 'record'"
            class="fixed inset-x-0 bottom-0 border-t border-black/[0.06] bg-[#F5F6F8]/90 backdrop-blur-xl">
            <div class="mx-auto w-full max-w-md px-4 py-3">
                <button type="submit" form="record-form"
                    class="h-12 w-full rounded-[14px] bg-[#007AFF] text-[15px] font-semibold tracking-wide text-white shadow-[0_4px_16px_rgba(0,122,255,0.38)] transition-all active:scale-[0.98] active:bg-[#0066D6]">
                    提交
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
import SearchBar from '@/components/SearchBar.vue'
import http from '@/utils/http'
import Toast from '@/utils/Toast'

const route = useRoute()
const router = useRouter()

const initialTab = route.query.tab === 'query' || route.query.tab === 'record'
    ? route.query.tab
    : 'record'

const activeTab = ref(initialTab)
const tabDirection = ref('right')
const showCalendar = ref(false)
const queryKeyword = ref('')
const isRestoringTab = ref(false)

const todayStr = computed(() => dayjs().format('YYYY年M月D日'))

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
    kpisty: 1,
})

const selectedContactsData = ref([])
const contactSelectionStore = useContactSelectionStore()

const QueryPeople = ref([])

const fetchQueryPeople = async () => {
    const bdat = dayjs().subtract(1, 'month').format('YYYY-MM-DD')
    const edat = dayjs().format('YYYY-MM-DD')
    const response = await http.post('/findmyusers', { qryflg: 4, bdat, edat })
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
    form.kpisty = 1
    selectedContactsData.value = []
    contactSelectionStore.clearSelectedContacts()
}

const onSubmit = async () => {
    const toUsers = selectedContactsData.value.map(c => c.acct).filter(Boolean).join(',')
    await http.post('/saveevent', {
        eventmsg: form.eventmsg,
        findat: form.findat,
        kpisty: form.kpisty,
        logsty: form.logsty,
        toUsers,
    })
    Toast.success('提交成功')
    resetForm()
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
</script>

<style scoped></style>

<route lang="yaml">
meta:
    title: 事件登记
    layout: Default
</route>