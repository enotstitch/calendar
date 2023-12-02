import select from './select.js';

const calendar = document.querySelector('.calendar');
const calendars = document.querySelectorAll('.calendar-date');
const calendarError = document.querySelector('.calendar-error');
const calendarItems = document.querySelectorAll('.calendar-form__item');
const calendarFirstItem = document.querySelector('.calendar-form__item--first');
const calendarSecondItem = document.querySelector(
	'.calendar-form__item--second'
);

const screenWidth = window.screen.width;

const SELECT_NAME = {
	YEAR: 'Выберите год',
	MONTH: 'Выберите месяц',
};

const ERROR_MESSAGE = {
	PERIOD: 'Дата начала периода превышает дату окончания',
	PRESENT_DAY: 'Выберите дату не позднее сегодняшнего дня',
	AGE: 'Возраст соискателя должен быть не менее 14 лет',
};

const now = new Date();
const nowDay = now.getDate();
const nowMonth = now.getMonth() + 1;
const nowYear = now.getFullYear();

function updateDateObj(storageItemName, dateObj) {
	sessionStorage.setItem(storageItemName, JSON.stringify(dateObj));
}

let startDate = {
	day: '',
	month: '',
	year: '',
	cellItem: '',
};

let endDate = {
	day: nowDay,
	month: nowMonth,
	year: nowYear,
	cellItem: '',
};

updateDateObj('startDate', startDate);
updateDateObj('endDate', endDate);

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

const numsCaseMonth = {
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

const numsMonth = {
	1: 'Январь',
	2: 'Февраль',
	3: 'Март',
	4: 'Апрель',
	5: 'Май',
	6: 'Июнь',
	7: 'Июль',
	8: 'Август',
	9: 'Сентябрь',
	10: 'Октябрь',
	11: 'Ноябрь',
	12: 'Декабрь',
};

const nameMonth = {
	Января: 1,
	Февраля: 2,
	Марта: 3,
	Апреля: 4,
	Мая: 5,
	Июня: 6,
	Июля: 7,
	Августа: 8,
	Сентября: 9,
	Октября: 10,
	Ноября: 11,
	Декабря: 12,
};

const detectMonth = (month) => {
	return months[month];
};

let detectCaseMonth = (num) => {
	return numsCaseMonth[num];
};

let detectNameMonth = (num) => {
	return nameMonth[num];
};

let detectNumberMonth = (num) => {
	return numsMonth[num];
};

//* Добавление стилей для заполненного инпута
function addStyleFullDate(calendarInput) {
	const currentCalendarInner = calendarInput.closest('.calendar-date__inner');
	const currentCalendar = calendarInput.closest('.calendar-date');
	const calendarDate = currentCalendarInner.closest('.calendar-date');
	currentCalendarInner.classList.add('calendar-date__inner--peach-bg');
	currentCalendar.classList.add('calendar-date--white-bg');
	const resetButton = calendarDate.querySelector(
		'.calendar-date__button-reset'
	);

	if (!resetButton) {
		const resetButton = document.createElement('button');
		resetButton.className = 'calendar-date__button-reset btn-reset';
		resetButton.setAttribute('data-title', 'Очистить поле?');
		currentCalendar.append(resetButton);
	} else {
		resetButton.classList.remove('calendar-date__button-reset--transparent-bg');
	}
}

//* Удаление фона
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



//* Сброс инпута
function resetDateInput(calendarItem) {
	const currentCalendarInput = calendarItem.querySelector(
		'.calendar-date__input'
	);
	const resetButton = calendarItem.querySelector(
		'.calendar-date__button-reset'
	);
	const isFirstFormItem = currentCalendarInput.closest(
		'.calendar-form__item--first'
	);
	const isSecondFormItem = currentCalendarInput.closest(
		'.calendar-form__item--second'
	);
	const wrapsSelects = document.querySelectorAll('.calendar__selects');
	let isEmptySelectsWrap = false;

	currentCalendarInput.value = '';
	calendarItem.classList.remove('calendar-date--white-bg');
	resetButton.remove();

	if (isFirstFormItem) {
		startDate = {
			...startDate,
			day: '',
			month: '',
			year: '',
			cellItem: '',
		};
		renderFirstCalendar();
		const calendarModal = document.querySelector('.calendar__modal--first');
		calendarModal.innerHTML = '';
	}
	if (isSecondFormItem) {
		endDate = {
			...endDate,
			day: '',
			month: '',
			year: '',
			cellItem: '',
		};
		renderSecondCalendar();
		const calendarModal = document.querySelector('.calendar__modal--second');
		calendarModal.innerHTML = '';
	}

	wrapsSelects.forEach((wrapSelects) => {
		if (!wrapSelects.innerHTML) {
			isEmptySelectsWrap = true;
			return;
		}
		wrapSelects.innerHTML = '';
	});

	if (!isEmptySelectsWrap) {
		renderSelects(SELECT_NAME.YEAR, 'year', '.calendar__selects');
		renderSelects(SELECT_NAME.MONTH, 'month', '.calendar__selects');
		createSelectYears('.select__body--year');
		createSelectMonth('.select__body--month');
		select();
	}

	const tables = document.querySelectorAll('table');
	const controlBlock = document.querySelector('.calendar__control');
	if (!tables.length) {
		controlBlock.remove();
	}

	clearError();
	renderError();
}

//* Рендер по умолчанию
window.addEventListener('DOMContentLoaded', () => {
	if (screenWidth <= 640) {
		renderHeaderCalendar('Выберите период');
	}

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
					currentValueText !== SELECT_NAME.YEAR &&
					!event.target.closest('table')
				) {
					if (currentValue.closest('.calendar-form__item--first')) {
						startDate.year = currentValueText;
						renderFirstCalendar();
					} else if (currentValue.closest('.calendar-form__item--second')) {
						endDate.year = currentValueText;
						renderSecondCalendar();
					}
				}
				if (
					currentValue.classList.contains('select-current__text--month') &&
					currentValueText !== SELECT_NAME.MONTH &&
					!event.target.closest('table')
				) {
					if (currentValue.closest('.calendar-form__item--first')) {
						startDate.month = detectMonth(currentValueText);
						renderFirstCalendar();
					} else if (currentValue.closest('.calendar-form__item--second')) {
						endDate.month = detectMonth(currentValueText);
						renderSecondCalendar();
					}
				}
			});
			if (
				!event.target.classList.contains('calendar-date__button-reset') &&
				!event.target.closest('table')
			) {
				renderCalendars();
				addTableRange();
			}
		});
	});
});

