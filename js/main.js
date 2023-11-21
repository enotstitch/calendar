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
    table += '<td></td>';
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

// createCalendar('.calendar__item-first', 2023, 11);
// createCalendar('.calendar__item-second', 2023, 11);

selects.forEach((select) => {
  select.addEventListener('click', (event) => {
    createCalendar('.calendar__modal', getYaer(event), getMonth(event));
    console.log(getMonth(event));
  });
});

function getYaer(event) {
  if (event.target.classList.contains('select__item--year')) {
    return event.target.textContent;
  } else {
    return 2023;
  }
}

function getMonth(event) {
  if (event.target.classList.contains('select__item--month')) {
    return detectMonth(event.target.textContent);
  }
}

select();

// createCalendar('.calendar__item-second', 2022, 12);
