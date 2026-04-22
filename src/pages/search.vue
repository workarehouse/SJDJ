<template>
    <section class="flex h-dvh flex-col bg-[#F5F6F7]">

        <!-- 顶部搜索栏 -->
        <div class="shrink-0 bg-white/95 backdrop-blur-xl"
            style="padding-top: calc(env(safe-area-inset-top) + 0.625rem); padding-bottom: 0.625rem; border-bottom: 1px solid rgba(0,0,0,0.06);">
            <div class="mx-auto flex w-full max-w-md items-center gap-2.5 px-3">
                <!-- 搜索输入框 -->
                <div class="flex flex-1 items-center gap-1.5 rounded-lg bg-black/[0.06] px-2.5 py-[3px] transition-all duration-200"
                    :class="isFocused ? 'bg-black/[0.08]' : ''">
                    <!-- 搜索图标 -->
                    <svg class="h-3.5 w-3.5 shrink-0 transition-colors duration-200"
                        :class="isFocused ? 'text-[#267EF0]' : 'text-slate-400'" viewBox="0 0 20 20" fill="none">
                        <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.5" />
                        <path d="M14 14L17.5 17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                    <input ref="inputRef" v-model="keyword" type="text" inputmode="search" placeholder="搜索人员"
                        autocomplete="off" autocorrect="off" spellcheck="false"
                        class="search-input flex-1 bg-transparent text-xs text-slate-800 outline-none placeholder:text-[#AEAEB2]"
                        @focus="isFocused = true" @blur="isFocused = false" @input="onInput"
                        @keydown.enter="doSearch" />
                    <!-- 清空按钮 -->
                    <Transition enter-active-class="transition-all duration-150 ease-out"
                        enter-from-class="opacity-0 scale-75" enter-to-class="opacity-100 scale-100"
                        leave-active-class="transition-all duration-100 ease-in"
                        leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-75">
                        <button v-if="keyword" type="button" @mousedown.prevent @click="clearKeyword"
                            class="flex h-[18px] w-[18px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#C7C7CC] transition-opacity duration-150 active:opacity-60">
                            <svg viewBox="0 0 10 10" class="h-[9px] w-[9px] text-white" fill="none">
                                <path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" stroke-width="1.6"
                                    stroke-linecap="round" />
                            </svg>
                        </button>
                    </Transition>
                </div>
                <!-- 取消 -->
                <button type="button" @click="router.back()"
                    class="shrink-0 cursor-pointer text-sm font-medium text-[#267EF0] transition-opacity duration-200 active:opacity-50">
                    取消
                </button>
            </div>
        </div>

        <!-- 内容区 -->
        <div class="flex-1 overflow-y-auto overscroll-contain">
            <div class="mx-auto w-full max-w-md px-4 py-3">

                <!-- 有关键词：显示结果 -->
                <template v-if="keyword.trim()">

                    <!-- 骨架屏加载 -->
                    <div v-if="isLoading"
                        class="overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)]">
                        <div v-for="i in 4" :key="i" class="flex items-center gap-3 px-4 py-3"
                            :class="i < 4 ? 'border-b border-black/[0.05]' : ''">
                            <!-- 头像骨架 -->
                            <div class="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-slate-200/80"></div>
                            <div class="flex-1 space-y-2">
                                <div class="h-3.5 w-1/3 animate-pulse rounded-full bg-slate-200/80"></div>
                                <div class="h-3 w-1/2 animate-pulse rounded-full bg-slate-100"></div>
                            </div>
                            <div class="h-3.5 w-3.5 animate-pulse rounded-full bg-slate-100"></div>
                        </div>
                    </div>

                    <!-- 无结果空态 -->
                    <div v-else-if="!results.length"
                        class="flex flex-col items-center justify-center px-6 py-20 text-center">
                        <div class="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100/80">
                            <svg class="h-7 w-7 text-slate-400" viewBox="0 0 24 24" fill="none">
                                <circle cx="11" cy="11" r="7.5" stroke="currentColor" stroke-width="1.5" />
                                <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="1.5"
                                    stroke-linecap="round" />
                                <path d="M8.5 8.5l4 4M12.5 8.5l-4 4" stroke="currentColor" stroke-width="1.5"
                                    stroke-linecap="round" />
                            </svg>
                        </div>
                        <p class="text-base font-semibold text-slate-700">无匹配结果</p>
                        <p class="mt-1.5 text-sm leading-relaxed text-slate-400">未找到"<span
                                class="font-medium text-slate-600">{{ keyword }}</span>"相关人员，<br />请尝试其他关键词</p>
                    </div>

                    <!-- 结果列表 -->
                    <template v-else>
                        <p class="mb-2 px-1 text-xs font-semibold text-[#8E8E93]">{{ results.length }} 个结果</p>
                        <TransitionGroup tag="div"
                            class="overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)] divide-y divide-black/[0.05]"
                            enter-active-class="transition-all duration-200 ease-out"
                            enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0"
                            leave-active-class="transition-all duration-150 ease-in absolute"
                            leave-from-class="opacity-100" leave-to-class="opacity-0">
                            <button v-for="person in results" :key="person.acct" @click="goToPersonList(person)"
                                class="flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left transition-colors duration-150 active:bg-black/[0.05]">
                                <!-- 头像 -->
                                <div
                                    class="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#267EF0] to-[#1a6ad4] shadow-[0_2px_6px_rgba(38,126,240,0.25)]">
                                    <img :src="person.avatar || defaultAvatar" :alt="person.usrnam"
                                        class="h-full w-full object-cover" />
                                </div>
                                <!-- 信息 -->
                                <div class="min-w-0 flex-1">
                                    <!-- 高亮匹配关键词 -->
                                    <p class="truncate text-sm font-semibold text-slate-900"
                                        v-html="highlight(person.usrnam, keyword)"></p>
                                    <p class="mt-0.5 truncate text-xs text-slate-500">{{ person.postnam }}</p>
                                </div>
                                <!-- 箭头 -->
                                <svg class="h-3.5 w-3.5 shrink-0 text-[#C7C7CC]" viewBox="0 0 20 20" fill="none">
                                    <path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="1.75"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                        </TransitionGroup>
                    </template>
                </template>

                <!-- 无关键词：空态引导 -->
                <template v-else>
                    <!-- 最近搜索历史 -->
                    <template v-if="recentSearches.length">
                        <div class="mb-1 flex items-center justify-between px-1">
                            <p class="text-xs font-semibold text-[#8E8E93]">最近搜索</p>
                            <button type="button"
                                @click="recentSearches = []; localStorage.removeItem('search_history')"
                                class="flex cursor-pointer items-center gap-0.5 text-xs text-slate-400 transition-colors duration-150 active:text-[#FF4650]">
                                <svg class="h-3 w-3" viewBox="0 0 16 16" fill="none">
                                    <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.5"
                                        stroke-linecap="round" />
                                </svg>
                                清除
                            </button>
                        </div>
                        <div class="mb-5 flex flex-wrap gap-2 px-1">
                            <button v-for="term in recentSearches" :key="term" type="button" @click="applyRecent(term)"
                                class="cursor-pointer rounded-lg bg-white px-3 py-1.5 text-sm text-slate-700 shadow-[0_1px_3px_rgba(0,0,0,0.07),0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-150 active:scale-95 active:bg-slate-50">
                                {{ term }}
                            </button>
                        </div>
                    </template>

                    <!-- 引导提示 -->
                    <div class="flex flex-col items-center justify-center px-4 py-12 text-center">
                        <div class="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#267EF0]/8">
                            <svg class="h-7 w-7 text-[#267EF0]/70" viewBox="0 0 24 24" fill="none">
                                <circle cx="11" cy="11" r="7.5" stroke="currentColor" stroke-width="1.5" />
                                <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="1.5"
                                    stroke-linecap="round" />
                            </svg>
                        </div>
                        <p class="text-[15px] font-semibold text-slate-700">搜索人员</p>
                        <p class="mt-1.5 text-sm leading-relaxed text-slate-400">输入姓名查看相关事件记录</p>
                    </div>
                </template>

            </div>
        </div>
    </section>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/utils/http'
