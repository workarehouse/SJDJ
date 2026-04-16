<template>
    <section class="min-h-[calc(100vh-4rem)] bg-[linear-gradient(180deg,#eef3fb_0%,#f4f6f9_42%,#f3f4f6_100%)] pb-28">
        <div class="mx-auto w-full max-w-md">
            <div
                class="overflow-hidden border border-slate-200/90 bg-white shadow-[0_10px_30px_-18px_rgba(30,64,175,0.32)]">
                <div class="px-2 py-2">
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

            <Transition :css="!isRestoringTab" mode="out-in" enter-active-class="transition-all duration-220 ease-out"
                leave-active-class="transition-all duration-160 ease-in"
                :enter-from-class="tabDirection === 'right' ? 'translate-x-6 opacity-0' : '-translate-x-6 opacity-0'"
                enter-to-class="translate-x-0 opacity-100" leave-from-class="translate-x-0 opacity-100"
                :leave-to-class="tabDirection === 'right' ? '-translate-x-6 opacity-0' : 'translate-x-6 opacity-0'">
                <form id="record-form" v-if="activeTab === 'record'" key="record" class="mt-0"
                    @submit.prevent="onSubmit">
                    <div class="space-y-0">
                        <div class="overflow-hidden border border-slate-200 bg-white shadow-sm">
                            <label class="flex min-h-12 items-center gap-3 px-4 text-sm">
                                <span class="w-20 shrink-0 font-medium text-slate-700">事件人员<span
                                        class="text-rose-500">*</span></span>
                                <RouterLink to="/contacts"
                                    class="h-8 min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-2 text-right text-slate-800 transition-colors hover:text-blue-700 focus-visible:border-blue-200 focus-visible:bg-blue-50/40 focus-visible:outline-none">
                                    <span class="inline-flex items-center justify-end gap-1">
                                        <span :key="contactDisplayText"
                                            :class="contactDisplayText ? 'text-slate-800' : 'text-slate-400'">{{
                                                contactDisplayText || '请选择' }}</span>
                                        <svg class="h-3.5 w-3.5 text-slate-400" viewBox="0 0 20 20" fill="none"
                                            xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="1.75"
                                                stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </span>
                                </RouterLink>
                            </label>

                            <div class="border-t border-slate-100 px-4 py-3 text-sm">
                                <div class="flex items-center gap-3">
                                    <span class="w-20 shrink-0 font-medium text-slate-700">事件分类<span
                                            class="text-rose-500">*</span></span>
                                    <div class="flex flex-1 items-center justify-end gap-2">
                                        <button type="button"
                                            class="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
                                            :class="form.eventType === '督办' ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'"
                                            @click="form.eventType = '督办'">
                                            督办
                                        </button>
                                        <button type="button"
                                            class="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
                                            :class="form.eventType === '记事' ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'"
                                            @click="form.eventType = '记事'">
                                            记事
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <label class="block border-t border-slate-100 px-4 py-3 text-sm">
                                <span class="mb-1.5 block font-medium text-slate-700">事件内容<span
                                        class="text-rose-500">*</span></span>
                                <textarea v-model="form.content" rows="4" placeholder="请填写"
                                    class="w-full resize-none rounded-md border border-transparent bg-slate-50 px-2.5 py-2 text-sm leading-6 text-slate-800 placeholder:text-slate-400 transition-colors focus-visible:border-blue-200 focus-visible:bg-white focus-visible:outline-none"></textarea>
                            </label>
                        </div>

                        <div class="overflow-hidden  bg-white shadow-sm">
                            <label class="flex min-h-12 items-center gap-3 px-4 text-sm">
                                <span class="w-20 shrink-0 font-medium text-slate-700">完成时间<span
                                        class="text-rose-500">*</span></span>
                                <button type="button" @click="showCalendar = true"
                                    class="h-8 min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-2 text-right text-slate-800 transition-colors hover:text-blue-700 focus-visible:border-blue-200 focus-visible:bg-blue-50/40 focus-visible:outline-none">
                                    <span class="inline-flex items-center justify-end gap-1">
                                        <span :class="form.finishedAt ? 'text-slate-800' : 'text-slate-400'">{{
                                            form.finishedAt || '请选择' }}</span>
                                        <svg class="h-3.5 w-3.5 text-slate-400" viewBox="0 0 20 20" fill="none"
                                            xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="1.75"
                                                stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </span>
                                </button>
                            </label>

                            <div class="border-t border-slate-100 px-4 py-3 text-sm">
                                <div class="flex items-center gap-3">
                                    <span class="w-20 shrink-0 font-medium text-slate-700">事项类别<span
                                            class="text-rose-500">*</span></span>
                                    <div class="flex flex-1 items-center justify-end gap-2">
                                        <button type="button"
                                            class="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
                                            :class="form.itemType === '加分项' ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'"
                                            @click="form.itemType = '加分项'">
                                            加分项
                                        </button>
                                        <button type="button"
                                            class="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
                                            :class="form.itemType === '减分项' ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'"
                                            @click="form.itemType = '减分项'">
                                            减分项
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <van-calendar v-model:show="showCalendar" :show-confirm="false" color="#2563eb"
                        @confirm="onCalendarConfirm" @cancel="showCalendar = false" />
                </form>

                <div v-else key="query" class="mt-0 overflow-hidden border border-slate-200 bg-white shadow-sm">
                    <SearchBar :contacts="queryPeople" @select="goToPersonList"
                        @search-query-change="queryKeyword = $event" />

                    <div class="divide-y divide-slate-100 border-t border-slate-100">
                        <button v-for="person in filteredQueryPeople" :key="person.id" @click="goToPersonList(person)"
                            class="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-blue-50">
                            <div
                                class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 text-sm font-semibold text-white">
                                {{ person.avatar }}
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="truncate text-sm font-medium text-slate-900">{{ person.name }}</p>
                                <p class="truncate text-xs text-slate-500">{{ person.position }}</p>
                            </div>
                            <svg class="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="none"
                                xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="1.75"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </button>
                    </div>

                    <div v-if="filteredQueryPeople.length === 0" class="px-4 py-10 text-center">
                        <p class="text-sm text-slate-500">未找到相关人员</p>
                    </div>
                </div>
            </Transition>

            <div v-if="activeTab === 'record'"
                class="fixed inset-x-0 bottom-0 border-t border-slate-200/90 bg-white/95 backdrop-blur-sm">
                <div class="mx-auto w-full max-w-md px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2">
                    <button type="submit" form="record-form"
                        class="h-11 w-full rounded-lg bg-blue-600 text-sm font-medium text-white shadow-[0_10px_20px_-12px_rgba(37,99,235,0.65)] transition-colors hover:bg-blue-700">
                        提交
                    </button>
                </div>
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