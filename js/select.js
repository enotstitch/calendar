let select = function () {
	let selectHeader = document.querySelectorAll('.select-current');
	let selectItem = document.querySelectorAll('.select__item');

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
	}
};

export default select;
