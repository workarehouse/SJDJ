import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useContactSelectionStore = defineStore('contactSelection', () => {
    const selectedContacts = ref<any[]>([])

    const setSelectedContacts = (contacts: any[]) => {
        selectedContacts.value = Array.isArray(contacts) ? contacts : []
    }

    const clearSelectedContacts = () => {
        selectedContacts.value = []
    }

    return {
        selectedContacts,
        setSelectedContacts,
        clearSelectedContacts,
    }
})
