import select from './select.js';

const calendars = document.querySelectorAll('.calendar-date');
const calendarItems = document.querySelectorAll('.calendar-form__item');

const SELECT_NAME = {
	YEAR: 'Выберите год',
	MONTH: 'Выберите месяц',
};

const now = new Date();
const nowDay = now.getDate();
const nowMonth = now.getMonth() + 1;
const nowYear = now.getFullYear();

let startDate = {
	day: nowDay,
	month: nowMonth,
	year: nowYear,
};

let endDate = {
	day: nowDay,
	month: nowMonth,
	year: nowYear,
};

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

function addStyleFullDate(calendarInput) {
	const currentCalendarInner = calendarInput.closest('.calendar-date__inner');
	const currentCalendar = calendarInput.closest('.calendar-date');
	currentCalendarInner.classList.add('calendar-date__inner--peach-bg');
	currentCalendar.classList.add('calendar-date--white-bg');

	const resetButton = document.createElement('button');
	resetButton.className = 'calendar-date__button-reset btn-reset';
	currentCalendar.append(resetButton);
}

function removeStyleFullDate(calendarItem) {
	const currentCalendarInner = calendarItem.querySelector(
		'.calendar-date__inner'
	);
	const resetButton = calendarItem.querySelector(
		'.calendar-date__button-reset'
	);

	calendarItem.classList.remove('calendar-date--white-bg');
	currentCalendarInner.classList.remove('calendar-date__inner--peach-bg');
	try {
		resetButton.remove();
	} catch {}
}

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

function resetDateInput(calendarItem) {
	const currentCalendarInput = calendarItem.querySelector(
		'.calendar-date__input'
	);
	const resetButton = calendarItem.querySelector(
		'.calendar-date__button-reset'
	);

	currentCalendarInput.value = '';
	calendarItem.classList.remove('calendar-date--white-bg');
	resetButton.remove();
}

window.addEventListener('DOMContentLoaded', () => {
	const dateEndInput = document.querySelector('[data-date-end]');
	const monthName = detectCaseMonth(nowMonth);

	dateEndInput.value = `${nowDay} ${monthName} ${nowYear}`;

	addStyleFullDate(dateEndInput);

	calendarItems.forEach((calendarItem) => {
		calendarItem.addEventListener('click', (event) => {
			const currentValues = calendarItem.querySelectorAll(
				'.select-current__text'
			);
			currentValues.forEach((currentValue) => {
				const currentValueText = currentValue.textContent;
				if (
					currentValue.classList.contains('select-current__text--year') &&
					currentValueText !== SELECT_NAME.YEAR
				) {
					if (currentValue.closest('.calendar-form__item--first')) {
						startDate.year = currentValueText;
						renderCalendars();
					} else if (currentValue.closest('.calendar-form__item--second')) {
						endDate.year = currentValueText;
						renderCalendars();
					}
				}
				if (
					currentValue.classList.contains('select-current__text--month') &&
					currentValueText !== SELECT_NAME.MONTH
				) {
					if (currentValue.closest('.calendar-form__item--first')) {
						startDate.month = detectMonth(currentValueText);
						renderCalendars();
					} else if (currentValue.closest('.calendar-form__item--second')) {
						endDate.month = detectMonth(currentValueText);
						renderCalendars();
					}
				}
			});
			if (!event.target.classList.contains('calendar-date__button-reset')) {
				renderCalendars();
			}
		});
	});
});

function createSelectYears(selectBody) {
	let selectBodies = document.querySelectorAll(selectBody);

	selectBodies.forEach((selectBody) => {
		let minYear = nowYear - 20;

		for (let year = nowYear; year >= minYear; year--) {
			const selectItem = document.createElement('div');
			selectItem.className = 'select__item';
			selectItem.textContent = `${year}`;
			selectBody.append(selectItem);
		}
	});
}

function createSelectMonth(selectBody) {
	let selectBodies = document.querySelectorAll(selectBody);

	selectBodies.forEach((selectBody) => {
		const currentSelect = selectBody.closest('.select');
		currentSelect.classList.add('disabled');
		for (const month in months) {
			const selectItem = document.createElement('div');
			selectItem.className = 'select__item';
			selectItem.textContent = `${month}`;
			selectBody.append(selectItem);
		}
	});
}