if (screenWidth <= 640) {
	calendarItems.forEach((calendarItem) => {
		calendarItem.addEventListener('click', (event) => {
			const isClickFirstCalendar = event.target.closest(
				'.calendar-form__item--first'
			);
			const isClickSecondCalendar = event.target.closest(
				'.calendar-form__item--second'
			);

			if (isClickFirstCalendar) {
				calendarSecondItem.style.display = 'none';
			}

			if (isClickSecondCalendar) {
				calendarFirstItem.style.display = 'none';
			}
		});
	});
}

//* Создание селекта (год)
function createSelectYears(selectBody) {
	let selectBodies = document.querySelectorAll(selectBody);

	selectBodies.forEach((selectBody) => {
		let minYear = nowYear - 20;

		for (let year = nowYear; year > minYear; year--) {
			const selectItem = document.createElement('div');
			selectItem.className = 'select__item';
			selectItem.textContent = `${year}`;
			selectBody.append(selectItem);
		}
	});
}

//* Создание селекта (месяц)
function createSelectMonth(selectBody) {
	let selectBodies = document.querySelectorAll(selectBody);

	selectBodies.forEach((selectBody) => {
		for (const month in months) {
			const selectItem = document.createElement('div');
			selectItem.className = 'select__item';
			selectItem.textContent = `${month}`;
			selectBody.append(selectItem);
		}
	});
}

