<template>
    <section class="min-h-[calc(100vh-4rem)] bg-slate-50 pb-28">
        <!-- Sticky Header + Tabs -->
        <div class="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
            <div class="mx-auto w-full max-w-md">
                <!-- Tab Switcher -->
                <div class="px-4 py-3">
                    <div
                        class="relative grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-center text-sm font-semibold">
                        <span
                            class="pointer-events-none absolute bottom-1 left-1 top-1 w-[calc(50%-0.25rem)] rounded-lg bg-white shadow-sm"
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

        <div class="mx-auto w-full max-w-md px-4 pt-4">
            <Transition :css="!isRestoringTab" mode="out-in" enter-active-class="transition-all duration-220 ease-out"
                leave-active-class="transition-all duration-160 ease-in"
                :enter-from-class="tabDirection === 'right' ? 'translate-x-6 opacity-0' : '-translate-x-6 opacity-0'"
                enter-to-class="translate-x-0 opacity-100" leave-from-class="translate-x-0 opacity-100"
                :leave-to-class="tabDirection === 'right' ? '-translate-x-6 opacity-0' : 'translate-x-6 opacity-0'">

                <!-- Record Form -->
                <form id="record-form" v-if="activeTab === 'record'" key="record" class="space-y-3"
                    @submit.prevent="onSubmit">

                    <!-- Card 1: 事件人员 + 事件分类 -->
                    <div class="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
                        <!-- 事件人员 -->
                        <RouterLink to="/contacts"
                            class="flex min-h-[52px] items-center gap-3 px-4 py-2.5 transition-colors hover:bg-slate-50 active:bg-slate-100">
                            <span class="shrink-0 whitespace-nowrap text-sm font-medium text-slate-700">事件人员<span
                                    class="ml-0.5 text-rose-500">*</span></span>
                            <span class="ml-auto flex items-center gap-1 text-sm">
                                <span :key="contactDisplayText"
                                    :class="contactDisplayText ? 'text-slate-800' : 'text-slate-400'">
                                    {{ contactDisplayText || '请选择' }}
                                </span>
                                <svg class="h-3.5 w-3.5 text-slate-400" viewBox="0 0 20 20" fill="none">
                                    <path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="1.75"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </span>
                        </RouterLink>

                        <div class="mx-4 h-px bg-slate-100"></div>

                        <!-- 事件分类 -->
                        <div class="flex min-h-[52px] items-center gap-3 px-4 py-2.5">
                            <span class="shrink-0 whitespace-nowrap text-sm font-medium text-slate-700">事件分类<span
                                    class="ml-0.5 text-rose-500">*</span></span>
                            <div class="ml-auto flex items-center gap-2">
                                <button type="button"
                                    class="rounded-full border px-3 py-1 text-xs font-medium transition-all"
                                    :class="form.eventType === '督办' ? 'border-blue-200 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'"
                                    @click="form.eventType = '督办'">
                                    督办
                                </button>
                                <button type="button"
                                    class="rounded-full border px-3 py-1 text-xs font-medium transition-all"
                                    :class="form.eventType === '记事' ? 'border-blue-200 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'"
                                    @click="form.eventType = '记事'">
                                    记事
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Card 2: 事件内容 -->
                    <div class="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
                        <label class="block px-4 pb-3 pt-3.5">
                            <div class="mb-2">
                                <span class="text-sm font-medium text-slate-700">事件内容<span
                                        class="ml-0.5 text-rose-500">*</span></span>
                            </div>
                            <textarea v-model="form.content" rows="4" placeholder="请填写事件详情…"
                                class="w-full resize-none rounded-xl border border-transparent bg-slate-50 px-3 py-2.5 text-sm leading-6 text-slate-800 placeholder:text-slate-400 transition-colors focus-visible:border-blue-200 focus-visible:bg-white focus-visible:outline-none"></textarea>
                        </label>
                    </div>

                    <!-- Card 3: 完成时间 + 事项类别 -->
                    <div class="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
                        <!-- 完成时间 -->
                        <button type="button" @click="showCalendar = true"
                            class="flex w-full min-h-[52px] items-center gap-3 px-4 py-2.5 transition-colors hover:bg-slate-50 active:bg-slate-100">
                            <span class="shrink-0 whitespace-nowrap text-sm font-medium text-slate-700">完成时间<span
                                    class="ml-0.5 text-rose-500">*</span></span>
                            <span class="ml-auto flex items-center gap-1 text-sm">
                                <span :class="form.finishedAt ? 'text-slate-800' : 'text-slate-400'">
                                    {{ form.finishedAt || '请选择' }}
                                </span>
                                <svg class="h-3.5 w-3.5 text-slate-400" viewBox="0 0 20 20" fill="none">
                                    <path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="1.75"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </span>
                        </button>

                        <div class="mx-4 h-px bg-slate-100"></div>

                        <!-- 事项类别 -->
                        <div class="flex min-h-[52px] items-center gap-3 px-4 py-2.5">
                            <span class="shrink-0 whitespace-nowrap text-sm font-medium text-slate-700">事项类别<span
                                    class="ml-0.5 text-rose-500">*</span></span>
                            <div class="ml-auto flex items-center gap-2">
                                <button type="button"
                                    class="rounded-full border px-3 py-1 text-xs font-medium transition-all"
                                    :class="form.itemType === '加分项' ? 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'"
                                    @click="form.itemType = '加分项'">
                                    加分项
                                </button>
                                <button type="button"
                                    class="rounded-full border px-3 py-1 text-xs font-medium transition-all"
                                    :class="form.itemType === '减分项' ? 'border-rose-200 bg-rose-50 text-rose-700 shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'"
                                    @click="form.itemType = '减分项'">
                                    减分项
                                </button>
                            </div>
                        </div>
                    </div>

                    <van-calendar v-model:show="showCalendar" :show-confirm="false" color="#2563eb"
                        @confirm="onCalendarConfirm" @cancel="showCalendar = false" />
                </form>

                <!-- Query Tab -->
                <div v-else key="query"
                    class="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
                    <SearchBar :contacts="queryPeople" @select="goToPersonList"
                        @search-query-change="queryKeyword = $event" />

                    <div class="divide-y divide-slate-100">
                        <button v-for="person in filteredQueryPeople" :key="person.id" @click="goToPersonList(person)"
                            class="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-blue-50 active:bg-blue-100">
                            <div
                                class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-sm font-semibold text-white shadow-sm">
                                {{ person.avatar }}
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="truncate text-sm font-medium text-slate-900">{{ person.name }}</p>
                                <p class="truncate text-xs text-slate-500">{{ person.position }}</p>
                            </div>
                            <svg class="h-4 w-4 flex-shrink-0 text-slate-400" viewBox="0 0 20 20" fill="none">
                                <path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="1.75"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </button>
                    </div>

                    <div v-if="filteredQueryPeople.length === 0"
                        class="flex flex-col items-center justify-center px-4 py-12 text-center">
                        <div
                            class="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">
                            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                            </svg>
                        </div>
                        <p class="text-sm font-medium text-slate-600">未找到相关人员</p>
                        <p class="mt-0.5 text-xs text-slate-400">请尝试其他关键词</p>
                    </div>
                </div>
            </Transition>
        </div>

        <!-- Submit Button -->
        <div v-if="activeTab === 'record'"
            class="fixed inset-x-0 bottom-0 border-t border-slate-200/80 bg-white/95 backdrop-blur-sm">
            <div class="mx-auto w-full max-w-md px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3">
                <button type="submit" form="record-form"
                    class="h-12 w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-sm font-semibold text-white shadow-[0_8px_24px_-6px_rgba(37,99,235,0.55)] transition-all active:scale-[0.98] hover:from-blue-700 hover:to-blue-800">
                    提交
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed, nextTick, onActivated, onMounted, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { useContactSelectionStore } from '@/store/contactSelection'
import { useRoute, useRouter } from 'vue-router'
import SearchBar from '@/components/SearchBar.vue'

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

    router.replace({
        query: {
            ...route.query,
            tab: nextTab,
        },
    })
}

