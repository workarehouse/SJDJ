<template>
    <!-- 外层 flex 列布局，高度撑满动态视口 -->
    <section class="flex h-dvh flex-col bg-[#F5F6F7]">

        <!-- 可滚动区域：包含 header + 已选择 + 列表 -->
        <div class="flex-1 overflow-y-auto">
            <!-- Header -->
            <div class="sticky top-0 z-40 bg-gradient-to-b from-white to-[#F5F6F7] ">
                <div class="relative mx-auto w-full max-w-md">
                    <SearchBar :contacts="contacts" :searchBarBgClass="isSearching ? 'bg-white' : ''"
                        @select="handleSearchSelect" @search-mode-change="handleSearchModeChange" />
                </div>
            </div>

            <!-- 已选择 -->
            <Transition enter-active-class="animate-in fade-in duration-200"
                leave-active-class="animate-out fade-out duration-150">
                <div v-if="selectedContacts.length > 0 && !isSearching" class="border-b border-slate-100 bg-white">
                    <div class="mx-auto w-full max-w-md">
                        <div class="flex items-center justify-between px-4 pt-3 pb-2">
                            <div class="flex items-center gap-1.5">
                                <span class="text-xs font-semibold text-slate-700">已选择</span>
                                <span
                                    class="flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[#267EF0] px-1 text-[10px] font-semibold text-white">{{
                                        selectedContacts.length }}</span>
                            </div>
                            <button @click="clearSelectedContacts"
                                class="text-xs font-medium text-slate-400 transition-colors hover:text-[#FF4650]">清空</button>
                        </div>
                        <div class="max-h-40 overflow-y-auto flex flex-wrap gap-x-4 gap-y-3 px-4 py-2">
                            <TransitionGroup enter-active-class="transition-all duration-200 ease-out"
                                enter-from-class="opacity-0 scale-75" enter-to-class="opacity-100 scale-100"
                                leave-active-class="transition-all duration-150 ease-in absolute"
                                leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-75">
                                <button v-for="contact in selectedContacts" :key="contact.acct"
                                    @click="toggleContact(contact)"
                                    class="flex flex-shrink-0 flex-col items-center gap-1 cursor-pointer active:scale-90 transition-transform duration-100">
                                    <div class="relative h-11 w-11">
                                        <div
                                            class="h-11 w-11 rounded-full bg-gradient-to-br from-[#267EF0] to-[#1a6ad4] flex items-center justify-center overflow-hidden text-white font-semibold text-sm ring-2 ring-[#267EF0]/30">
                                            <img :src="contact.avatar || defaultAvatar" :alt="contact.usrnam"
                                                class="h-full w-full object-cover" />
                                        </div>
                                        <span
                                            class="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#267EF0] text-white shadow-sm">
                                            <svg viewBox="0 0 10 10" class="h-2 w-2" fill="none">
                                                <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" stroke-width="2"
                                                    stroke-linecap="round" />
                                            </svg>
                                        </span>
                                    </div>
                                    <span class="max-w-[3rem] truncate text-[10px] font-medium text-slate-600">{{
                                        contact.usrnam }}</span>
                                </button>
                            </TransitionGroup>
                        </div>
                    </div>
                </div>
            </Transition>

            <!-- 列表 -->
            <div class="mx-auto w-full max-w-md">
                <div v-if="!isLoading && contacts.length > 0" class="px-4 py-2.5 flex items-center gap-2">
                    <span class="text-xs font-semibold text-slate-600">我的下属</span>
                </div>
                <!-- 骨架屏 -->
                <template v-if="isLoading">
                    <div v-for="i in 6" :key="i" class="flex items-center gap-3 px-4 py-3">
                        <div class="h-5 w-5 rounded bg-slate-100 animate-pulse"></div>
                        <div class="h-10 w-10 flex-shrink-0 rounded-lg bg-slate-100 animate-pulse"></div>
                        <div class="flex-1 space-y-1.5">
                            <div class="h-3.5 w-24 rounded bg-slate-100 animate-pulse"></div>
                            <div class="h-3 w-16 rounded bg-slate-100 animate-pulse"></div>
                        </div>
                    </div>
                </template>

                <TransitionGroup v-else tag="div" enter-active-class="transition-all duration-200 ease-out"
                    enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition-all duration-150 ease-in" leave-from-class="opacity-100"
                    leave-to-class="opacity-0" class="divide-y divide-slate-200">
                    <button v-for="contact in contacts" :key="contact.acct" @click="toggleContact(contact)"
                        class="flex w-full items-center gap-3 border-0 bg-white px-4 py-3 text-left transition-colors duration-150 hover:bg-[#267EF0]/5 active:bg-[#267EF0]/10 active:scale-[0.99]">
                        <!-- Checkbox -->
                        <input type="checkbox" :checked="isSelected(contact.acct)"
                            class="h-5 w-5 rounded border-slate-300 text-[#267EF0] cursor-pointer" />
                        <!-- Avatar -->
                        <div
                            class="h-10 w-10 flex-shrink-0 rounded-lg bg-gradient-to-br from-[#267EF0] to-[#1a6ad4] flex items-center justify-center overflow-hidden text-white font-semibold text-sm">
                            <img :src="contact.avatar || defaultAvatar" :alt="contact.usrnam"
                                class="h-full w-full object-cover" />
                        </div>
                        <!-- Info -->
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-slate-900">{{ contact.usrnam }}</p>
                            <p class="text-xs text-slate-500">{{ contact.postnam }}</p>
                        </div>
                    </button>
                </TransitionGroup>

                <!-- 空状态 -->
                <div v-if="!isLoading && contacts.length === 0"
                    class="flex flex-col items-center justify-center py-16 text-center">
                    <div class="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                        <svg class="h-7 w-7 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                        </svg>
                    </div>
                    <p class="text-sm font-medium text-slate-600">暂无下属人员</p>
                    <p class="mt-1 text-xs text-slate-400">可通过上方搜索添加人员</p>
                </div>
            </div>
        </div>

        <!-- 确认按钮：普通底部元素，不再 fixed -->
        <div class="border-t border-slate-100 bg-white">
            <div class="mx-auto w-full max-w-md px-4 pt-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
                <button @click="confirmSelection"
                    class="h-11 w-full rounded-lg bg-[#267EF0] text-sm font-medium text-white shadow-[0_10px_20px_-12px_rgba(38,126,240,0.65)] transition-all duration-150 hover:bg-[#1a6ad4] active:scale-[0.98] active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="selectedContacts.length === 0">
                    确认
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
import { onActivated, onMounted, ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useContactSelectionStore } from '@/store/contactSelection'
import SearchBar from '@/components/SearchBar.vue'
import http from '@/utils/http'
import dayjs from 'dayjs'
import defaultAvatar from '@/assets/default-avatar.svg'

