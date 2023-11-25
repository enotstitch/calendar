let select = function () {
  let selectHeader = document.querySelectorAll('.select-current');
  let selectItem = document.querySelectorAll('.select__item');
  let selectBtnsNext = document.querySelectorAll('.select__button--next');
  let selectBtnsPrev = document.querySelectorAll('.select__button--prev');

  let i = 0;

  window.addEventListener('click', (event) => {
    const select = document.querySelector('.select');
    const isSelectActive = select.classList.contains('is-active');
    const isSelectClick = event.target.closest('.select');

    if (isSelectActive && !isSelectClick) {
      select.classList.remove('is-active');
    }
  });

  selectHeader.forEach((item) => {
    item.addEventListener('click', selectToggle);
  });

  selectItem.forEach((item) => {
    item.addEventListener('click', selectChoose);
  });

  function selectToggle() {
    const select = this.parentElement.closest('.select');
    select.classList.toggle('is-active');
  }

  function selectChoose() {
    let text = this.innerText,
      select = this.closest('.select'),
      currentText = select.querySelector('.select-current__text');
    currentText.innerText = text;
    select.classList.remove('is-active');

    const selectWrap = select.closest('.calendar__selects');
    try {
      const disabledSelect = selectWrap.querySelector('.disabled');
      disabledSelect.classList.remove('disabled');
    } catch {}
  }

  selectBtnsNext.forEach((selectBtnNext) => {
    selectBtnNext.addEventListener('click', (e) => {
      const currentSelect = e.target.closest('.select');
      const currentSelectItems =
        currentSelect.querySelectorAll('.select__item');
      const currentSelectText = currentSelect.querySelector(
        '.select-current__text'
      );
      const selectWrap = e.target.closest('.calendar__selects');

      try {
        currentSelectText.textContent = currentSelectItems[--i].textContent;
        const disabledSelect = selectWrap.querySelector('.disabled');
        try {
          disabledSelect.classList.remove('disabled');
        } catch {}
      } catch {
        i = 0;
      }
    });
  });

  selectBtnsPrev.forEach((selectBtnPrev) => {
    selectBtnPrev.addEventListener('click', (e) => {
      const currentSelect = e.target.closest('.select');
      const currentSelectItems =
        currentSelect.querySelectorAll('.select__item');
      const currentSelectText = currentSelect.querySelector(
        '.select-current__text'
      );
      const selectWrap = e.target.closest('.calendar__selects');

      try {
        currentSelectText.textContent = currentSelectItems[++i].textContent;
        const disabledSelect = selectWrap.querySelector('.disabled');
        try {
          disabledSelect.classList.remove('disabled');
        } catch {}
      } catch {
        i = currentSelectItems.length - 1;
      }
    });
  });
};

export default select;