//* Рендер селектов
function renderSelects(selectName, selectExtraClass, selectsWrap) {
	const selectsWraps = document.querySelectorAll(selectsWrap);
	let mobileClass = '';

	if (screenWidth < 640) {
		mobileClass = 'select--mobile';
	}

	selectsWraps.forEach((selectsWrap) => {
		let currentSelectName = '';
		let dataSetName = '';
		const calendarItem = selectsWrap.closest('.calendar-form__item');
		const isStartCalendar = calendarItem.classList.contains(
			'calendar-form__item--first'
		);
		const isEndCalendar = calendarItem.classList.contains(
			'calendar-form__item--second'
		);
		const isYearSelect = selectName === SELECT_NAME.YEAR;
		const isMonthSelect = selectName === SELECT_NAME.MONTH;
		let isDisabledSelect = '';
		let maxLength = '';

		if (isYearSelect) {
			maxLength = '4';
		} else if (isMonthSelect) {
			maxLength = '8';
		}

		if (isStartCalendar) {
			if (isYearSelect) {
				if (startDate.year) {
					currentSelectName = startDate.year;
				} else {
					currentSelectName = selectName;
				}
				dataSetName = 'year-select';
			}
			if (isMonthSelect) {
				if (startDate.month) {
					currentSelectName = detectNumberMonth(startDate.month);
				} else {
					currentSelectName = selectName;
					isDisabledSelect = true;
				}
				dataSetName = 'month-select';
			}
		}
		if (isEndCalendar) {
			if (isYearSelect) {
				if (endDate.year) {
					currentSelectName = endDate.year;
				} else {
					currentSelectName = selectName;
				}
				dataSetName = 'year-select';
			}
			if (isMonthSelect) {
				if (endDate.month) {
					currentSelectName = detectNumberMonth(endDate.month);
				} else {
					currentSelectName = selectName;
					isDisabledSelect = true;
				}
				dataSetName = 'month-select';
			}
		}

		let searchSelect = `
    <div class="calendar__search calendar-search">
      <input class="calendar-search__input" type="tel" placeholder="Поиск" maxlength=${maxLength}>
    </div>
    `;

		let select = `
  <div class="calendar__select select ${mobileClass} ${
			isDisabledSelect ? 'disabled' : ''
		}" data-${dataSetName}" data-${dataSetName}>
    <div class="select__header">
    <button class="select__button select__button--prev btn-reset" type="button"></button>
    <div class="select__current select-current">
    <span class="select-current__text select-current__text--${selectExtraClass}">${currentSelectName}</span>
        <img class="select-current__arrow" src="./icons/arrow.svg" alt="Стрелочка">
      </div>
      <button class="select__button select__button--next btn-reset" type="button"></button>
    </div>
    <div class="select__body select__body--${selectExtraClass}">
      ${screenWidth <= 640 ? searchSelect : ''}
    </div>
  </div>
	`;

		selectsWrap.innerHTML += select;
	});
}

//* Нажатие на "Сбросить"
function resetForm(event) {
	const calendarForm = event.target.closest('.calendar-form');
	const wrapsSelects = calendarForm.querySelectorAll('.calendar__selects');

	startDate = JSON.parse(sessionStorage.getItem('startDate'));
	endDate = JSON.parse(sessionStorage.getItem('endDate'));

	setInputFormattedDate('.calendar__modal--first', startDate);
	setInputFormattedDate('.calendar__modal--second', endDate);

	disableControlBlock();
	wrapsSelects.forEach((wrapSelects) => {
		wrapSelects.innerHTML = '';
	});

	closePopups();
}

//* Нажатие на "Применить"
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

		addStyleFullDate(input);

		const inputDateArr = inputValue.split('.');
		let currentDay = +inputDateArr[0];
		let currentMonth = +inputDateArr[1];
		let currentYear = +inputDateArr[2];

		if (isStartDateInput) {
			startDate = {
				...startDate,
				day: currentDay,
				month: currentMonth,
				year: currentYear,
			};
		}

		if (isEndDateInput) {
			endDate = {
				...endDate,
				day: currentDay,
				month: currentMonth,
				year: currentYear,
			};
		}

		updateDateObj('startDate', startDate);
		updateDateObj('endDate', endDate);

		currentMonth = detectCaseMonth(currentMonth);

		let formattedInputValue = `${currentDay} ${currentMonth} ${currentYear}`;

		input.value = formattedInputValue;
	});
	disableControlBlock();
	closePopups();
	clearError();
	renderError();
}

