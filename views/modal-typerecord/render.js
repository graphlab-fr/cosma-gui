const form = document.querySelector('form');
const fillInput = form.querySelector('[name="fill"]');

(function () {
    const firstInput = form.querySelector('input');
    firstInput.focus();
})();

(function () {
    const imagePathBtn = document.getElementById('dialog-image');
    imagePathBtn.addEventListener('click', () => {
        window.api.dialogRequestImagePath();
    });
})();

window.api.getImagePathFromDialog((response) => {
    if (response.isOk) {
        fillInput.value = response.data;
    }
});

(function () {
    const fillColorInput = document.getElementById('input-fill-color');
    fillColorInput.addEventListener('change', () => {
        fillInput.value = fillColorInput.value;
    })
})();

(function () {
    const btn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        btn.disabled = true;

        let data = new FormData(form);
        data = Object.fromEntries(data);

        const result = window.api.saveConfigOptionTypeRecord(
            data.name,
            data.initial_name,
            data.fill,
            data.stroke,
            data.action
        );

        const input = form.elements[0];

        if (result === true) {
            input.setCustomValidity('');
            window.close();
        }
        else {
            input.setCustomValidity(result);
            btn.disabled = false;
        }

        input.reportValidity();
    })
})();

(function () {
    document.querySelector('.window-close')
        .addEventListener('click', () => {
            window.close();
        })

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape') {
            window.close();
        }
    });
})();