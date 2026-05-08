<template>
    <section class="pb-28 min-h-screen">
        <div class="mx-auto w-full max-w-md">

            <form class="space-y-2 mx-3 pt-3" @submit.prevent="onSubmit">
                <div
                    class="overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)]">
                    <!-- 人员选择 -->
                    <RouterLink to="/contacts"
                        class="flex min-h-[52px] items-center gap-3 px-4 py-2.5 transition-colors active:bg-black/[0.06]">
                        <span class="shrink-0 whitespace-nowrap text-sm font-medium text-slate-700">人员<span
                                class="ml-0.5 text-rose-500">*</span></span>
                        <span class="ml-auto flex items-center gap-1.5">
                            <span v-if="!selectedContactsData.length" class="text-sm text-slate-400">请选择</span>
                            <span v-else class="flex items-center gap-1.5">
                                <span class="flex -space-x-2">
                                    <div v-for="(contact, i) in selectedContactsData.slice(0, 3)" :key="contact.acct"
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

                    <!-- 内容 -->
                    <label class="block px-4 pb-3 pt-3">
                        <div class="mb-2">
                            <span class="text-sm font-medium text-slate-700">内容<span
                                    class="ml-0.5 text-rose-500">*</span></span>
                        </div>
                        <textarea v-model="form.eventmsg" rows="4" placeholder="请填写详情…"
                            class="w-full resize-none rounded-xl border border-transparent bg-slate-50/80 px-3 py-2.5 text-sm leading-6 text-slate-800 placeholder:text-[#C7C7CC] transition-colors focus-visible:border-[#267EF0]/40 focus-visible:bg-white focus-visible:outline-none"></textarea>
                    </label>

                    <div class="mx-4 h-px bg-black/[0.06]"></div>

                    <!-- 类别 -->
                    <div class="px-4 py-2.5">
                        <div class="flex min-h-[52px] items-center gap-3">
                            <span class="shrink-0 whitespace-nowrap text-sm font-medium text-slate-700">类别<span
                                    class="ml-0.5 text-rose-500">*</span></span>
                            <div class="ml-auto flex items-center gap-2">
                                <button type="button"
                                    class="rounded-full border px-3 py-1 text-xs font-medium transition-all"
                                    :class="form.kpisty === 1 ? 'border-transparent bg-[#26BF4C] text-white shadow-[0_1px_4px_rgba(38,191,76,0.4)]' : 'border-[#C7C7CC]/50 bg-white/60 text-[#8E8E93]'"
                                    @click="form.kpisty = 1">
                                    正向表现
                                </button>
                                <button type="button"
                                    class="rounded-full border px-3 py-1 text-xs font-medium transition-all"
                                    :class="form.kpisty === -1 ? 'border-transparent bg-[#FF4650] text-white shadow-[0_1px_4px_rgba(255,70,80,0.4)]' : 'border-[#C7C7CC]/50 bg-white/60 text-[#8E8E93]'"
                                    @click="form.kpisty = -1">
                                    负向问题
                                </button>
                            </div>
                        </div>
                        <!-- 选择后显示具体事项下拉（另起一行） -->
                        <div v-if="form.kpisty !== null" class="mt-2 px-0">
                            <select v-model="form.kpiselect"
                                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                                <option value="">请选择具体事项</option>
                                <option v-for="opt in form.kpisty === 1 ? positiveOptions : negativeOptions" :key="opt"
                                    :value="opt">{{ opt }}</option>
                                <option value="其他">其他</option>
                            </select>
                            <input v-if="form.kpiselect === '其他'" v-model="form.kpiselectOther" type="text"
                                placeholder="请填写其他事项"
                                class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                        </div>
                    </div>
                </div>
            </form>
        </div>

        <!-- 提交按钮 -->
        <div class="fixed inset-x-0 bottom-0 bg-[#F5F6F7]/90 backdrop-blur-xl">
            <div class="mx-auto w-full max-w-md px-4 pt-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
                <button type="button" @click="onSubmit" :disabled="isSubmitting || submitSuccess"
                    class="h-12 w-full rounded-[14px] bg-[#267EF0] text-[15px] font-semibold tracking-wide text-white shadow-[0_4px_16px_rgba(38,126,240,0.38)] transition-all active:scale-[0.98] active:bg-[#1a6ad4] disabled:opacity-60 disabled:active:scale-100">
                    <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
                        <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
                            <path class="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        提交中…
                    </span>
                    <span v-else-if="submitSuccess" class="flex items-center justify-center gap-2">
                        <svg class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="none">
                            <path d="M5 10.5L9 14.5L15 7.5" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        提交成功
                    </span>
                    <span v-else>保存</span>
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import http from '@/utils/http'
import Toast from '@/utils/Toast'
import { useContactSelectionStore } from '@/store/contactSelection'
import { useFormStore } from '@/store/form'
import defaultAvatar from '@/assets/default-avatar.svg'
import { POSITIVE_KPI_OPTIONS, NEGATIVE_KPI_OPTIONS, getAllKpiOptions } from '@/enum'

