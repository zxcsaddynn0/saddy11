import { defineStore } from 'pinia'
import { readStored, writeStored } from '../utils/storage.js'

const clean = value => Array.isArray(value) ? value.filter(x => Number.isSafeInteger(x.id) && x.id > 0 && Number.isSafeInteger(x.quantity) && x.quantity > 0 && x.quantity <= 99) : []
export const useCartStore = defineStore('cart', {
  state: () => ({ lines: clean(readStored('seminar-cart-v1', [])) }),
  getters: {
    count: state => state.lines.reduce((n, line) => n + line.quantity, 0),
    quantityOf: state => id => state.lines.find(line => line.id === Number(id))?.quantity || 0,
  },
  actions: {
    persist() { writeStored('seminar-cart-v1', this.lines) },
    add(id, quantity = 1) {
      id = Number(id)
      if (!Number.isSafeInteger(id) || id < 1) return
      const line = this.lines.find(line => line.id === id)
      if (line) line.quantity = Math.min(99, line.quantity + quantity)
      else this.lines.push({ id, quantity: Math.max(1, Math.min(99, quantity)) })
      this.persist()
    },
    setQuantity(id, quantity) {
      id = Number(id)
      quantity = Math.floor(Number(quantity))
      if (!Number.isFinite(quantity) || quantity <= 0) return this.remove(id)
      const line = this.lines.find(line => line.id === id)
      if (line) { line.quantity = Math.min(99, quantity); this.persist() }
    },
    remove(id) { this.lines = this.lines.filter(line => line.id !== Number(id)); this.persist() },
    clear() { this.lines = []; this.persist() },
  },
})
