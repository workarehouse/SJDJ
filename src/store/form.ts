import { defineStore } from 'pinia'

export const useFormStore = defineStore('form', {
    state: () => ({
        id: '',
        eventmsg: '',
        kpisty: '',
        logsty: '',
    }),
    actions: {
        setForm(data) {
            this.id = data.id || ''
            this.eventmsg = data.eventmsg || ''
            this.kpisty = data.kpisty ?? ''
            this.logsty = data.logsty ?? ''
        },
        resetForm() {
            this.id = ''
            this.eventmsg = ''
            this.kpisty = ''
            this.logsty = ''
        },
    },
})