//* Рендер контрол. блока
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

//* Создание календаря
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

	currentInputDate.addEventListener('blur', (event) => {
		calendar.classList.remove('calendar-date--white-bg');
		if (event.target.value.length != 10) {
			startDate = JSON.parse(sessionStorage.getItem('startDate'));
			endDate = JSON.parse(sessionStorage.getItem('endDate'));

			setInputFormattedDate('.calendar__modal--first', startDate);
			setInputFormattedDate('.calendar__modal--second', endDate);
		}
	});

	currentInputDate.addEventListener('focus', () => {
		calendar.classList.add('calendar-date--white-bg');
	});

	//* Обработка клика по календарю
	calendar.addEventListener('click', (event) => {
		const isResetBtnClick = event.target.classList.contains(
			'calendar-date__button-reset'
		);

		let calendarWrap = event.target.closest('.calendar__wrap');
		let wrapsSelects = calendarWrap.querySelectorAll('.calendar__selects');
		const input = calendar.querySelector('.calendar-date__input');

		if (input.value && input.value.includes(' ')) {
			const currentDateArr = input.value.split(' ');
			let currentDay = currentDateArr[0];
			let currentMonth = currentDateArr[1];
			let currentYear = currentDateArr[2];
			currentDay = numNormalize(currentDay);
			currentMonth = detectNameMonth(currentMonth);
			currentMonth = numNormalize(currentMonth);

			input.value = `${currentDay}.${currentMonth}.${currentYear}`;
		}

		calendar.classList.add('calendar-date--white-bg');
		removeBackground(calendar);

		if (isResetBtnClick) {
			resetDateInput(calendar);
			return;
		}

		wrapsSelects.forEach((wrapSelects) => {
			wrapSelects.innerHTML = '';
		});

		clearError();

		renderSelects(SELECT_NAME.YEAR, 'year', '.calendar__selects');
		renderSelects(SELECT_NAME.MONTH, 'month', '.calendar__selects');

		createSelectYears('.select__body--year');
		createSelectMonth('.select__body--month');
		select();

		renderControlBlock();
		addTableRange();
	});
});

//* Рендер первого календаря
function renderFirstCalendar() {
	const currentYear = startDate.year;
	const currentMonth = startDate.month;
	const tables = document.querySelectorAll('table');

	if (currentYear && currentMonth) {
		createCalendar('.calendar__modal--first', currentYear, currentMonth);
		tables.forEach((table) => {
			table.addEventListener('click', tableClick);
		});
		renderControlBlock();
	}
}

//* Рендер второго календаря
function renderSecondCalendar() {
	const currentYear = endDate.year;
	const currentMonth = endDate.month;
	const tables = document.querySelectorAll('table');

	if (currentYear && currentMonth) {
		createCalendar('.calendar__modal--second', currentYear, currentMonth);
		tables.forEach((table) => {
			table.addEventListener('click', tableClick);
		});
		renderControlBlock();
	}
}

//* Рендер обоих календарей
function renderCalendars() {
	renderFirstCalendar();
	renderSecondCalendar();

	const tables = document.querySelectorAll('table');
	tables.forEach((table) => {
		table.addEventListener('click', tableClick);
	});
}

//* Нормализация цифр (5 => 05)
let numNormalize = (num) => {
	if (num < 10) return `0${num}`;
	return num;
};

//* Включение контрол. блока
function enableControlBlock() {
	const controlBlock = document.querySelector('.calendar__control');
	controlBlock.classList.remove('disabled');
}

//* Отключение контрол. блока
function disableControlBlock() {
	const controlBlock = document.querySelector('.calendar__control');
	controlBlock.classList.add('disabled');
}

