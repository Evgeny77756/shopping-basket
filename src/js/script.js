import { nanoid } from 'nanoid'
import { validateForm } from '../js/utils/validators'

const productList = document.querySelector('.products-list') // контейнер для отрисовки товаров
const form = document.querySelector('form') // получение формы

init()

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

          console.log('errors', errors)

          console.log('userData', userData)

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
    const data = await response.json()

    let html = ''

    if (data && Array.isArray(data)) {
      data.forEach((product) => {
        html += `
          <div class="main-card" data-id="">
              <div class="card-image">
                <img src="${product?.imgSrc}" alt="image">

                <div class="card-wishlist">
                  <div class="wishlist-rating">

                    <div class="rating-img">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M16 6.12414H9.89333L8 0L6.10667 6.12414H0L4.93333 9.90345L3.06667 16L8 12.2207L12.9333 16L11.04 9.87586L16 6.12414Z"
                          fill="#FFCE31" />
                      </svg>
                    </div>

                    <span class="rating-amount">${product?.rating}</span>
                  </div>

                  <svg class="whishlist-heart" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z">
                    </path>
                  </svg>
                </div>
              </div>

              <h3 class="card-name">${product?.name}</h3>

              <p class="card-category">${product?.category}</p>

              <p class="card-price">${product?.price}</p>

              <button class="btn btn-primary">Add to cart</button>
            </div>
        `
      })
    }
    productList.insertAdjacentHTML('beforeend', html)
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
      console.log('Товар успешно добавлен')

      const newProductCard = `
        <div class="main-card" data-id="">
          <div class="card-image">
            <img src="${newProduct?.imgSrc}" alt="image">
            <div class="card-wishlist">
              <div class="wishlist-rating">
                <div class="rating-img">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 6.12414H9.89333L8 0L6.10667 6.12414H0L4.93333 9.90345L3.06667 16L8 12.2207L12.9333 16L11.04 9.87586L16 6.12414Z" fill="#FFCE31" />
                  </svg>
                </div>
                <span class="rating-amount">${newProduct?.rating}</span>
              </div>
              <svg class="whishlist-heart" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z"></path>
              </svg>
            </div>
          </div>
          <h3 class="card-name">${newProduct?.name}</h3>
          <p class="card-category">${newProduct?.category}</p>
          <p class="card-price">${newProduct?.price}</p>
          <button class="btn btn-primary">Add to cart</button>
        </div>
      `

      // Вставляем новую карточку товара в контейнер productList
      productList.insertAdjacentHTML('beforeend', newProductCard)
    } else {
      console.error('Ошибка при добавлении товара:', response.statusText)
    }
  } catch (error) {
    console.error('Ошибка при отправке данных на сервер:', error)
  }
})

// Отправка данных при создании нового товара через FormData
// form.addEventListener('submit', async (event) => {
//   event.preventDefault() // предотвр. отправку данных

//   const data = new FormData() // Создаем объект FormData

//   // Добавляем данные о товаре в объект FormData
//   data.append('id', nanoid())
//   data.append('name', document.querySelector('#productName').value)
//   data.append('rating', document.querySelector('#productRating').value)
//   data.append('price', document.querySelector('#productPrice').value)
//   data.append('category', document.querySelector('#productCategory').value)

//   // Получаем выбранное изображение
//   const imgInput = document.querySelector('#productImgSrc')
//   const imgFile = imgInput.files[0]

//   console.log('Изображение:', imgFile)

//   // Добавляем изображение в объект FormData
//   data.append('imgSrc', imgFile)

//   console.log('data', data)

//   try {
//     const response = await fetch('http://localhost:3000/products', {
//       method: 'POST', // Здесь так же могут быть GET, PUT, DELETE
//       body: data, // Тело запроса в JSON-формате
//       headers: {
//         // Указываем, что данные отправляются в формате FormData, не JSON
//         'Content-Type': 'multipart/form-data',
//       },
//     })

//     if (response.ok) {
//       console.log('Товар успешно добавлен')

//       const newProductCard = `
//         <div class="main-card" data-id="">
//           <div class="card-image">
//             <img src="${data?.imgSrc}" alt="image">
//             <div class="card-wishlist">
//               <div class="wishlist-rating">
//                 <div class="rating-img">
//                   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M16 6.12414H9.89333L8 0L6.10667 6.12414H0L4.93333 9.90345L3.06667 16L8 12.2207L12.9333 16L11.04 9.87586L16 6.12414Z" fill="#FFCE31" />
//                   </svg>
//                 </div>
//                 <span class="rating-amount">${data?.rating}</span>
//               </div>
//               <svg class="whishlist-heart" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
//                 <path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z"></path>
//               </svg>
//             </div>
//           </div>
//           <h3 class="card-name">${data?.name}</h3>
//           <p class="card-category">${data?.category}</p>
//           <p class="card-price">${data?.price}</p>
//           <button class="btn btn-primary">Add to cart</button>
//         </div>
//       `

//       // Вставляем новую карточку товара в контейнер productList
//       productList.insertAdjacentHTML('beforeend', newProductCard)
//     } else {
//       console.error('Ошибка при добавлении товара:', response.statusText)
//     }
//   } catch (error) {
//     console.error('Ошибка при отправке данных на сервер:', error)
//   }
// })
