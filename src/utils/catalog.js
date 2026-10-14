const base = (import.meta.env?.VITE_API_BASE_URL || '').replace(/\/$/, '')

export function assetUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  return `${base}/${String(path).replace(/^\/+/, '')}`
}

export function normalizeProduct(p) {
  const price = Math.max(0, Number(p?.price) || 0)
  const discounted = Number(p?.discount_price)
  const salePrice = Number.isFinite(discounted) && discounted > 0 && discounted < price ? discounted : price
  return {
    id: Number(p.id),
    name: String(p.name || 'Товар Apple'),
    brand: String(p.brand || 'Apple'),
    category: String(p.category || 'Другое'),
    color: String(p.color || ''),
    price, salePrice,
    rating: Math.max(0, Number(p.rating) || 0),
    reviewCount: Number(p.count_review) || 0,
    available: Boolean(p.is_available),
    guarantee: Number(p.guarantee) || 0,
    country: p.country || '',
    address: p.store_address || '',
    createdAt: p.createdAt || '',
    images: Array.isArray(p.images) ? p.images.filter(Boolean).map(assetUrl) : [],
    characteristics: Array.isArray(p.characteristics) ? p.characteristics : [],
  }
}

export function memoryOf(product) {
  const field = product.characteristics.find(c => /объ[её]м.*памят/i.test(c.characteristic))
  return field?.value ? `${field.value} ${field.unit_type || 'ГБ'}` : ''
}

export const price = value => `${Math.round(Number(value) || 0).toLocaleString('ru-RU')} ₽`
export const categoriesFromProducts = products => [...new Set(products.map(p => p.category))].filter(Boolean).sort((a, b) => a.localeCompare(b, 'ru'))

export function filterProducts(products, opts = {}) {
  const q = String(opts.q || '').trim().toLocaleLowerCase('ru')
  const category = String(opts.category || '')
  const color = String(opts.color || '')
  const brand = String(opts.brand || '')
  const memory = String(opts.memory || '')
  const battery = Number(opts.battery || 0)
  const minPrice = opts.minPrice === '' || opts.minPrice == null ? null : Number(opts.minPrice)
  const maxPrice = opts.maxPrice === '' || opts.maxPrice == null ? null : Number(opts.maxPrice)
  const minRating = Number(opts.rating || 0)
  const sort = String(opts.sort || 'popular')
  const result = products.filter(p => {
    if (q && ![p.name, p.brand, p.category, p.color, memoryOf(p)].join(' ').toLocaleLowerCase('ru').includes(q)) return false
    if (category && p.category !== category) return false
    if (color && p.color !== color) return false
    if (brand && p.brand !== brand) return false
    if (memory && !p.characteristics.some(c => /объ[её]м.*памят/i.test(c.characteristic) && c.value === memory)) return false
    if (battery && !p.characteristics.some(c => /аккумулятор/i.test(c.characteristic) && Number(c.value) >= battery)) return false
    if (Number.isFinite(minPrice) && minPrice != null && p.salePrice < minPrice) return false
    if (Number.isFinite(maxPrice) && maxPrice != null && p.salePrice > maxPrice) return false
    if (opts.inStock && !p.available) return false
    if (minRating && p.rating < minRating) return false
    return true
  })
  const comparators = {
    'price-asc': (a, b) => a.salePrice - b.salePrice,
    'price-desc': (a, b) => b.salePrice - a.salePrice,
    'name': (a, b) => a.name.localeCompare(b.name, 'ru'),
    'rating': (a, b) => b.rating - a.rating,
    'popular': (a, b) => b.reviewCount - a.reviewCount || b.rating - a.rating,
  }
  return result.sort(comparators[sort] || comparators.popular)
}
const colorTranslations = Object.freeze({
  'Белый': 'White', 'Красный': 'Red', 'Черный': 'Black', 'Чёрный': 'Black',
  'Желтый': 'Yellow', 'Жёлтый': 'Yellow', 'Зеленый': 'Green', 'Зелёный': 'Green',
  'Фиолетовый': 'Purple', 'Розовый': 'Pink', 'Синий': 'Blue', 'Голубой': 'Blue',
  'Золотой': 'Gold', 'Серебристый': 'Silver', 'Серый': 'Gray',
  'Серый космос': 'Space Gray', 'Темно-зеленый': 'Midnight Green',
  'Тёмно-зелёный': 'Midnight Green', 'Белый Титан': 'White Titanium',
  'Серый Титан': 'Natural Titanium', 'Синий Титан': 'Blue Titanium',
})

const characteristicTranslations = Object.freeze({
  'Процессор': 'Processor', 'Объем встроенной памяти': 'Built-in memory',
  'Объём встроенной памяти': 'Built-in memory', 'Аккумулятор': 'Battery capacity',
  'Питание': 'Power', 'Материал корпуса': 'Case material', 'Вес': 'Weight',
  'Диагональ': 'Screen diagonal', 'Разрешение': 'Resolution',
})

export function displayColor(value) {
  return colorTranslations[String(value || '')] || String(value || '')
}

export function displayMemory(product) {
  const value = memoryOf(product)
  return value ? value.replace(/\s*(ГБ|GB)\s*$/iu, 'GB') : ''
}

export function displayProductName(product) {
  if (!product) return ''
  const brand = String(product.brand || '').trim()
  const rawName = String(product.name || '').trim()
  const prefix = rawName.toLowerCase().startsWith(brand.toLowerCase()) ? '' : `${brand} `
  return [prefix + rawName, displayMemory(product), displayColor(product.color)].filter(Boolean).join(' ')
}

export function displayCharacteristic(value) {
  return characteristicTranslations[String(value || '')] || String(value || '')
}

export function displayCharacteristicUnit(value) {
  return ({ 'ГБ': 'GB', 'г': 'g', 'дюйма': 'in', 'значение': '' })[String(value)] ?? String(value || '')
}
