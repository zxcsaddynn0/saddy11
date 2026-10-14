import { defineStore } from 'pinia'
import { productsApi } from '../api/products.js'
import { normalizeProduct, categoriesFromProducts } from '../utils/catalog.js'

export const useCatalogStore = defineStore('catalog', {
  state: () => ({ products: [], categories: [], loading: false, loaded: false, error: '', request: null }),
  getters: {
    byId: state => id => state.products.find(p => p.id === Number(id)),
    featured: state => [...state.products].filter(p => p.available).sort((a,b) => b.rating - a.rating || b.reviewCount - a.reviewCount).slice(0, 8),
  },
  actions: {
    async load(force = false) {
      if (this.request && !force) return this.request
      if (this.loaded && !force) return
      this.loading = true
      this.error = ''
      this.request = (async () => {
        try {
          const [productsResult, categoriesResult] = await Promise.allSettled([
            productsApi.getAll(), productsApi.getCategories(),
          ])
          if (productsResult.status === 'rejected') throw productsResult.reason
          if (!Array.isArray(productsResult.value)) throw new Error('The product API returned an unexpected data format')
          this.products = productsResult.value.filter(p => p && p.id != null).map(normalizeProduct)
          const found = categoriesFromProducts(this.products)
          const fromApi = categoriesResult.status === 'fulfilled' && Array.isArray(categoriesResult.value)
            ? categoriesResult.value.filter(c => found.includes(c.name)) : []
          this.categories = fromApi.length ? fromApi : found.map((name, i) => ({ id: i + 1, name }))
          this.loaded = true
        } catch (error) {
          this.error = error.message || 'Could not load products'
          this.loaded = false
        } finally {
          this.loading = false
          this.request = null
        }
      })()
      return this.request
    },
    async fetchOne(id) {
      const existing = this.byId(id)
      if (existing) return existing
      const product = normalizeProduct(await productsApi.getOne(id))
      if (!this.byId(id)) this.products.push(product)
      return product
    },
  },
})
