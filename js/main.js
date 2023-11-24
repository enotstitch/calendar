import select from './select.js';

const calendarDateStart = document.querySelector('.calendar-date--start');
const calendarDateEnd = document.querySelector('.calendar-date--end');
const wrapFirstSelects = document.querySelector('.calendar__selects-first');
const wrapSecondSelects = document.querySelector('.calendar__selects-second');

const now = new Date();
const nowDay = now.getDate();
const nowMonth = now.getMonth() + 1;
const nowYear = now.getFullYear();

const months = {
  Январь: 1,
  Февраль: 2,
  Март: 3,
  Апрель: 4,
  Май: 5,
  Июнь: 6,
  Июль: 7,
  Август: 8,
  Сентябрь: 9,
  Октябрь: 10,
  Ноябрь: 11,
  Декабрь: 12,
};

const numsMonth = {
  1: 'Января',
  2: 'Февраля',
  3: 'Марта',
  4: 'Апреля',
  5: 'Мая',
  6: 'Июня',
  7: 'Июля',
  8: 'Августа',
  9: 'Сентября',
  10: 'Октября',
  11: 'Ноября',
  12: 'Декабря',
};

const detectMonth = (month) => {
  return months[month];
};

let detectCaseMonth = (num) => {
  return numsMonth[num];
};

function addStyleFullDate(calendarItem) {
  const currentCalendarInner = calendarItem.querySelector(
    '.calendar-date__inner'
  );
  calendarItem.classList.add('calendar-date--white-bg');
  currentCalendarInner.classList.add('calendar-date__inner--peach-bg');

  const resetButton = document.createElement('button');
  resetButton.className = 'calendar-date__button-reset btn-reset';
  calendarItem.append(resetButton);
}

// function removeStyleFullDate(calendarItem) {
// 	const currentCalendarInner = calendarItem.querySelector(
// 		'.calendar-date__inner'
// 	);
// 	const resetButton = calendarItem.querySelector(
// 		'.calendar-date__button-reset'
// 	);

// 	calendarItem.classList.remove('calendar-date--white-bg');
// 	currentCalendarInner.classList.remove('calendar-date__inner--peach-bg');
// 	resetButton.remove();
// }

function removeBackground(calendarItem) {
  const currentCalendarInner = calendarItem.querySelector(
    '.calendar-date__inner'
  );
  const resetButton = calendarItem.querySelector(
    '.calendar-date__button-reset'
  );

  currentCalendarInner.classList.remove('calendar-date__inner--peach-bg');
  if (resetButton) {
    resetButton.classList.add('calendar-date__button-reset--transparent-bg');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const dateEndInput = calendarDateEnd.querySelector('.calendar-date__input');
  const monthName = detectCaseMonth(nowMonth);

  dateEndInput.value = `${nowDay} ${monthName} ${nowYear}`;

  addStyleFullDate(calendarDateEnd);
});

function createSelectYears(selectBodyElem) {
  selectBodyElem = document.querySelector(selectBodyElem);

  let minYear = nowYear - 20;

  for (let year = nowYear; year >= minYear; year--) {
    const selectItem = document.createElement('div');
    selectItem.className = 'select__item';
    selectItem.textContent = `${year}`;
    selectBodyElem.append(selectItem);
  }
}

function createSelectMonth(selectBodyElem) {
  selectBodyElem = document.querySelector(selectBodyElem);

  for (const month in months) {
    const selectItem = document.createElement('div');
    selectItem.className = 'select__item';
    selectItem.textContent = `${month}`;
    selectBodyElem.append(selectItem);
  }
}

function renderSelects(selectName, selectExtraClass, selectsWrap) {
  let select = `
  <div class="calendar__select select">
    <div class="select__header">
      <button class="select__button select__button--prev btn-reset"></button>
      <div class="select__current select-current">
        <span class="select-current__text">${selectName}</span>
        <img class="select-current__arrow" src="./icons/arrow.svg" alt="Стрелочка">
      </div>
      <button class="select__button select__button--next btn-reset"></button>
    </div>
    <div class="select__body ${selectExtraClass}"></div>
  </div>
	`;

  selectsWrap.innerHTML += select;
}

function createCalendar(elem, year, month) {
  elem = document.querySelector(elem);

  let mon = month - 1;
  let d = new Date(year, mon);

  let table = `
    <table>
    <tbody>
      <tr>
        <th>Пн</th>
        <th>Вт</th>
        <th>Ср</th>
        <th>Чт</th>
        <th>Пт</th>
        <th>Сб</th>
        <th>Вс</th>
      </tr>
      <tr>
  `;

  for (let i = 0; i < getDay(d); i++) {
    table += '<td class="empty-cell"></td>';
  }

  while (d.getMonth() == mon) {
    table += '<td>' + d.getDate() + '</td>';
    if (getDay(d) % 7 == 6) {
      table += '</tr><tr>';
    }
    d.setDate(d.getDate() + 1);
  }

  table += '</tr></tbody></table>';
  elem.innerHTML = table;
}

function getDay(date) {
  let day = date.getDay();
  if (day == 0) day = 7;
  return day - 1;
}