function renderSelects(selectName, selectExtraClass, selectsWrap) {
	const selectsWraps = document.querySelectorAll(selectsWrap);

	let select = `
  <div class="calendar__select select">
    <div class="select__header">
      <button class="select__button select__button--prev btn-reset" type="button"></button>
      <div class="select__current select-current">
        <span class="select-current__text select-current__text--${selectExtraClass}">${selectName}</span>
        <img class="select-current__arrow" src="./icons/arrow.svg" alt="Стрелочка">
      </div>
      <button class="select__button select__button--next btn-reset" type="button"></button>
    </div>
    <div class="select__body select__body--${selectExtraClass}"></div>
  </div>
	`;

	selectsWraps.forEach((selectsWrap) => {
		selectsWrap.innerHTML += select;
	});
}

function resetForm(event) {
	const calendarForm = event.target.closest('.calendar-form');
	const calendarDates = calendarForm.querySelectorAll('.calendar-date');
	const wrapsSelects = calendarForm.querySelectorAll('.calendar__selects');

	calendarForm.reset();

	calendarDates.forEach((calendarDate) => {
		removeStyleFullDate(calendarDate);
	});
	disableControlBlock();
	wrapsSelects.forEach((wrapSelects) => {
		wrapSelects.innerHTML = '';
	});
	renderSelects(SELECT_NAME.YEAR, 'year', '.calendar__selects');
	renderSelects(SELECT_NAME.MONTH, 'month', '.calendar__selects');
}

function acceptForm() {
	const inputs = document.querySelectorAll('[data-date-input]');
	inputs.forEach((input) => {
		const inputValue = input.value;
		const calendarItem = input.closest('.calendar-form__item');

		if (!inputValue.includes('.') || !inputValue) return;
		const isStartDateInput = calendarItem.classList.contains(
			'calendar-form__item--first'
		);
		const isEndDateInput = calendarItem.classList.contains(
			'calendar-form__item--second'
		);

		const inputDateArr = inputValue.split('.');
		let currentDay = +inputDateArr[0];
		let currentMonth = +inputDateArr[1];
		let currentYear = +inputDateArr[2];

		if (isStartDateInput) {
			startDate = {
				day: currentDay,
				month: currentMonth,
				year: currentYear,
			};
		}

		if (isEndDateInput) {
			endDate = {
				day: currentDay,
				month: currentMonth,
				year: currentYear,
			};
		}

		currentMonth = detectCaseMonth(currentMonth);

		let formattedInputValue = `${currentDay} ${currentMonth} ${currentYear}`;

		input.value = formattedInputValue;
		disableControlBlock();
	});

	renderCalendars();
}