const form = reactive({
    contact: '',
    eventType: '督办',
    content: '',
    finishedAt: '',
    itemType: '加分项',
})

const selectedContactsData = ref([])
const contactSelectionStore = useContactSelectionStore()

const queryPeople = ref([
    { id: 1, name: '张三', position: '项目经理', avatar: '张' },
    { id: 2, name: '李四', position: '技术负责人', avatar: '李' },
    { id: 3, name: '王五', position: '产品总监', avatar: '王' },
    { id: 4, name: '赵六', position: '设计师', avatar: '赵' },
    { id: 5, name: '孙七', position: '运营专员', avatar: '孙' },
    { id: 6, name: '周八', position: '开发工程师', avatar: '周' },
    { id: 7, name: '吴九', position: '测试工程师', avatar: '吴' },
    { id: 8, name: '郑十', position: '人力资源', avatar: '郑' },
])

const filteredQueryPeople = computed(() => {
    const keyword = queryKeyword.value.trim().toLowerCase()
    if (!keyword) {
        return queryPeople.value
    }

    return queryPeople.value.filter(person =>
        person.name.toLowerCase().includes(keyword)
        || person.position.toLowerCase().includes(keyword)
    )
})

const goToPersonList = (person) => {
    router.push({
        path: '/person-list',
        query: {
            id: String(person.id),
            name: person.name,
            tab: 'query',
        },
    })
}

const normalizeSelectedContacts = (payload) => {
    if (Array.isArray(payload)) {
        return payload
    }

    // Backward compatibility: old format was comma-separated names
    if (typeof payload === 'string') {
        return payload
            .split(',')
            .map(name => name.trim())
            .filter(Boolean)
            .map((name, index) => ({ id: `legacy-${index}`, name }))
    }

    return []
}

const contactDisplayText = computed(() => {
    if (selectedContactsData.value.length > 0) {
        return selectedContactsData.value
            .map(contact => contact?.name)
            .filter(Boolean)
            .join(',')
    }

    return form.contact
})

const applySelectedContacts = (contacts) => {
    selectedContactsData.value = contacts
    form.contact = contacts.map(contact => contact.name).join(',')
    console.log('11', form.contact)
}

const syncContactsFromStore = () => {
    const contacts = normalizeSelectedContacts(contactSelectionStore.selectedContacts)
    if (contacts.length > 0) {
        applySelectedContacts(contacts)
    }
}

const onCalendarConfirm = (date) => {
    const pickedDate = Array.isArray(date) ? date[0] : date
    form.finishedAt = dayjs(pickedDate).format('YYYY-MM-DD')
    showCalendar.value = false
}

const onSubmit = () => {
    console.log('submit form:', {
        ...form,
        contacts: selectedContactsData.value,
    })
}

onMounted(() => {
    syncContactsFromStore()
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