//* Замена даты на формат ДД.ММ.ГГГГ
function dateInputUpdate(modalElem, dateObject) {
	const modal = document.querySelector(modalElem);
	const formItem = modal.closest('.calendar-form__item');
	const input = formItem.querySelector('.calendar-date__input');
	const currentDay = numNormalize(dateObject.day);
	const currentMonth = numNormalize(dateObject.month);
	const currentYear = dateObject.year;

	input.value = `${currentDay}.${currentMonth}.${currentYear}`;
}

function setInputFormattedDate(modalElem, dateObject) {
	const modal = document.querySelector(modalElem);
	const formItem = modal.closest('.calendar-form__item');
	const input = formItem.querySelector('.calendar-date__input');
	const currentDay = dateObject.day;
	const currentMonth = detectCaseMonth(dateObject.month);
	const currentYear = dateObject.year;

	if (currentDay && currentMonth && currentYear) {
		input.value = `${currentDay} ${currentMonth} ${currentYear}`;
		addStyleFullDate(input);
	} else {
		input.value = '';
	}
}

//* Закрытие всех элементов кроме инпутов
function closePopups() {
	const wrapsSelects = document.querySelectorAll('.calendar__selects');
	const tables = document.querySelectorAll('table');
	const controlBlock = document.querySelector('.calendar__control');

	wrapsSelects.forEach((wrapSelects) => {
		wrapSelects.innerHTML = '';
	});
	tables.forEach((table) => {
		table.remove();
	});
	controlBlock.remove();
}

// * Создание ошибки
function showError(errorMessage) {
	const errorItem = document.createElement('p');
	errorItem.className = 'calendar-error__item';
	errorItem.textContent = `${errorMessage}`;
	calendarError.append(errorItem);
}

// * Рендер ошибки
function renderError() {
	let dateStart = startDate;
	let dateEnd = endDate;

	const equalDateEnd = new Date(
		`${dateEnd.month}.${dateEnd.day}.${dateEnd.year}`
	);

	const equalDateStart = new Date(
		`${dateStart.month}.${dateStart.day}.${dateStart.year}`
	);

	if (equalDateStart > equalDateEnd) {
		showError(ERROR_MESSAGE.PERIOD);
	}

	if (equalDateStart > now || equalDateEnd > now) {
		showError(ERROR_MESSAGE.PRESENT_DAY);
	}
}

// * Очистка ошибки
function clearError() {
	const errorItems = calendarError.querySelectorAll('.calendar-error__item');

	errorItems.forEach((errorItem) => {
		if (errorItem) {
			errorItem.remove();
		}
	});
}

//* Добавление диапазона в таблицу
function addTableRange() {
	let currentStartCell;
	let currentEndCell;
	const startDateDay = startDate.day;
	const endDateDay = endDate.day;
	const startDateModal = document.querySelector('.calendar__modal--first');
	const endDateModal = document.querySelector('.calendar__modal--second');
	const startCellItems = startDateModal.querySelectorAll('td');
	const endCellItems = endDateModal.querySelectorAll('td');
	const startCalendarItems = startDateModal.querySelectorAll('td');
	const endCalendarItems = endDateModal.querySelectorAll('td');
	const selectedItems = document.querySelectorAll('td.background-cell');
	const currentItems = document.querySelectorAll('td.current-cell');

	startCellItems.forEach((item) => {
		if (item.textContent && item.textContent == startDateDay) {
			currentStartCell = item;
		}
	});

	endCellItems.forEach((item) => {
		if (item.textContent && item.textContent == endDateDay) {
			currentEndCell = item;
		}
	});

	if (currentStartCell) {
		currentStartCell.classList.add('current-cell');
	}

	if (currentEndCell) {
		currentEndCell.classList.add('current-cell');
	}

	if (!currentStartCell || !currentEndCell) return;

	selectedItems.forEach((item) => {
		item.classList.remove('background-cell');
	});
	currentItems.forEach((item) => {
		item.classList.remove('current-cell');
	});

	if (startDate.year == endDate.year && startDate.month == endDate.month) {
		startCalendarItems.forEach((item) => {
			if (
				item.textContent > startDateDay &&
				item.textContent < endDateDay &&
				!item.classList.contains('empty-cell')
			) {
				item.classList.add('background-cell');
			} else if (
				item.textContent == startDateDay ||
				item.textContent == endDateDay
			) {
				item.classList.add('current-cell');
			}
		});
		endCalendarItems.forEach((item) => {
			if (
				item.textContent < endDateDay &&
				item.textContent > startDateDay &&
				!item.classList.contains('empty-cell')
			) {
				item.classList.add('background-cell');
			} else if (
				item.textContent == endDateDay ||
				item.textContent == startDateDay
			) {
				item.classList.add('current-cell');
			}
		});
		return;
	}

	startCalendarItems.forEach((item) => {
		if (
			item.textContent > startDateDay &&
			!item.classList.contains('empty-cell')
		) {
			item.classList.add('background-cell');
		} else if (item.textContent == startDateDay) {
			item.classList.add('current-cell');
		}
	});

	endCalendarItems.forEach((item) => {
		if (
			item.textContent < endDateDay &&
			!item.classList.contains('empty-cell')
		) {
			item.classList.add('background-cell');
		} else if (item.textContent == endDateDay) {
			item.classList.add('current-cell');
		}
	});
}

