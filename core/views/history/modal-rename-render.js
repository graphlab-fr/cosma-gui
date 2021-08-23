const form = document.getElementById('form-rename-history');
let isReady = false;

/**
 * Form submition & feedback : send data and after display the response
 */

(function () {

    const output = form.querySelector('output');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (isReady === false) { return; }
    
        let data = new FormData(form);
        data = Object.fromEntries(data);
        console.log(data);
    
        window.api.send("sendNewHistoryName", data);
    
        // console.log('coucou');
        
        // window.api.receive("confirmNewRecordTypeFromConfig", (response) => {
        //     output.textContent = response.consolMsg;
        //     output.dataset.valid = response.isOk;
        // });
    })
    
})();

/**
 * Get and set as value the name of the history record
 */

(function () {

    window.api.receive("getMetasHistory", (metas) => {
        form.querySelector('input[name="name"]')
            .value = metas.name;
        form.querySelector('input[name="id"]')
            .value = metas.id;

        isReady = true;
    });

})();