const route = useRoute()
const router = useRouter()
const isSubmitting = ref(false)
const submitSuccess = ref(false)

// 统一用 Pinia 管理表单
const formStore = useFormStore()
let initData = {}
try {
    if (route.query.data) {
        initData = JSON.parse(decodeURIComponent(route.query.data))
    }
} catch (e) {
    initData = {}
}
if (!formStore.id) {
    formStore.setForm({
        id: route.query.id || initData.id || '',
        eventmsg: initData.eventmsg || '',
        kpisty: initData.kpisty ?? '',
        logsty: initData.logsty ?? '',
        kpiselect: initData.kpiselect || '',
        kpiselectOther: initData.kpiselectOther || '',
    })
}
const form = formStore

// 初始化后处理 kpistyitem：如果存在则解析为 kpiselect 或 kpiselectOther
const initializeKpistyItem = () => {
    if (!initData.kpistyitem) return

    const allOptions = getAllKpiOptions()
    if (allOptions.includes(initData.kpistyitem)) {
        // 在预定列表中，直接赋值
        form.kpiselect = initData.kpistyitem
        form.kpiselectOther = ''
        return
    }

    // 不在列表中，设为“其他”
    form.kpiselect = '其他'
    form.kpiselectOther = initData.kpistyitem
}

const contactSelectionStore = useContactSelectionStore()

// 使用从 enum 导入的正向/负向事项
const positiveOptions = POSITIVE_KPI_OPTIONS
const negativeOptions = NEGATIVE_KPI_OPTIONS

// 人员选择数据改为 revusr 字段
const selectedContactsData = ref(Array.isArray(initData.revusr) ? initData.revusr : [])

// 获取可选人员
const fetchUsers = async () => {
    try {
        const res = await http.post('/qw/searchusers', { keyword: initData.revusr || '' })
        return res || []
    } catch (e) {
        return []
    }
}

const contactDisplayText = computed(() => {
    return selectedContactsData.value
        .map(user => user?.usrnam)
        .filter(Boolean)
        .join(',')
})

const syncContactsFromStore = () => {
    const contacts = contactSelectionStore.selectedContacts
    if (Array.isArray(contacts) && contacts.length > 0) {
        selectedContactsData.value = contacts
    }
}

onMounted(async () => {
    const contacts = contactSelectionStore.selectedContacts
    if (!Array.isArray(contacts) || contacts.length === 0) {
        // 只有在 pinia 为空时才查接口
        const users = await fetchUsers()
        if (Array.isArray(users) && users.length > 0) {
            contactSelectionStore.setSelectedContacts(users)
            selectedContactsData.value = users
        }
    } else {
        selectedContactsData.value = contacts
    }
    // 初始化 kpiselect 和 kpiselectOther
    initializeKpistyItem()
})

const onSubmit = async () => {
    if (isSubmitting.value || submitSuccess.value) return
    if (!selectedContactsData.value.length) {
        Toast.fail('请选择人员')
        return
    }
    if (!form.eventmsg.trim()) {
        Toast.fail('请填写内容')
        return
    }
    if (form.kpisty === null || form.kpisty === '') {
        Toast.fail('请选择类别')
        return
    }
    // 实际每帮孩选择类别后须选择具体事项或填写其他
    if (form.kpisty !== null && form.kpisty !== '') {
        if (!form.kpiselect) {
            Toast.fail('请选择具体事项')
            return
        }
        if (form.kpiselect === '其他' && !form.kpiselectOther.trim()) {
            Toast.fail('请填写其他事项')
            return
        }
    }
    isSubmitting.value = true
    try {

        console.log(form);

        await http.post('/qw/saveevent', {
            id: form.id,
            eventmsg: form.eventmsg,
            kpisty: form.kpisty,
            logsty: form.logsty,
            kpistyitem: form.kpiselect === '其他' ? form.kpiselectOther : form.kpiselect,
            toUsers: selectedContactsData.value.map(c => c.acct).filter(Boolean).join(','),
        })
        submitSuccess.value = true
        setTimeout(() => {
            submitSuccess.value = false
            router.back()
        }, 1000)
    } finally {
        isSubmitting.value = false
    }
}

// 仅返回到 person-list 时清空 contactSelectionStore
import { onBeforeRouteLeave } from 'vue-router'
import { watch } from 'vue'

// 切换正/负向时重置具体下拉与其他文本
watch(() => form.kpisty, () => {
    form.kpiselect = ''
    form.kpiselectOther = ''
})

onBeforeRouteLeave((to, from, next) => {
    // 判断目标路由是否为 person-list
    if (to.name === 'person-list' || to.path === '/person-list') {
        contactSelectionStore.setSelectedContacts([])
        formStore.resetForm()
    }
    next()
})
</script>

<style scoped></style>

<route lang="yaml">
meta:
  title: 编辑备忘录
  layout: Default
</route>