//* Обработка клика по таблице
function tableClick(event) {
	const cell = event.target;
	const cellValue = cell.textContent;
	const modal = cell.closest('.calendar__modal');
	const isCellDateClick = !cellValue || cell.nodeName !== 'TD';
	const isFirstModal = modal.classList.contains('calendar__modal--first');
	const isSecondModal = modal.classList.contains('calendar__modal--second');
	if (isFirstModal) {
		startDate.cellItem = cell;
	}

	if (isSecondModal) {
		endDate.cellItem = cell;
	}

	if (isCellDateClick) return;
	if (modal.classList.contains('calendar__modal--first')) {
		startDate.day = +cellValue;
		dateInputUpdate('.calendar__modal--first', startDate);
	} else if (modal.classList.contains('calendar__modal--second')) {
		endDate.day = +cellValue;
		dateInputUpdate('.calendar__modal--second', endDate);
	}

	try {
		const currentCell = modal.querySelector('.current-cell');
		currentCell.classList.remove('current-cell');
	} catch {}

	cell.classList.add('current-cell');

	enableControlBlock();
	addTableRange();
}

// * Маска
window.addEventListener('DOMContentLoaded', () => {
	const inputs = document.querySelectorAll('[data-date-input]');

	function getInputNumbersValue(input) {
		return input.value.replace(/\D/g, '');
	}

	function onDateInput(event) {
		const input = event.target;
		const inputNumbersValue = getInputNumbersValue(input);
		let formattedInputValue = '';
		let selectionStart = input.selectionStart;
		let day, month, year;

		if (!inputNumbersValue) {
			return (input.value = '');
		}

		if (event.inputType === 'deleteContentBackward') {
			input.setSelectionRange(selectionStart, selectionStart);
			return;
		}

		function formattedFix() {
			let dateArr = input.value.split('.');
			day = dateArr[0];
			month = dateArr[1];
			year = dateArr[2];
		}
		formattedFix();

		if (input.value.length != selectionStart) {
			if ((selectionStart == 0 || selectionStart == 1) && day.length !== 2) {
				return;
			} else if (selectionStart == 2 && day.length === 2) {
				input.setSelectionRange(3, 3);
				return;
			}
			if ((selectionStart == 3 || selectionStart == 4) && month.length !== 2) {
				return;
			} else if (
				(selectionStart == 4 || selectionStart == 5) &&
				month.length === 2
			) {
				input.setSelectionRange(6, 6);
				return;
			}
			if (
				(selectionStart == 6 ||
					selectionStart == 7 ||
					selectionStart == 8 ||
					selectionStart == 9) &&
				year.length !== 4
			) {
				return;
			}

			if (selectionStart != 1 && selectionStart != 4) {
				input.setSelectionRange(input.value.length, input.value.length);
			}
		}

		//* Стирание в середине
		// if (input.value.length != selectionStart) {
		// 	if (event.data && /\D/g.test(event.data)) {
		// 		input.value = inputNumbersValue;
		// 	}
		// 	return;
		// }

		//* Оригинал
		// if (['0', '1', '2'].includes(inputNumbersValue[0])) {
		// 	formattedInputValue = input.value;
		// 	if (inputNumbersValue.length > 1) {
		// 		formattedInputValue = inputNumbersValue.substring(0, 2) + '.';
		// 	}
		// } else {
		// 	input.value = '';
		// }

		//* Маска для дня
		if (['0', '1', '2'].includes(inputNumbersValue[0])) {
			formattedInputValue = inputNumbersValue.substring(0, 2) + '.';
			input.value = formattedInputValue;

			if (inputNumbersValue.length < 2) {
				input.setSelectionRange(1, 1);
			} else if (selectionStart != 1) {
				input.setSelectionRange(input.value.length, input.value.length);
			}

			input.addEventListener('keydown', (e) => {
				if (e.keyCode == 39 && input.value.length === 2) {
					input.value = '0' + formattedInputValue;
				}
			});
		} else if (['3'].includes(inputNumbersValue[0])) {
			formattedInputValue = inputNumbersValue.substring(0, 1) + '.';
			input.value = formattedInputValue;

			if (inputNumbersValue.length < 2) {
				input.setSelectionRange(1, 1);
			} else if (selectionStart != 1) {
				input.setSelectionRange(input.value.length, input.value.length);
			}

			if (['0', '1'].includes(inputNumbersValue[1])) {
				formattedInputValue = inputNumbersValue.substring(0, 2) + '.';
			} else {
				input.setSelectionRange(1, 1);
			}
			input.addEventListener('keydown', (e) => {
				if (e.keyCode == 39 && input.value.length < 3) {
					input.value = '0' + formattedInputValue;
				}
			});
			input.value = formattedInputValue;
		} else if (['4', '5', '6', '7', '8', '9'].includes(inputNumbersValue[0])) {
			formattedInputValue = '0' + inputNumbersValue.substring(0, 1) + '.';
			input.value = formattedInputValue;
		} else {
			input.value = '';
		}

		//* Маска для месяца
		if (['0'].includes(inputNumbersValue[2])) {
			formattedInputValue += inputNumbersValue.substring(2, 4) + '.';
			input.value = formattedInputValue;

			if (inputNumbersValue.length < 4) {
				input.setSelectionRange(4, 4);
			} else {
				input.setSelectionRange(input.value.length, input.value.length);
			}
		} else if (['1'].includes(inputNumbersValue[2])) {
			formattedInputValue += inputNumbersValue.substring(2, 3) + '.';
			input.value = formattedInputValue;

			if (inputNumbersValue.length < 4) {
				input.setSelectionRange(4, 4);
			} else {
				input.setSelectionRange(input.value.length, input.value.length);
			}

			if (['0', '1', '2'].includes(inputNumbersValue[3])) {
				formattedInputValue = formattedInputValue.substring(0, 3);
				formattedInputValue += inputNumbersValue.substring(2, 4) + '.';
			} else {
				input.setSelectionRange(4, 4);
			}

			input.addEventListener('keyup', (e) => {
				if (e.keyCode == 39 && input.value.length === 5) {
					formattedInputValue = '0' + formattedInputValue.substring(3, 4) + '.';
					input.value = input.value.substring(0, 3) + formattedInputValue;
				}
			});
			input.value = formattedInputValue;
		} else if (
			['2', '3', '4', '5', '6', '7', '8', '9'].includes(inputNumbersValue[2])
		) {
			formattedInputValue = formattedInputValue.substring(0, 3);
			formattedInputValue += '0' + inputNumbersValue.substring(2, 3) + '.';
			input.value = formattedInputValue;
		}

		//* Маска для года
		if (['1', '2'].includes(inputNumbersValue[4])) {
			formattedInputValue += inputNumbersValue.substring(4, 9);
			input.value = formattedInputValue;
		}
	}

	function closestModalElem(input) {
		const calendarFormItem = input.closest('.calendar-form__item');
		const modalElem = calendarFormItem.querySelector('.calendar__modal');

		return modalElem;
	}

	function handleKeyUp(event) {
		const input = event.target;
		const wrapsSelects = document.querySelectorAll('.calendar__selects');
		const modalElem = closestModalElem(input);
		const isFirstCalendar = modalElem.classList.contains(
			'calendar__modal--first'
		);
		const isSecondCalendar = modalElem.classList.contains(
			'calendar__modal--second'
		);

		const dateArr = input.value.split('.');
		const day = +dateArr[0];
		const month = +dateArr[1];
		const year = +dateArr[2];

		if (input.value.length === 10) {
			renderControlBlock();

			if (isFirstCalendar) {
				startDate = {
					...startDate,
					day: day,
					month: month,
					year: year,
				};
			} else if (isSecondCalendar) {
				endDate = {
					...startDate,
					day: day,
					month: month,
					year: year,
				};
			}

			wrapsSelects.forEach((wrapSelects) => {
				wrapSelects.innerHTML = '';
			});

			renderSelects(SELECT_NAME.YEAR, 'year', '.calendar__selects');
			renderSelects(SELECT_NAME.MONTH, 'month', '.calendar__selects');
			createSelectYears('.select__body--year');
			createSelectMonth('.select__body--month');
			select();
			renderCalendars();
			enableControlBlock();
			addTableRange();
		} else {
			disableControlBlock();
		}
	}

	inputs.forEach((input) => {
		input.addEventListener('input', onDateInput);
		input.addEventListener('keyup', handleKeyUp);
	});
});

