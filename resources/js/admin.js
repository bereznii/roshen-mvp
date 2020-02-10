import flatpickr from 'flatpickr';
import { Ukrainian } from 'flatpickr/dist/l10n/uk.js';
import Choices from 'choices.js';

let loading = true;
let currLocation = null;
let formElements = {
    name: {
        name:       'login',
        selector:   'input[name="login"]'
    },
    password: {
        name:       'password',
        selector:   'input[name="password"]'
    }
};
let userId = null;
let statisticsProduct = null;
let statisticsFrom = null;
let statisticsTill = null;

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
    hideSection('login');
    hideSection('stats-controls');
    hideSection('stats-data');
    const sectionError = document.getElementById('error');
    if (sectionError) {
        let items = [];
        if (typeof error === 'string') {
            items = [error];
        } else if (typeof error === 'object' && Object.prototype.toString.call( error ) === '[object Array]' && error.length) {
            items = error;
        } else {
            items = ['Сталася помилка'];
        }
        sectionError.innerHTML = `
            <div class="info__content">
                <img class="info__image" src="/img/warning.png" srcset="/img/warning@2x.png 2x, /img/warning.png 1x" alt="">
                ${ items.map(desc => `<p class="info__description">${desc}</p>`).join('\n') }
            </div>
        `;
        showSection('error');
    }
    window.scrollTo(0, 0);
}

