import select from './select.js';

let selects = document.querySelectorAll('.select');

const detectMonth = (month) => {
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

	return months[month];
};

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
		table += '<td class="emptyCell"></td>';
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

	inputRender();
}

function getDay(date) {
	let day = date.getDay();
	if (day == 0) day = 7;
	return day - 1;
}

// createCalendar('.calendar__item-first', 2023, 11);
// createCalendar('.calendar__item-second', 2023, 11);

let year = '';
let month = '';

selects.forEach((select) => {
	select.addEventListener('click', (event) => {
		getYaer(event);
		getMonth(event);
		if (year && month) {
			createCalendar('.calendar__modal', year, month);
		}
	});
});

function getYaer(event) {
	if (event.target.classList.contains('select__item--year')) {
		year = event.target.textContent;
		return event.target.textContent;
	}
}

function getMonth(event) {
	if (event.target.classList.contains('select__item--month')) {
		month = detectMonth(event.target.textContent);
		return detectMonth(event.target.textContent);
	}
}

let numNorm = (num) => {
	if (num < 10) return `0${num}`;
	return num;
};

let detectCaseMonth = (num) => {
	const nums = {
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

	return nums[month];
};

let inputRender = () => {
	const tableItems = document.querySelectorAll('td');

	tableItems.forEach((item) => {
		item.addEventListener('click', (event) => {
			const target = event.target;
			if (target.textContent) {
				const calendarItem = target.closest('.calendar-form__item');
				const calendarInput = calendarItem.querySelector(
					'.calendar-date__input'
				);
				calendarInput.value = `${numNorm(target.textContent)} ${detectCaseMonth(
					month
				)} ${year}`;
			}
		});
	});
};

select();
