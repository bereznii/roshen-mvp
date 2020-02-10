let loading = true;
let currLocation = null;
let formElements = {};
let productId = null;

function hideSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'none';
        section.setAttribute('hidden', 'hidden');
    }
};

function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
        section.removeAttribute('hidden');
    }
};

function showError(error) {
    hideSection('index');
    hideSection('estimate');
    hideSection('success');
    const sectionError = document.getElementById('error');
    if (sectionError) {
        let items = [];
        if (typeof error === 'string') {
            items = [error];
        } else if (typeof error === 'object' && Object.prototype.toString.call( error ) === '[object Array]' && error.length) {
            items = error;
        } else {
            items = ['Дякуємо, але...', 'Ви вже голосували'];
        }
        sectionError.innerHTML = `
            <div class="info__content">
                <img class="info__image" src="/img/warning.png" srcset="/img/warning@2x.png 2x, /img/warning.png 1x" alt="">
                ${ items.map(desc => `<p class="info__description">${desc}</p>`).join('\n') }
            </div>
        `;
        showSection('error');
    }
    showSection('contact');
    window.scrollTo(0, 0);
}

function showProduct(product, properties) {
    if (!product || !properties || !properties.length) return showError('Продукт не знайдено');
    const section = document.getElementById('estimate');
    if (!section) return;

    const heart = `
        <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.553 0c-1.447 0-2.38.172-3.45.696a6.166 6.166 0 00-1.113.7A6.3 6.3 0 009.922.728C8.832.188 7.85 0 6.455 0 2.716 0 0 3.097 0 7.12c0 3.038 1.694 5.972 4.849 8.81 1.656 1.49 3.77 2.963 5.285 3.747l.866.45.866-.45c1.515-.784 3.63-2.258 5.285-3.747C20.306 13.092 22 10.158 22 7.12 22 3.14 19.258.015 15.553 0zM20 7.12c0 2.38-1.414 4.83-4.186 7.323-1.512 1.36-3.455 2.718-4.814 3.43-1.359-.712-3.302-2.07-4.814-3.43C3.414 11.949 2 9.5 2 7.12 2 4.148 3.884 2 6.455 2c1.11 0 1.793.132 2.58.52.465.23.876.534 1.232.914l.735.785.73-.791a4.18 4.18 0 011.25-.936C13.746 2.118 14.387 2 15.549 2 18.09 2.01 20 4.189 20 7.12z"/>
            <path d="M15.553 0c-1.447 0-2.381.172-3.45.696a6.146 6.146 0 00-1.113.7A6.316 6.316 0 009.922.728C8.831.189 7.85 0 6.455 0 2.716 0 0 3.097 0 7.12c0 3.038 1.694 5.972 4.849 8.81 1.656 1.489 3.77 2.963 5.285 3.747l.866.449.866-.449c1.515-.784 3.629-2.258 5.285-3.747C20.306 13.092 22 10.158 22 7.12 22 3.14 19.258.015 15.553 0z" fill-rule="evenodd"/>
        </svg>
    `;
    const title = `<h1 class="estimate__title">Запрошуємо прийняти участь в оцінці нашого виробу</h1>`;
    const subtitle = `<p class="estimate__subtitle">Ваша оцінка можлива тільки ОДИН раз</p>`;
    const image = `<img class="estimate__image" src="${product.image || '/img/products/candy-nut.png'}" alt="">`;
    const description = `<p class="estimate__description">${product.name || ''}</p>`;
    const productElement = `<div class="estimate__product">${image}${description}</div>`;
    const items = properties.map(property => {
        const name = `<span class="estimate__name">${ property.name || ''}</span>`;
        const labels = [1, 2, 3, 4, 5].map(val => {
            const input = `<input class="rating__radio" type="radio" name="property-${ property.id }" value="${ val }" required>`;
            return `<label class="rating__item">${ val } ${input} ${heart}</label>`;
        });
        return `<li class="estimate__item">${name} <div class="rating"> ${labels.join('\n')} </div> </li>`
    });
    const list = `<ul class="estimate__list">${items.join('\n')}</ul>`;
    const submitBtn = `<button class="button" type="submit" disabled>Готово</button>`;
    const form = `<form class="estimate__rating" id="rating-form" action="">${list}${submitBtn}</form>`;

    section.innerHTML = `${title} ${subtitle} ${productElement} ${form}`;
    section.style.display = 'block';
    section.removeAttribute('hidden');

    productId = product.id;
    formElements = properties.reduce((dict, property) => {
        const key = 'property-' + property.id;
        dict[key] = {
            id: property.id,
            name: key,
            selector: `input[name="${key}"]`
        };
        return dict;
    }, formElements || {});
    initForm();
}

function checkIsProductVoted(productId) {
    const votes = window.localStorage.getItem('votes');
    if (!votes) return false;
    try {
        const arr = JSON.parse(votes);
        return arr.indexOf('' + productId) >= 0 || arr.indexOf(+productId) >= 0;
    } catch(err) {
        return false;
    }
}