import defaultAvatar from '@/assets/default-avatar.svg'

const router = useRouter()

const keyword = ref('')
const results = ref([])
const isLoading = ref(false)
const isFocused = ref(false)
const inputRef = ref(null)

// 最近搜索历史（最多 8 条）
const recentSearches = ref(
    JSON.parse(localStorage.getItem('search_history') || '[]')
)

const saveHistory = (kw) => {
    const list = recentSearches.value.filter(t => t !== kw)
    list.unshift(kw)
    recentSearches.value = list.slice(0, 8)
    localStorage.setItem('search_history', JSON.stringify(recentSearches.value))
}

const clearKeyword = () => {
    keyword.value = ''
    results.value = []
    nextTick(() => inputRef.value?.focus())
}

const applyRecent = (term) => {
    keyword.value = term
    doSearch()
}

// 高亮关键词
const highlight = (text, kw) => {
    if (!kw || !text) return text
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return text.replace(new RegExp(escaped, 'gi'), m => `<mark class="bg-[#267EF0]/15 text-[#267EF0] not-italic rounded-[3px] px-px">${m}</mark>`)
}

// 防抖定时器
let debounceTimer = null

const onInput = () => {
    clearTimeout(debounceTimer)
    if (!keyword.value.trim()) {
        results.value = []
        return
    }
    debounceTimer = setTimeout(() => {
        doSearch()
    }, 280)
}

const doSearch = async () => {
    const kw = keyword.value.trim()
    if (!kw) return
    isLoading.value = true
    try {
        const response = await http.post('/searchusers', { keyword: kw })
        results.value = response ?? []
        if (results.value.length) saveHistory(kw)
    } finally {
        isLoading.value = false
    }
}

const goToPersonList = (person) => {
    // 用 replace 替换当前历史记录，返回时跳过搜索页
    router.replace({
        path: '/person-list',
        query: {
            acct: person.acct,
            name: person.usrnam,
            post: person.postnam ?? '',
            avatar: person.avatar ?? '',
        },
    })
}

// 挂载后自动聚焦
onMounted(async () => {
    await nextTick()
    inputRef.value?.focus()
})
</script>

<style scoped>
.search-input {
    border: none;
    box-shadow: none;
    -webkit-appearance: none;
    appearance: none;
}
</style>

<route lang="yaml">
meta:
    title: 搜索
    layout: Empty
</route>