calendarDateStart.addEventListener('click', (event) => {
  removeBackground(calendarDateStart);
  calendarDateStart.classList.add('calendar-date--white-bg');

  let currentCalendar = event.target.closest('.calendar-form__item');
  let wrapCurrentSelects = currentCalendar.querySelector('.calendar__selects');
  wrapCurrentSelects.innerHTML = '';

  renderSelects('Выберите год', 'select__body--start-year', wrapFirstSelects);
  renderSelects(
    'Выберите месяц',
    'select__body--start-month',
    wrapFirstSelects
  );
  createSelectYears('.select__body--start-year');
  createSelectMonth('.select__body--start-month');
  select();
});

calendarDateEnd.addEventListener('click', (event) => {
  removeBackground(calendarDateEnd);
  calendarDateEnd.classList.add('calendar-date--white-bg');

  let currentCalendar = event.target.closest('.calendar-form__item');
  let wrapCurrentSelects = currentCalendar.querySelector('.calendar__selects');
  wrapCurrentSelects.innerHTML = '';

  renderSelects('Выберите год', 'select__body--end-year', wrapSecondSelects);
  renderSelects('Выберите месяц', 'select__body--end-month', wrapSecondSelects);
  createSelectYears('.select__body--end-year');
  createSelectMonth('.select__body--end-month');
  select();
});

// createCalendar('.calendar__item-first', 2023, 11);
// createCalendar('.calendar__item-second', 2023, 11);

// let year = '';
// let month = '';

// selects.forEach((select) => {
//   select.addEventListener('click', (event) => {
//     getYaer(event);
//     getMonth(event);
//     if (year && month) {
//       createCalendar('.calendar__modal', year, month);

//       let tables = document.querySelectorAll('table');
//       tables.forEach((table) => {
//         table.addEventListener('click', (event) => {
//           event.target.classList.add('active');
//         });
//       });
//     }
//   });
// });

// function getYaer(event) {
//   if (event.target.classList.contains('select__item--year')) {
//     year = event.target.textContent;
//     return event.target.textContent;
//   }
// }

// function getMonth(event) {
//   if (event.target.classList.contains('select__item--month')) {
//     month = detectMonth(event.target.textContent);
//     return detectMonth(event.target.textContent);
//   }
// }

// let numNorm = (num) => {
//   if (num < 10) return `0${num}`;
//   return num;
// };

// let inputRender = () => {
//   const tableItems = document.querySelectorAll('td');

//   tableItems.forEach((item) => {
//     item.addEventListener('click', (event) => {
//       const target = event.target;
//       if (target.textContent) {
//         const calendarItem = target.closest('.calendar-form__item');
//         const calendarInput = calendarItem.querySelector(
//           '.calendar-date__input'
//         );
//         calendarInput.value = `${numNorm(target.textContent)} ${detectCaseMonth(
//           month
//         )} ${year}`;
//       }
//     });
//   });
// };

// document.addEventListener("DOMContentLoaded", function () {
//     var phoneInputs = document.querySelectorAll('input[data-tel-input]');

//     var getInputNumbersValue = function (input) {
//         // Return stripped input value — just numbers
//         return input.value.replace(/\D/g, '');
//     }

//     var onPhonePaste = function (e) {
//         var input = e.target,
//             inputNumbersValue = getInputNumbersValue(input);
//         var pasted = e.clipboardData || window.clipboardData;
//         if (pasted) {
//             var pastedText = pasted.getData('Text');
//             if (/\D/g.test(pastedText)) {
//                 // Attempt to paste non-numeric symbol — remove all non-numeric symbols,
//                 // formatting will be in onPhoneInput handler
//                 input.value = inputNumbersValue;
//                 return;
//             }
//         }
//     }

//     var onPhoneInput = function (e) {
//         var input = e.target,
//             inputNumbersValue = getInputNumbersValue(input),
//             selectionStart = input.selectionStart,
//             formattedInputValue = "";

//         if (!inputNumbersValue) {
//             return input.value = "";
//         }

//         if (input.value.length != selectionStart) {
//             // Editing in the middle of input, not last symbol
//             if (e.data && /\D/g.test(e.data)) {
//                 // Attempt to input non-numeric symbol
//                 input.value = inputNumbersValue;
//             }
//             return;
//         }

//         if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
//             if (inputNumbersValue[0] == "9") inputNumbersValue = "7" + inputNumbersValue;
//             var firstSymbols = (inputNumbersValue[0] == "8") ? "8" : "+7";
//             formattedInputValue = input.value = firstSymbols + " ";
//             if (inputNumbersValue.length > 1) {
//                 formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
//             }
//             if (inputNumbersValue.length >= 5) {
//                 formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
//             }
//             if (inputNumbersValue.length >= 8) {
//                 formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
//             }
//             if (inputNumbersValue.length >= 10) {
//                 formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
//             }
//         } else {
//             formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
//         }
//         input.value = formattedInputValue;
//     }
//     var onPhoneKeyDown = function (e) {
//         // Clear input after remove last symbol
//         var inputValue = e.target.value.replace(/\D/g, '');
//         if (e.keyCode == 8 && inputValue.length == 1) {
//             e.target.value = "";
//         }
//     }
//     for (var phoneInput of phoneInputs) {
//         phoneInput.addEventListener('keydown', onPhoneKeyDown);
//         phoneInput.addEventListener('input', onPhoneInput, false);
//         phoneInput.addEventListener('paste', onPhonePaste, false);
//     }
// })
