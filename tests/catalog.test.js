import test from 'node:test'
import assert from 'node:assert/strict'
import { filterProducts, normalizeProduct, memoryOf, price, displayProductName, displayColor, displayMemory, displayCharacteristic } from '../src/utils/catalog.js'
const raw = [
  { id: 1, name: 'iPhone 15', category: 'Смартфоны', color: 'Чёрный', price: 100, is_available: true, count_review: 10, rating: 5, characteristics: [{ characteristic: 'Объем встроенной памяти', value: '128', unit_type: 'ГБ' }] },
  { id: 2, name: 'iPad Air', category: 'Планшеты', color: 'Белый', price: 200, discount_price: 150, is_available: false, count_review: 5, rating: 4, characteristics: [] },
].map(normalizeProduct)
test('product API normalization and memory', () => { assert.equal(raw[1].salePrice, 150); assert.equal(memoryOf(raw[0]), '128 ГБ'); assert.equal(price(1000), '1 000 ₽') })
test('search, category and stock filtering', () => { assert.deepEqual(filterProducts(raw, { q: 'iphone', category: 'Смартфоны', inStock: true }).map(x => x.id), [1]); assert.equal(filterProducts(raw, { color: 'Белый', inStock: true }).length, 0) })
test('sorting by price descending', () => { assert.deepEqual(filterProducts(raw, { sort: 'price-desc' }).map(x => x.id), [2, 1]) })
test('discount price used for filtering', () => { assert.deepEqual(filterProducts(raw, { maxPrice: 150 }).map(x => x.id).sort(), [1, 2]) })

test('filtering by brand, memory and battery uses API characteristics', () => {
  const p = {
    id: 20, name: 'iPhone 11', brand: 'Apple', category: 'Phones', color: 'Black',
    price: 30000, salePrice: 30000, rating: 4.2, reviewCount: 12, available: true,
    characteristics: [
      { characteristic: 'Объем встроенной памяти', value: '128', unit_type: 'ГБ' },
      { characteristic: 'Аккумулятор', value: '3500', unit_type: 'mAh' },
    ],
  }
  assert.equal(filterProducts([p], { brand: 'Apple', memory: '128', battery: '3000' }).length, 1)
  assert.equal(filterProducts([p], { brand: 'Samsung' }).length, 0)
  assert.equal(filterProducts([p], { memory: '512' }).length, 0)
  assert.equal(filterProducts([p], { battery: '4000' }).length, 0)
})

test('English display names translate backend values without mutation', () => {
  const product = normalizeProduct({ id: 42, name: 'iPhone 13 Pro', brand: 'Apple', color: 'Золотой',
    category: 'Телефоны', price: 35000, is_available: true,
    characteristics: [{ characteristic: 'Объем встроенной памяти', value: '128', unit_type: 'ГБ' }] })
  assert.equal(displayProductName(product), 'Apple iPhone 13 Pro 128GB Gold')
  assert.equal(displayColor(product.color), 'Gold')
  assert.equal(displayMemory(product), '128GB')
  assert.equal(displayCharacteristic('Процессор'), 'Processor')
  assert.equal(product.color, 'Золотой')
  assert.equal(product.price, 35000)
})
