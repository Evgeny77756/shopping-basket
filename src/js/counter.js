const counter = document.querySelector('counter') // обертка компонента
const counterInput = document.querySelector('.counter__input') // степпер
const counterBtnUp = document.querySelector('.counter__btn--up') // кнопка увеличения
const counterBtnDown = document.querySelector('.counter__btn--down') // кнопка уменьшения

// данные от пользователя в числовом виде
let count = Number.parseInt(counterInput?.value, 10)

// клик на увеличение значения
counterBtnUp.addEventListener('click', () => {
  count++

  if (count === 10) {
    counterBtnUp.setAttribute('disabled', '')
  } else {
    counterBtnDown.removeAttribute('disabled', '')
  }

  // перезаписываем значение инпута
  counterInput.value = count
})

// клик на уменьшение значения
counterBtnDown.addEventListener('click', () => {
  count--

  if (count === 1) {
    counterBtnDown.setAttribute('disabled', '')
  } else {
    counterBtnUp.removeAttribute('disabled', '')
  }

  // перезаписываем значение инпута
  counterInput.value = count
})
