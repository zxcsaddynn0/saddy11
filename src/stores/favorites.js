import { defineStore } from 'pinia'
import { readStored, writeStored } from '../utils/storage.js'

const initial = readStored('seminar-favorites-v1', [])
export const useFavoritesStore = defineStore('favorites', {
  state: () => ({ ids: Array.isArray(initial) ? [...new Set(initial.filter(id => Number.isSafeInteger(id) && id > 0))] : [] }),
  getters: { count: state => state.ids.length, has: state => id => state.ids.includes(Number(id)) },
  actions: {
    toggle(id) {
      id = Number(id)
      if (this.has(id)) this.ids = this.ids.filter(value => value !== id)
      else if (Number.isSafeInteger(id) && id > 0) this.ids.push(id)
      writeStored('seminar-favorites-v1', this.ids)
    },
  },
})
