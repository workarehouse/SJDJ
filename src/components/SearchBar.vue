<template>
    <div class="relative">
        <div :class="['relative', 'z-40', 'px-3', 'py-2', searchBarBgClass]">
            <Transition enter-active-class="animate-in fade-in slide-in-from-bottom-2 duration-200"
                leave-active-class="animate-out fade-out slide-out-to-top-1 duration-150">
                <button v-if="!isSearching" @click="enterSearchMode"
                    class="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-3 py-1.5 text-slate-500 transition-colors hover:text-slate-600">
                    <svg class="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.5" />
                        <path d="M14 14L17.5 17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                    <span class="text-sm">{{ placeholder }}</span>
                </button>
                <div v-else class="flex items-center gap-2 z-100 ">
                    <div class="flex flex-1 items-center gap-2 rounded-lg bg-white px-3 py-1.5">
                        <svg class="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.5" />
                            <path d="M14 14L17.5 17.5" stroke="currentColor" stroke-width="1.5"
                                stroke-linecap="round" />
                        </svg>
                        <input ref="searchInputRef" v-model="searchQuery" @input="onSearchInput" type="text"
                            :placeholder="placeholder"
                            class="h-6 flex-1 border-0 bg-transparent text-sm text-slate-800 outline-none ring-0 placeholder:text-slate-400 focus:outline-none focus:ring-0" />
                    </div>
                    <button @click="exitSearchMode"
                        class="shrink-0 text-sm font-medium text-blue-600 hover:text-blue-700">
                        取消
                    </button>
                </div>
            </Transition>
        </div>

        <Transition enter-active-class="animate-in fade-in slide-in-from-top-2 duration-200"
            leave-active-class="animate-out fade-out slide-out-to-top-2 duration-150">
            <div v-if="isSearching && searchQuery.trim()" class="absolute left-0 right-0 z-50 bg-white">
                <div class="h-[calc(100vh-3.5rem)] overflow-y-auto bg-white">
                    <div class="divide-y divide-slate-200">
                        <button v-for="contact in searchResults" :key="contact.id" @click="selectResult(contact)"
                            class="flex w-full items-center gap-3 border-0 bg-white px-4 py-3 text-left transition-colors hover:bg-blue-50">
                            <div
                                class="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 text-sm font-semibold text-white">
                                <img v-if="contact.avatar" :src="contact.avatar" :alt="contact.name"
                                    class="h-full w-full object-cover" />
                                <span v-else>{{ contact.usrnam ? contact.usrnam.charAt(0) : '人' }}</span>
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="truncate text-sm font-medium text-slate-900">{{ contact.name }}</p>
                                <p class="truncate text-xs text-slate-500">{{ contact.position }}</p>
                            </div>
                        </button>
                    </div>
                    <div v-if="isSearchLoading" class="px-4 py-3 text-center text-sm text-slate-500">
                        搜索中...
                    </div>
                    <div v-if="!isSearchLoading && searchQuery.trim() && searchResults.length === 0"
                        class="py-12 text-center">
                        <p class="text-sm text-slate-500">{{ emptyText }}</p>
                    </div>
                </div>
            </div>
        </Transition>
    </div>

    <!-- Search Overlay Mask (show before typing) -->
    <Transition enter-active-class="animate-in fade-in duration-200"
        leave-active-class="animate-out fade-out duration-150">
        <div v-if="isSearching && !searchQuery.trim()" class="fixed inset-0 z-10 bg-black/45" @click="exitSearchMode">
        </div>
    </Transition>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import http from '@/utils/http'

const props = defineProps({
    placeholder: {
        type: String,
        default: '搜索'
    },
    emptyText: {
        type: String,
        default: '未找到相关结果'
    },
    searchDelay: {
        type: Number,
        default: 300
    },
    searchBarBgClass: {
        type: String,
        default: 'bg-white'
    },
})

const mapSearchUser = (item) => {
    return {
        id: item.acct,
        name: item.usrnam,
        position: item.postnam,
        avatar: item.avatar || '',
        acct: item.acct,
        usrnam: item.usrnam,
        postnam: item.postnam,
    }
}

const searchFn = async (keyword) => {
    const response = await http.post('/searchusers', { keyword })
    const result = response ?? []
    return result.map(mapSearchUser)
}

const emit = defineEmits(['select', 'search-mode-change', 'search-query-change'])

const searchQuery = ref('')
const isSearching = ref(false)
const searchInputRef = ref(null)
const searchResults = ref([])
const isSearchLoading = ref(false)
let searchRequestId = 0

// Enter search mode
const enterSearchMode = async () => {
    isSearching.value = true
    searchQuery.value = ''
    searchResults.value = []
    isSearchLoading.value = false
    emit('search-mode-change', true)
    await nextTick()
    searchInputRef.value?.focus()
}

// Exit search mode
const exitSearchMode = () => {
    isSearching.value = false
    searchQuery.value = ''
    searchResults.value = []
    isSearchLoading.value = false
    emit('search-mode-change', false)
}

// Mock API search function
const onSearchInput = async () => {
    const query = searchQuery.value.trim()
    emit('search-query-change', query)

    if (!query) {
        searchResults.value = []
        isSearchLoading.value = false
        return
    }

    const currentRequestId = ++searchRequestId
    isSearchLoading.value = true

    try {
        let results = []

        results = await searchFn(query)

        // Ignore outdated responses when user types quickly
        if (currentRequestId !== searchRequestId) {
            return
        }

        searchResults.value = Array.isArray(results) ? results : []
    } finally {
        if (currentRequestId === searchRequestId) {
            isSearchLoading.value = false
        }
    }
}

// Emit selection and exit search mode
const selectResult = (contact) => {
    emit('select', contact)
    exitSearchMode()
}
</script>
