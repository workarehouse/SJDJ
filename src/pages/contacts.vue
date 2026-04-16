<template>
    <section class="min-h-screen bg-white">
        <!-- Header -->
        <div class="sticky top-0 z-40  bg-blue-100 ">
            <div class="relative mx-auto w-full max-w-md">
                <div class="overflow-hidden transition-all duration-200 ease-out"
                    :class="isSearching ? 'max-h-0 opacity-0' : 'max-h-14 opacity-100'">
                    <div class="flex items-center gap-2 px-3 py-3">
                        <RouterLink to="/"
                            class="flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100">
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.5 16.5L5 9L12.5 1.5" stroke="currentColor" stroke-width="1.5"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </RouterLink>
                        <h1 class="flex-1 text-center text-sm font-semibold text-slate-900">选择事件人员</h1>
                        <div class="w-8"></div>
                    </div>
                </div>

                <!-- Search Bar Component -->
                <SearchBar :contacts="contacts" searchBarBgClass="bg-blue-100" @select="handleSearchSelect"
                    @search-mode-change="handleSearchModeChange" :search-fn="searchUsers" />

                <Transition enter-active-class="animate-in fade-in slide-in-from-top-1 duration-200"
                    leave-active-class="animate-out fade-out slide-out-to-top-1 duration-150">
                    <div v-if="selectedContacts.length > 0 && !isSearching"
                        class="flex items-center justify-between px-3 pb-2">
                        <p class="text-xs text-slate-500">
                            已选择人员（{{ selectedContacts.length }}）
                        </p>
                        <button @click="clearSelectedContacts"
                            class="text-xs font-medium text-blue-600 transition-colors hover:text-blue-700">
                            清空
                        </button>
                    </div>
                </Transition>
            </div>
        </div>

        <!-- Contacts List / Search Results -->
        <div class="mx-auto w-full max-w-md pb-20">
            <div class="divide-y divide-slate-200">
                <button v-for="contact in contacts" :key="contact.id" @click="toggleContact(contact)"
                    class="flex w-full items-center gap-3 border-0 bg-white px-4 py-3 text-left transition-colors hover:bg-blue-50">
                    <!-- Checkbox -->
                    <input type="checkbox" :checked="isSelected(contact.id)"
                        class="h-5 w-5 rounded border-slate-300 text-blue-600 cursor-pointer" />
                    <!-- Avatar -->
                    <div
                        class="h-10 w-10 flex-shrink-0 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                        {{ contact.avatar }}
                    </div>
                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-slate-900">{{ contact.name }}</p>
                        <p class="text-xs text-slate-500">{{ contact.position }}</p>
                    </div>
                </button>
            </div>
        </div>

        <!-- Confirm Button -->
        <div class="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white">
            <div class="mx-auto w-full max-w-md px-4 py-3">
                <button @click="confirmSelection"
                    class="h-11 w-full rounded-lg bg-blue-600 text-sm font-medium text-white shadow-[0_10px_20px_-12px_rgba(37,99,235,0.65)] transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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

// Mock contacts data
const contacts = ref([
    {
        id: 1,
        name: '张三发士大夫顺丰速递地方撒发送是',
        position: '项目经理',
        avatar: '张'
    },
    {
        id: 2,
        name: '李四',
        position: '技术负责人',
        avatar: '李'
    },
    {
        id: 3,
        name: '王五',
        position: '产品总监',
        avatar: '王'
    },
    {
        id: 4,
        name: '赵六',
        position: '设计师',
        avatar: '赵'
    },
    {
        id: 5,
        name: '孙七',
        position: '运营专员',
        avatar: '孙'
    },
    {
        id: 6,
        name: '周八',
        position: '开发工程师',
        avatar: '周'
    },
    {
        id: 7,
        name: '吴九',
        position: '测试工程师',
        avatar: '吴'
    },
    {
        id: 8,
        name: '郑十',
        position: '人力资源',
        avatar: '郑'
    },
])

const mapSearchUser = (item, index) => {
    const name = item?.usrnam || ''
    const position = item?.postnam || ''
    const avatarSource = item?.avatar || name || item?.acct || ''
    const avatar = avatarSource ? String(avatarSource).trim().charAt(0) : '人'

    return {
        id: item?.acct || item?.usrnam || `search-user-${index}`,
        name,
        position,
        avatar,
        acct: item?.acct || '',
        postnam: position,
        usrnam: name,
    }
}

const searchUsers = async (keyword) => {
    const response = await http.get('/searchusers', {
        params: { keyword },
    })

    const result = response?.data?.result ?? []
    return result.map(mapSearchUser)
}

const isSelected = (contactId) => {
    return selectedContacts.value.some(contact => contact.id === contactId)
}

const toggleContact = (contact) => {
    const index = selectedContacts.value.findIndex(c => c.id === contact.id)
    if (index > -1) {
        selectedContacts.value.splice(index, 1)
    } else {
        selectedContacts.value.push(contact)
    }
}

// Handle search result selection
const handleSearchSelect = (contact) => {
    if (!isSelected(contact.id)) {
        selectedContacts.value.push(contact)
    }
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
