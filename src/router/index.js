import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue'), meta: { title: 'Главная' } },
  { path: '/catalog', name: 'catalog', component: () => import('../views/CatalogView.vue'), meta: { title: 'Каталог' } },
  { path: '/product/:id(\\d+)', name: 'product', component: () => import('../views/ProductView.vue'), meta: { title: 'Товар' } },
  { path: '/favorites', name: 'favorites', component: () => import('../views/FavoritesView.vue'), meta: { title: 'Избранное' } },
  { path: '/cart', name: 'cart', component: () => import('../views/CartView.vue'), meta: { title: 'Корзина' } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue'), meta: { title: 'Страница не найдена' } },
]

const router = createRouter({ history: createWebHistory(), routes, scrollBehavior(to, from, saved) { return saved || (to.path === from.path && JSON.stringify(to.query) !== JSON.stringify(from.query) ? undefined : { top: 0 }) } })
router.afterEach(to => { document.title = `${to.meta.title || 'Магазин'} · cyber` })
export default router