function showFormError(error) {
    for (let key in formElements) {
        if (formElements.hasOwnProperty(key) && formElements[key] && formElements[key].elements) {
            let elements = formElements[key].elements;
            if (!elements || !elements.length) {
                console.log('no elements');
                return true;
            }
            let element = null;
            for (let i = 0; i < elements.length; i++) {
                element = elements[i];
                if (!element) {
                    return;
                }
                element.classList.add('invalid');
                element.closest('label').classList.add('invalid');
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
        // if (validateForm(formElements)) {
        //     submitBtn.removeAttribute('disabled');
        // } else {
        //     submitBtn.setAttribute('disabled', 'disabled');
        // }
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
        
    }
    // if (validateForm(formElements)) {
    //     submitBtn.removeAttribute('disabled');
    // } else {
    //     submitBtn.setAttribute('disabled', 'disabled');
    // }
}

function showFormResult() {
    getStatistics();
    navigate('/admin/statistics');
    window.scrollTo(0, 0);
}

function submitForm() {
    if (!loading) {
        loading = true;
        const form = document.getElementById('login-form');
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.setAttribute('disabled', 'disabled');

        let data = {};
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
                    switch (formElements[key].name) {
                        case 'login':
                            data['email'] = element.value;
                            break;
                        case 'password':
                            data['password'] = element.value;
                            break;
                        default:
                            console.log('unknown form element');
                    }
                }
            }
        }

        const url = '/api/login';
        const method = 'POST';
        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        const xhr = new XMLHttpRequest();
        if ( ( xhr.responseType = 'json') === xhr.responseType ) {
            xhr.onreadystatechange = function() {
                if (this.readyState === 4) {
                    const response = this.response;
                    if (this.status === 200) {
                        if (response && response.status && response.status === 'success') {
                            userId = response.userId;
                            if (userId) {
                                window.localStorage.setItem('user', userId);
                            }
                            showFormResult();
                        } else {
                            // console.log('form error, no success', response);
                            window.localStorage.removeItem('user');
                            showFormError();
                        }
                    } else {
                        // console.log('send form failed', response);
                        window.localStorage.removeItem('user');
                        showFormError();
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
    const form = document.getElementById('login-form');
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
    // if (validateForm(formElements)) {
    //     submitBtn.removeAttribute('disabled');
    // } else {
    //     submitBtn.setAttribute('disabled', 'disabled');
    // }

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


function showStatistics(statistics, img) {
    const section = document.getElementById('stats-data');
    if (!section) return;

    const image = `<img class="stats-data__image" src="${img || '/img/products/candy-nut.png'}" alt="">`;
    const productElement = `<div class="stats-data__product">${image}</div>`;
    const items = statistics.map(property => {
        const name = `<h4 class="stats-data__title">${ property.name || ''}</h4>`;
        const amountOfEachGrade = property.statistics && property.statistics.amountOfEachGrade;
        const maxAmount = (amountOfEachGrade && !!amountOfEachGrade.length
            && amountOfEachGrade.reduce((acc, val) => Math.max((val.amount || 0), acc), 0)) || 0;
        const bars = (amountOfEachGrade && !!amountOfEachGrade.length &&
            amountOfEachGrade.map(val => {
                const percent = maxAmount ? ((val.amount || 0) * 100.0) / maxAmount : 100;
                const label = `<div class="chart__label">${val.grade}</div>`;
                const value = `<div class="chart__value ${percent < 15 ? 'chart__value--out' : ''}">${Math.round(val.amount || 0)}</div>`;
                const inner = `<div class="chart__inner" style="height: ${percent}%;"> ${value} </div>`;
                return `<div class="chart__outer">
                            <div class="chart__bar"> ${inner} </div>
                            ${label} 
                        </div>`;
            })) || [];
        const ratingsNumber = `
            <p class="stats-data__description">Cумарна кількість оцінок: 
                <span class="stats-data__value">${Math.round((property.statistics && property.statistics.ratingsNumber || 0) * 100) / 100.0}</span>
            </p>`;
        const average = `
            <p class="stats-data__description">Середнє значення: 
                <span class="stats-data__value">${Math.round((property.statistics && property.statistics.average || 0) * 100) / 100.0}</span>
            </p>`;
        const rootmeanSquare = `
            <p class="stats-data__description">Середнє квадратичне:  
                <span class="stats-data__value">${Math.round((property.statistics && property.statistics.rootmeanSquare || 0) * 100) / 100.0}</span>
            </p>`;
        const variance = `
            <p class="stats-data__description">Дисперсія: 
                <span class="stats-data__value">${Math.round((property.statistics && property.statistics.variance || 0) * 100) / 100.0}</span>
            </p>`;
        return  `<li class="stats-data__item">
                    ${name} 
                    <div class="chart chart--property-${ property.property_id }"> ${bars.join('\n')} </div>
                    ${ratingsNumber} ${average} ${rootmeanSquare} ${variance}
                </li>`;
    });
    const list = `<ul class="stats-data__list">${items.join('\n')}</ul>`;

    section.innerHTML = `${productElement} ${list}`;
    showSection('stats-data');
}

function getStatistics() {
    if (!statisticsProduct || !statisticsFrom || !statisticsTill) return;

    const product = statisticsProduct;
    const from = statisticsFrom ? new Date(statisticsFrom) : null;
    const till = statisticsTill ? new Date(statisticsTill) : null;

    const url = '/api/admin/product';
    const method = 'GET';
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    const params = {
        id: product,
        from: `${('00' + from.getDate()).slice(-2)}.${('00' + (from.getMonth() + 1)).slice(-2)}.${('00' + from.getFullYear()).slice(-4)}`,
        till: `${('00' + till.getDate()).slice(-2)}.${('00' + (till.getMonth() + 1)).slice(-2)}.${('00' + till.getFullYear()).slice(-4)}`
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
                    if (response && response.status && response.status === 'success' && response.statistics) {
                        if (product === statisticsProduct && statisticsFrom && statisticsTill 
                            && from.getTime() === statisticsFrom.getTime() && till.getTime() === statisticsTill.getTime()
                        ) {
                            showStatistics(response.statistics, response.product_img);
                        }
                    } else {
                        console.log('getStatistics error, no success', response);
                        showError();
                    }
                } else {
                    console.log('getStatistics failed', response);
                    showError();
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

function initStatsControls() {
    const productsElement = document.getElementById('select-products');
    const productsChoices = productsElement && new Choices(productsElement, {
        searchEnabled: false,
        shouldSort: false,
        itemSelectText: '',
        classNames: {containerOuter: 'select-choices'}
    });
    productsElement && productsElement.addEventListener(
        'change',
        function(event) {
            const value = event && event.detail && event.detail.value;
            if (value) {
                statisticsProduct = value;
                getStatistics();
            }
        },
        false,
    );

    const dateElement = document.getElementById('stats-date');
    Ukrainian.rangeSeparator = ' - ';
    const fpDate = dateElement && flatpickr(dateElement, {
        locale: Ukrainian,
        altInput: true,
        altFormat: 'd.m.Y',
        dateFormat: 'd.m.Y',
        mode: 'range',
        onChange: function(selectedDates, dateStr, instance) {
            if (selectedDates && selectedDates.length) {
                if (selectedDates.length === 1) {
                    statisticsFrom = selectedDates[0];
                    statisticsTill = selectedDates[0];
                    this.setDate(selectedDates[0]);
                } else {
                    statisticsFrom = selectedDates[0];
                    statisticsTill = selectedDates[1];
                }
                getStatistics();
            }
        },
        onClose: function(selectedDates, dateStr, instance) {
            if (selectedDates && !!selectedDates.length && selectedDates.length === 1) {
                this.setDate([selectedDates[0], selectedDates[0]]);
            }
        },
    });

    const newDate = new Date();
    fpDate.setDate([newDate, newDate], true);
    const newValObj = productsChoices && productsChoices.getValue();
    statisticsProduct = newValObj && newValObj.value;
    statisticsFrom = newDate;
    statisticsTill = newDate;
    if (window.location.pathname === '/admin/statistics'){
        getStatistics();
    }
}

function navigate(pathname = '/') {
    if (currLocation && currLocation === pathname) return;
    currLocation = pathname;
    if (window.location.pathname !== pathname) {
        if (!window.history || !window.history.pushState) return;
        window.history.pushState(null, 'link', pathname);
    }
    if (pathname !== '/admin' && !(/^\/admin\/.*$/i.test(pathname))) {
        return window.location = pathname;
    }
    const path = pathname.split('/');
    if (path && path.length === 2 && path[1] === 'admin') {
        showSection('login');
        hideSection('stats-controls');
        hideSection('stats-data');
        initForm();
    }
    if (path && path.length === 3 && path[1] === 'admin' && path[2] === 'statistics') {
        if (!window.localStorage.getItem('user')) return navigate('/admin');
        showSection('stats-controls');
        hideSection('stats-data');
        hideSection('login');
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
        if (href && /^\/.*$/i.test(href) && /^\/admin\/?.*$/i.test(href)) {
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
    window.addEventListener('popstate', handlePopstate);
    initStatsControls();
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