// // * Мобильная версия
// if (screenWidth <= 768) {
//   calendarItems.forEach((calendarItem) => {
//     calendarItem.addEventListener('click', (event) => {
//       const calendarHeader = document.querySelector('.calendar-header');
//       const isClickFirstCalendar = event.target.closest(
//         '.calendar-form__item--first'
//       );
//       const isClickSecondCalendar = event.target.closest(
//         '.calendar-form__item--second'
//       );

//       // ? Перенести в селекты изначально при мобильном разрешении
//       const selectBodies = document.querySelectorAll('.select__body');
//       selectBodies.forEach((selectBody) => {
//         selectBody.style.display = 'none';
//       });
//       // ?

//       if (calendarHeader) {
//         calendarHeader.remove();
//       }

//       renderHeaderCalendar('Выберите период');

//       if (isClickFirstCalendar) {
//         calendarSecondItem.style.display = 'none';
//       }

//       if (isClickSecondCalendar) {
//         calendarFirstItem.style.display = 'none';
//       }
//     });
//   });
// }

// * Функция закрытия активных селектов
function closeActivePopups() {
	const wrapSelects = document.querySelector('.calendar__selects');
	const selectItems = wrapSelects.querySelectorAll('.select');

	selectItems.forEach((selectItem) => {
		if (selectItem.classList.contains('is-active')) {
			selectItem.classList.remove('is-active');
		}
	});
}

function renderHeaderCalendar(headerTitle) {
	const headerCalendar = document.createElement('div');
	headerCalendar.className = 'calendar__header calendar-header';

	const headerCalendarBtnPrev = document.createElement('button');
	headerCalendarBtnPrev.className = 'calendar-header__prev btn-reset';
	headerCalendar.append(headerCalendarBtnPrev);

	const headerCalendarTitle = document.createElement('p');
	headerCalendarTitle.className = 'calendar-header__title';
	headerCalendarTitle.textContent = `${headerTitle}`;
	headerCalendar.append(headerCalendarTitle);

	const headerCalendarBtnClose = document.createElement('button');
	headerCalendarBtnClose.className = 'calendar-header__close btn-reset';
	headerCalendar.append(headerCalendarBtnClose);

	calendar.prepend(headerCalendar);
}