const router = useRouter()
const contactSelectionStore = useContactSelectionStore()
const selectedContacts = ref([])
let isSearching = ref(false)

const syncSelectedContactsFromStore = () => {
    const storeContacts = Array.isArray(contactSelectionStore.selectedContacts)
        ? contactSelectionStore.selectedContacts
        : []
    selectedContacts.value = storeContacts.map(contact => ({ ...contact }))
}

const contacts = ref([])
const isLoading = ref(false)

const fetchContacts = async () => {
    isLoading.value = true
    try {
        const bdat = dayjs().subtract(1, 'month').format('YYYY-MM-DD')
        const edat = dayjs().format('YYYY-MM-DD')
        const response = await http.post('/findmyusers', { qryflg: 2, bdat, edat })
        contacts.value = response ?? []
    } finally {
        isLoading.value = false
    }
}

const isSelected = (acct) => {
    return selectedContacts.value.some(contact => contact.acct === acct)
}

const unselectedContacts = computed(() =>
    contacts.value.filter(c => !isSelected(c.acct))
)

const toggleContact = (contact) => {
    const index = selectedContacts.value.findIndex(c => c.acct === contact.acct)
    if (index > -1) {
        selectedContacts.value.splice(index, 1)
    } else {
        selectedContacts.value.push(contact)
    }
}

// Handle search result selection
const handleSearchSelect = (contact) => {
    if (!contacts.value.some(c => c.acct === contact.acct)) {
        contacts.value.unshift(contact)
    }
    if (!isSelected(contact.acct)) {
        selectedContacts.value.push(contact)
    }
    window.scrollTo({ top: 0 })
}

// Track search mode state
const handleSearchModeChange = (isActive) => {
    isSearching.value = isActive
}

const confirmSelection = () => {
    if (selectedContacts.value.length === 0)
        return

    const selectedPayload = selectedContacts.value
    contactSelectionStore.setSelectedContacts(selectedPayload)
    router.back()
}

const clearSelectedContacts = () => {
    selectedContacts.value = []
    contactSelectionStore.clearSelectedContacts()
}

onMounted(() => {
    fetchContacts()
    syncSelectedContactsFromStore()
})

onActivated(() => {
    syncSelectedContactsFromStore()
})
</script>

<style scoped></style>

<route lang="yaml">
meta:
    title: 选择事件人员
    layout: Default
</route>