function addProductVoted(productId) {
    const votes = window.localStorage.getItem('votes') || '[]';
    try {
        const arr = JSON.parse(votes);
        arr.push(productId);
        window.localStorage.setItem('votes', JSON.stringify(arr));
    } catch(err) {
        return false;
    }
}

function getProduct(product) {
    if (!product) return;

    const url = '/api/product/' + product;
    const method = 'GET';
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    const params = {
        id: product
    };

    const arr = [];
    for (let key in params) {
        if (params.hasOwnProperty(key)) {
            arr.push(`${key}=${params[key]}`);
        }
    }
    const data = arr.join('&');

    const xhr = new XMLHttpRequest();
    if ( ( xhr.responseType = 'json') === xhr.responseType ) {
        xhr.onreadystatechange = function() {
            if (this.readyState === 4) {
                const response = this.response;
                if (this.status === 200) {
                    if (response && response.status && response.status === 'success' && response.product && response.properties) {
                        showProduct(response.product, response.properties)
                    } else {
                        console.log('getProduct error, no success', response);
                        showError('Продукт не знайдено');
                    }
                } else {
                    console.log('getProduct failed', response);
                    showError('Сталася помилка');
                }
            }
        }
        xhr.open(method, `${url}?${data}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.setRequestHeader('X-CSRF-TOKEN', token);
        xhr.send();
    } else {
        console.log('not supported responseType')
    }
}

function setRadioRating(element) {
    if (element && element.type === 'radio') {
        const name = element.getAttribute('name');
        const value = element.getAttribute('value');
        const form = element.form;
        const elements = form.querySelectorAll(`input[name="${name}"]`);
        for (let i = 0; i < elements.length; i++) {
            if (elements[i] && elements[i].type === 'radio') {
                if (elements[i].value <= value) {
                    elements[i].closest('label').classList.add('active');
                } else {
                    elements[i].closest('label').classList.remove('active');
                }
            }
        }
    }
}

function validateFormElement(element) {
    if (!element || !element.validity) {
        return false;
    }
    const patternEmpty = /[^\s]+/;  // string full of spaces
    if (element.value === '' || !patternEmpty.test(element.value)) {
        return false;
    }
    if (!element.validity.valid) {
        return false;
    }
    return true;
}

function validateForm(formElements) {
    let valid = true;
    for (let key in formElements) {
        if (formElements.hasOwnProperty(key) && formElements[key] && formElements[key].elements) {
            let elements = formElements[key].elements;
            if (!elements || !elements.length) {
                console.log('no elements');
                return true;
            }
            let element = null;
            let checked = false;
            for (let i = 0; i < elements.length; i++) {
                element = elements[i];
                if (!element || !element.validity) {
                    console.log('no validation');
                    return true;
                }
                if (element.type === 'radio') {
                    checked = checked || element.checked;
                } else {
                   if (validateFormElement(element)) {
                        element.classList.remove('invalid');
                        element.closest('label').classList.remove('invalid');
                    } else {
                        element.classList.add('invalid');
                        element.closest('label').classList.add('invalid');
                        valid = false;
                    } 
                }
            }
            if (element.type === 'radio') {
                valid = checked;
            }
        }
    }
    return valid;
}

function onInput(event) {
    let element = event.target;
    if (!element || !element.validity) {
        return;
    }
    let valid = validateFormElement(element);
    const form = element.form;
    const submitBtn = form.querySelector('button[type="submit"]');
    if (valid) {
        element.classList.remove('invalid');
        element.closest('label').classList.remove('invalid');
        submitBtn.removeAttribute('disabled');
        if (validateForm(formElements)) {
            submitBtn.removeAttribute('disabled');
        } else {
            submitBtn.setAttribute('disabled', 'disabled');
        }
    }
}

function onChange(event) {
    let element = event.target;
    if (!element || !element.validity) {
        return;
    }
    let valid = validateFormElement(element);
    const form = element.form;
    const submitBtn = form.querySelector('button[type="submit"]');
    if (valid) {
        element.classList.remove('invalid');
        element.closest('label').classList.remove('invalid');
    } else {
        element.classList.add('invalid');
        element.closest('label').classList.add('invalid');
    }
    if (element.type === 'radio') {
        setRadioRating(element);
    }
    if (validateForm(formElements)) {
        submitBtn.removeAttribute('disabled');
    } else {
        submitBtn.setAttribute('disabled', 'disabled');
    }
}

function showFormResult() {
    const sectionForm = document.getElementById('estimate');
    if (sectionForm) {
        sectionForm.style.display = 'none';
        sectionForm.setAttribute('hidden', 'hidden');
    }
    const sectionSuccess = document.getElementById('success');
    if (sectionSuccess) {
        sectionSuccess.style.display = 'block';
        sectionSuccess.removeAttribute('hidden');
    }
    const sectionContact = document.getElementById('contact');
    if (sectionContact) {
        sectionContact.style.display = 'block';
        sectionContact.removeAttribute('hidden');
    }
    window.scrollTo(0, 0);
}

function submitForm() {
    if (!loading) {
        loading = true;
        const form = document.getElementById('rating-form');
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.setAttribute('disabled', 'disabled');

        let data = {
            product_id: productId,
            vote: []
        };
        for (let key in formElements) {
            if (formElements.hasOwnProperty(key) && formElements[key]) {
                let elements = form.querySelectorAll(formElements[key].selector);
                if (!elements || !elements.length) {
                    continue;
                }
                let element = null;
                for (let i = 0; i < elements.length; i++) {
                    element = elements[i];
                    if (!element) {
                        continue;
                    }
                    if (element.type === 'radio') {
                        if (element.checked) {
                            data.vote.push({
                                property_id: formElements[key].id,
                                value: +element.value
                            });
                        }
                    } else {
                        data[formElements[key].name] = element.value;
                    }
                }
            }
        }

        const url = '/api/vote';
        const method = 'POST';
        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        const xhr = new XMLHttpRequest();
        if ( ( xhr.responseType = 'json') === xhr.responseType ) {
            xhr.onreadystatechange = function() {
                if (this.readyState === 4) {
                    const response = this.response;
                    if (this.status === 200) {
                        if (response && response.status && response.status === 'success') {
                            addProductVoted(productId);
                            showFormResult();
                        } else {
                            console.log('form error, no success', response);
                            showError('Сталася помилка');
                        }
                    } else {
                        console.log('send form failed', response);
                        showError('Сталася помилка');
                    }
                    loading = false;
                    submitBtn.removeAttribute('disabled');
                }
            }
            xhr.open(method, url);
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            xhr.setRequestHeader('X-CSRF-TOKEN', token);
            xhr.send(JSON.stringify(data));
        } else {
            console.log('not supported responseType')
        }
    }
}

function initForm() {
    const form = document.getElementById('rating-form');
    if (!form) return;
    form.setAttribute('novalidate', 'novalidate');

    for (let key in formElements) {
        if (formElements.hasOwnProperty(key)) {
            formElements[key].elements = form.querySelectorAll(formElements[key].selector);
            if (!formElements[key].elements || !formElements[key].elements.length) {
                formElements[key] = null;
            }
        }
    }

    form.addEventListener('input', onInput);
    form.addEventListener('change', onChange);

    const submitBtn = form.querySelector('button[type="submit"]');
    if (validateForm(formElements)) {
        submitBtn.removeAttribute('disabled');
    } else {
        submitBtn.setAttribute('disabled', 'disabled');
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (validateForm(formElements)) {
            submitForm(event);
        } else {
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.setAttribute('disabled', 'disabled');
            submitBtn.blur();
        }
    });
}

function navigate(pathname = '/') {
    if (currLocation && currLocation === pathname) return;
    currLocation = pathname;
    if (window.location.pathname !== pathname) {
        if (!window.history || !window.history.pushState) return;
        window.history.pushState(null, 'link', pathname);
    }
    if ((pathname !== '/' && !(/^\/.+$/i.test(pathname))) || /^\/admin\/.*$/i.test(pathname) || pathname == '/admin') {
        return window.location = pathname;
    }
    const path = pathname.split('/');
    const sectionIndex = document.getElementById('index');
    if (path && path.length === 2 && path[1] === '') {
        showSection('index');
        hideSection('estimate');
        hideSection('contact');
        hideSection('success');
        hideSection('error');
    } else {
        hideSection('index');
    }
    if (path && path.length === 3 && path[1] === 'product') {
        if (path[2] && /^\d+$/i.test(path[2])) {
            if (!checkIsProductVoted(+path[2])) {
                getProduct(path[2]);
            } else {
                showError(['Дякуємо, але...', 'Ви вже голосували']);
            }
        } else {
            showError('Продукт не знайдено');
        }
    }
    window.scrollTo(0, 0);
}

function handleLink(event) {
    function isModifiedEvent(event) {
        return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
    }
    if (!event || !event.target) return;
    let target = event.target.nodeName == 'A' ? event.target : event.target.closest('A');
    if (!target || !window.history || !window.history.pushState) return;
    const linkTarget = target.getAttribute('target');
    const href = target.getAttribute('href');
    if (
        !event.defaultPrevented && // onClick prevented default
        event.button === 0 && // ignore everything but left clicks
        (!linkTarget || linkTarget === '_self') && // let browser handle "target=_blank" etc.
        !isModifiedEvent(event) // ignore clicks with modifier keys
    ) {
        if (href && /^\/.*$/i.test(href)) {
            event.preventDefault();
            navigate(href);
        }
    }
}

function handlePopstate(event) {
    navigate(window.location.pathname);
}

function init() {
    loading = false;
    navigate(window.location.pathname);
    document.addEventListener('click', handleLink);
    window.addEventListener('popstate', handlePopstate)
}

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || 
                                Element.prototype.webkitMatchesSelector;
}
if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        let el = this;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}