function renderControlBlock() {
	const calendarBottom = document.querySelector('.calendar__bottom');

	const controlBlock = `
  <div class="calendar__control disabled">
    <button class="calendar__reset btn-reset" data-reset-btn type="button">Сбросить</button>
    <button class="calendar__apply btn-reset" data-accept-btn type="button">Применить</button>
  </div>
	`;

	calendarBottom.innerHTML = controlBlock;

	const formResetBtn = document.querySelector('[data-reset-btn]');
	const formAcceptBtn = document.querySelector('[data-accept-btn]');
	formResetBtn.addEventListener('click', resetForm);
	formAcceptBtn.addEventListener('click', acceptForm);
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

calendars.forEach((calendar) => {
	let currentInputDate = calendar.querySelector('.calendar-date__input');

	currentInputDate.addEventListener('blur', () => {
		calendar.classList.remove('calendar-date--white-bg');
	});

	currentInputDate.addEventListener('focus', () => {
		calendar.classList.add('calendar-date--white-bg');
	});

	calendar.addEventListener('click', (event) => {
		const isResetBtnClick = event.target.classList.contains(
			'calendar-date__button-reset'
		);

		let calendarWrap = event.target.closest('.calendar__wrap');
		let wrapsSelects = calendarWrap.querySelectorAll('.calendar__selects');

		calendar.classList.add('calendar-date--white-bg');
		removeBackground(calendar);

		if (isResetBtnClick) {
			resetDateInput(calendar);
			return;
		}

		wrapsSelects.forEach((wrapSelects) => {
			wrapSelects.innerHTML = '';
		});

		renderSelects(SELECT_NAME.YEAR, 'year', '.calendar__selects');
		renderSelects(SELECT_NAME.MONTH, 'month', '.calendar__selects');

		createSelectYears('.select__body--year');
		createSelectMonth('.select__body--month');
		select();
		renderControlBlock();
	});
});

function renderFirstCalendar() {
	const currentYear = startDate.year;
	const currentMonth = startDate.month;

	if (currentYear && currentMonth) {
		createCalendar('.calendar__modal--first', currentYear, currentMonth);
	}
}

function renderSecondCalendar() {
	const currentYear = endDate.year;
	const currentMonth = endDate.month;

	if (currentYear && currentMonth) {
		createCalendar('.calendar__modal--second', currentYear, currentMonth);
	}
}

function renderCalendars() {
	// if (startDate.year && startDate.month && endDate.year && endDate.month) {
	renderFirstCalendar();
	renderSecondCalendar();

	const tables = document.querySelectorAll('table');
	tables.forEach((table) => {
		table.addEventListener('click', tableClick);
	});
	// }
}

let numNormalize = (num) => {
	if (num < 10) return `0${num}`;
	return num;
};

function enableControlBlock() {
	const controlBlock = document.querySelector('.calendar__control');
	controlBlock.classList.remove('disabled');
}

function disableControlBlock() {
	const controlBlock = document.querySelector('.calendar__control');
	controlBlock.classList.add('disabled');
}

function dateInputUpdate(modalElem, dateObject) {
	const modal = document.querySelector(modalElem);
	const formItem = modal.closest('.calendar-form__item');
	const input = formItem.querySelector('.calendar-date__input');
	const currentDay = numNormalize(dateObject.day);
	const currentMonth = numNormalize(dateObject.month);
	const currentYear = dateObject.year;

	input.value = `${currentDay}.${currentMonth}.${currentYear}`;
}

function tableClick(event) {
	const cell = event.target;
	const cellValue = cell.textContent;
	const modal = cell.closest('.calendar__modal');
	if (!cellValue || cell.nodeName !== 'TD') return;

	if (modal.classList.contains('calendar__modal--first')) {
		startDate.day = +cellValue;
		dateInputUpdate('.calendar__modal--first', startDate);
	} else if (modal.classList.contains('calendar__modal--second')) {
		endDate.day = +cellValue;
		dateInputUpdate('.calendar__modal--second', endDate);
	}

	enableControlBlock();
}

window.addEventListener('DOMContentLoaded', () => {
	const inputs = document.querySelectorAll('[data-date-input]');

	function getInputNumbersValue(input) {
		return input.value.replace(/\D/g, '');
	}

	function onDateInput(event) {
		const input = event.target;
		const inputNumbersValue = getInputNumbersValue(input);
		let formattedInputValue = '';

		if (!inputNumbersValue) {
			return (input.value = '');
		}

		if (['0', '1', '2', '3'].includes(inputNumbersValue[0])) {
			formattedInputValue = input.value;
			if (inputNumbersValue.length > 1) {
				formattedInputValue = inputNumbersValue.substring(0, 2) + '.';
			}
		} else {
			input.value = '';
		}

		if (['0', '1'].includes(inputNumbersValue[2])) {
			if (inputNumbersValue.length >= 3) {
				formattedInputValue += inputNumbersValue.substring(2, 3);
			}
			if (inputNumbersValue.length >= 4) {
				formattedInputValue += inputNumbersValue.substring(3, 4) + '.';
			}
		}

		if (['1', '2'].includes(inputNumbersValue[4])) {
			if (inputNumbersValue.length >= 5) {
				formattedInputValue += inputNumbersValue.substring(4, 8);
			}
			if (inputNumbersValue.length === 8) {
				enableControlBlock();
			} else {
				disableControlBlock();
			}
		}

		input.value = formattedInputValue;
	}

	inputs.forEach((input) => {
		input.addEventListener('input', onDateInput);
	});
});
