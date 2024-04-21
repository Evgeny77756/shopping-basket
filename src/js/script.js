import { nanoid } from 'nanoid'
import { validateForm } from '../js/utils/validators'
import { Sidebar } from './components/sidebar'
import { Notification } from './components/notification'

const productList = document.querySelector('.products-list') // контейнер для отрисовки товаров
const form = document.querySelector('form') // получение формы
let PRODDUCTS = [] // Переменная для хранения данных о продуктах.

init()

// Сайдбар (первый параметр - компонент сайдбара , второй - кнопка по клику на которую открывается сайдбар, положение сайдбара (если не передан, то по умолчанию 'left'))
const panel = new Sidebar('#sidebar', '#show-sidebar', 'right')

// список товаров в корзине
const basketList = document.querySelector('#basket-list')

// инициализация функций при загрузке страницы
function init() {
  // подгрузка данных при загрузке страницы
  window.addEventListener('DOMContentLoaded', () => {
    loadJSON()

    // Проверяем, что форма существует
    if (form) {
      // Получаем все input-элементы внутри формы
      const allInputs = form.querySelectorAll('input, select')

      // Обработчик изменения каждого поля ввода
      allInputs.forEach((input) => {
        input.addEventListener('change', () => {
          const userData = {}

          // Собираем данные только из текущего поля формы
          userData[input.name] = input.value

          // Валидация только для текущего поля
          const errors = validateForm(userData)

          // Обновление сообщения об ошибке только для текущего поля
          const errorElement = document.querySelector(`#${input.name}-error`)

          if (errorElement) {
            errorElement.textContent = errors[input.name] || ''
          }
        })
      })
    }
  })
}

// Функция подгрузки данных из db.json
async function loadJSON() {
  try {
    const response = await fetch('http://localhost:3000/products')
    PRODDUCTS = await response.json()

    console.log('Данные из db.json:', PRODDUCTS)

    if (Array.isArray(PRODDUCTS)) PRODDUCTS.forEach((product) => generateProductCardHTML(product))
  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
  }
}

// Отправка данных при создании нового товара
form.addEventListener('submit', async (event) => {
  event.preventDefault() // предотвр. отправку данных

  // целевой элемент, на к-ом произошел клик (форма)
  const targetElement = event.target

  // достаем все инпуты
  const inputLists = targetElement.querySelectorAll('input')

  // Объект для отправки на бек
  const newProduct = {
    id: nanoid(),
  }

  // пополняем объект по атрибуту name инпутов
  inputLists.forEach((input) => (newProduct[input?.name] = input?.value))

  // добавляем категорию товара в объект newProduct
  newProduct.category = document.querySelector('#productCategory')?.value

  try {
    const response = await fetch('http://localhost:3000/products', {
      method: 'POST', // Здесь так же могут быть GET, PUT, DELETE
      body: JSON.stringify(newProduct), // Тело запроса в JSON-формате
      headers: {
        // Добавляем необходимые заголовки
        'Content-type': 'application/json; charset=UTF-8',
      },
    })

    if (response.ok) {
      // Показ компонента уведомления
      const notificationInfo = new Notification({
        variant: 'green',
        title: 'Добавление товара',
        subtitle: 'Товар добавлен на страницу',
      })

      // Обновляем полученные ранее данные
      PRODDUCTS.push(newProduct)

      // Вставляем новую карточку товара в HTML
      generateProductCardHTML(newProduct)
    } else {
      console.error('Ошибка при добавлении товара:', response.statusText)
    }
  } catch (error) {
    console.error('Ошибка при отправке данных на сервер:', error)
  }
})

// массив объектов степперов в корзине товаров

const steppersObjs = []

/**
 * Функция обработки кликов и добавления товара в корзину по его ID
 * @param {MouseEvent} event - Событие клика
 */
function addProductToBasket(event) {
  // Получаем id карточки
  const id = event.currentTarget.parentElement?.dataset?.id

  // Находим товар по его ID в PRODDUCTS
  const product = findProductById(id, PRODDUCTS)

  if (product) {
    // Добавляем товар в корзину и т.д.
    console.log(product)
  } else {
    console.error(`Товар с ID ${id} не найден`)
  }
}

/**
 * Функция для поиска товара по его ID в базе данных
 * @param {string} id - Идентификатор товара
 * @param {Array<Object>} products - Массив товаров
 * @returns {Object|null} - Найденный товар или null, если товар не найден
 */
function findProductById(id, products) {
  // Находим товар по его ID в переданном массиве
  const foundProduct = products.find((product) => product.id === id)

  return foundProduct || null
}

/**
 * Функция для генерации HTML-кода карточки товара
 * @param {Object} product - Объект товара
 * @param {string} product.id - ID товара
 * @param {string} product.name - Название товара
 * @param {string} product.rating - Рейтинг товара
 * @param {string} product.price - Цена товара
 * @param {string} product.imgSrc - Ссылка на изображение товара
 * @param {string} product.category - Категория товара
 */
function generateProductCardHTML(product) {
  if (productList) {
    const cardHTML = `
    <div class="main-card" data-id="${product?.id}">
      <div class="card-image">
        <img src="${product?.imgSrc}" alt="image">
        <div class="card-wishlist">
          <div class="wishlist-rating">
            <div class="rating-img">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 6.12414H9.89333L8 0L6.10667 6.12414H0L4.93333 9.90345L3.06667 16L8 12.2207L12.9333 16L11.04 9.87586L16 6.12414Z" fill="#FFCE31" />
              </svg>
            </div>
            <span class="rating-amount">${product?.rating}</span>
          </div>
          <svg class="whishlist-heart" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z"></path>
          </svg>
        </div>
      </div>
      <h3 class="card-name">${product?.name}</h3>
      <p class="card-category">${product?.category}</p>
      <p class="card-price">${product?.price}</p>
      <button class="btn btn-primary">Add to cart</button>
    </div>
  `
    // Вставка шаблона
    productList.insertAdjacentHTML('beforeend', cardHTML)

    // Получение всех кнопок
    const addProductToBasketBtns = document.querySelectorAll('.btn-primary')

    addProductToBasketBtns.forEach((button) => button.addEventListener('click', addProductToBasket))
  }
}