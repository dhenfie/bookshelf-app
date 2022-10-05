import Books from './books.js';
import createBooksElement from './ui.js';

const EVENT_RENDER = 'render';

const dialogElement = document.querySelectorAll('dialog');
const toggleReadedLabel = document.querySelector('[data-action="readed"]');
const toggleUnreadedLabel = document.querySelector('[data-action="unread"]');

const createBook = () => {
    const dialog = document.querySelector('dialog#add');
    const form = dialog.querySelector('form');

    const input = Array.from(dialog.querySelectorAll('input')).map(element => {
        if (element.getAttribute('type') === 'checkbox') {
            return element.checked;
        }
        return element.value;
    });

    const [title, author, year, isComplete] = input;

    if (form.checkValidity()) {
        Books.add({
            title: title.toLocaleLowerCase().trim(),
            author: author.toLocaleLowerCase().trim(),
            year: parseInt(year),
            isComplete,
        });
        document.dispatchEvent(new Event(EVENT_RENDER));
        dialog.close();
    }
};

const editBook = () => {
    const dialog = document.querySelector('dialog#edit');
    const id = parseInt(dialog.dataset.id);
    const form = dialog.querySelector('form');

    const input = Array.from(dialog.querySelectorAll('input')).map(element => {
        if (element.getAttribute('type') === 'checkbox') {
            return element.checked;
        }
        return element.value;
    });

    const [title, author, year, isComplete] = input;

    if (form.checkValidity()) {
        Books.update(id, {
            title: title.toLocaleLowerCase().trim(),
            author: author.toLocaleLowerCase().trim(),
            year: parseInt(year),
            isComplete,
        });

        document.dispatchEvent(new Event(EVENT_RENDER));
        dialog.close();
    }
};

const deleteBook = () => {
    const dialog = document.querySelector('dialog#delete');
    const targetId = parseInt(dialog.dataset.id);

    Books.remove(targetId);

    dialog.close();
    document.dispatchEvent(new Event(EVENT_RENDER));
};

const moveTo = action => {
    const dialog = document.querySelector(`dialog#${action}`);

    const targetId = parseInt(dialog.dataset.id);
    const book = Books.getBook(targetId);
    let record =
        action == 'readed'
            ? { ...book, isComplete: true }
            : { ...book, isComplete: false };

    Books.update(targetId, record);
    dialog.close();
    document.dispatchEvent(new Event(EVENT_RENDER));
};

const render = search => {
    const root = document.querySelector('.content');
    const filter = document.querySelector('.label-item.active');
    const label =
        filter.dataset.action === 'readed' ? Books.IS_READED : Books.IS_UNREAD;
    const book = Books.getBooks(label);

    root.innerHTML = '';
    if (search) {
        const pattern = new RegExp(search.value);
        const result = book.filter(item => pattern.test(item.title));

        if (result.length > 0) {
            result.forEach(item => {
                const { id, title, author, year, isComplete } = item;
                createBooksElement(id, title, author, year, isComplete);
            });
            return;
        }

        root.innerHTML = `<p class="message"> <strong>${search.value}</strong> tidak di temukan.`;
        return;
    } else {
        if (book.length > 0) {
            book.forEach(item => {
                const { id, title, author, year, isComplete } = item;
                createBooksElement(id, title, author, year, isComplete);
            });
            return;
        }

        root.innerHTML = `<p class="message"> Belum ada buku. </p>`;
    }
};

toggleReadedLabel.addEventListener('click', e => {
    const current = e.currentTarget;
    current.className = 'label-item active';
    toggleUnreadedLabel.classList.remove('active');

    document.dispatchEvent(new Event(EVENT_RENDER));
});

toggleUnreadedLabel.addEventListener('click', e => {
    const current = e.currentTarget;
    current.className = 'label-item active';
    toggleReadedLabel.classList.remove('active');

    document.dispatchEvent(new Event(EVENT_RENDER));
});

dialogElement.forEach(element => {
    const cancelBtn = element.querySelector('[data-dismiss="dialog"]');
    const submitBtn = element.querySelector('[data-submit]');

    cancelBtn.addEventListener('click', () => element.close());
    submitBtn.addEventListener('click', e => {
        const action = e.currentTarget.dataset.submit;

        switch (action) {
            case 'add':
                createBook();
                break;
            case 'edit':
                editBook();
                break;
            case 'delete':
                deleteBook();
                break;
            case 'unread':
                moveTo('unread');
                break;
            case 'readed':
                moveTo('readed');
                break;
        }
    });

    element.onclose = e => {
        const currentElement = e.currentTarget;
        currentElement.removeAttribute('data-id');
        currentElement
            .querySelectorAll('input')
            .forEach(items => (items.value = ''));
    };

    if (element.getAttribute('id') === 'add') {
        const elementInput = element.querySelector('input[name="title"]');

        elementInput.addEventListener('input', () => {
            if (elementInput.value.length > 0) {
                if (Books.uniqueProperty(elementInput.value, 'title')) {
                    elementInput.setCustomValidity(
                        `buku ${elementInput.value} sudah ada`
                    );
                    return;
                }
                elementInput.setCustomValidity('');
            }
        });
    }

    if (element.getAttribute('id') === 'edit') {
        const elementInput = element.querySelector('input[name="title"]');
        const oldValue = elementInput.value;

        elementInput.addEventListener('input', () => {
            if (elementInput.value.length > 0) {
                if (
                    Books.uniqueProperty(elementInput.value, 'title') &&
                    elementInput.value !== oldValue
                ) {
                    elementInput.setCustomValidity(
                        `buku ${elementInput.value} sudah ada`
                    );
                    return;
                }
                elementInput.setCustomValidity('');
            }
        });
    }
});

document
    .querySelector('.nav-btn')
    .addEventListener('click', () =>
        document.querySelector('dialog#add').showModal()
    );

document
    .querySelector('.search')
    .addEventListener('input', e => render(e.currentTarget));

document.addEventListener(EVENT_RENDER, () => render());

window.onload = render();
