import Books from './books.js';

const createHeaderElement = (id, title) => {
    const element = document.createElement('header');
    element.className = 'item-name';
    element.textContent = title;

    element.addEventListener('click', () => {
        const dialogElement = document.querySelector('dialog#edit');
        const book = Books.getBook(id);
        const [title, author, year, isReaded] =
            dialogElement.querySelectorAll('input');

        dialogElement.setAttribute('data-id', id);
        dialogElement.showModal();

        title.value = book.title;
        author.value = book.author;
        year.value = book.year;
        isReaded.checked = book.isComplete;
    });
    return element;
};

const createFooterElement = (id, isComplete) => {
    const createChildElement = (targetId, action = null) => {
        const element = document.createElement('div');
        const childElement = document.createElement('span');
        element.className = 'item-action';

        if (action) {
            childElement.className = 'fas fa-long-arrow-alt-left';
            element.appendChild(childElement);

            element.addEventListener('click', () => {
                const dialog = document.querySelector('dialog#unread');
                dialog.setAttribute('data-id', targetId);
                dialog.showModal();
            });
            return element;
        } else if (action === Books.IS_UNREAD) {
            childElement.className = 'fas fa-check';
            element.appendChild(childElement);

            element.addEventListener('click', () => {
                const dialog = document.querySelector('dialog#readed');
                dialog.setAttribute('data-id', targetId);
                dialog.showModal();
            });
            return element;
        } else {
            childElement.className = 'fas fa-trash-alt';

            element.setAttribute('data-action', 'delete');
            element.appendChild(childElement);

            element.addEventListener('click', () => {
                const dialog = document.querySelector('dialog#delete');
                dialog.setAttribute('data-id', targetId);
                dialog.showModal();
            });

            return element;
        }
    };
    const rootElement = document.createElement('footer');
    rootElement.className = 'item-footer';
    rootElement.appendChild(createChildElement(id, isComplete));
    rootElement.appendChild(createChildElement(id));
    return rootElement;
};

const createMetaElement = (author, year) => {
    const createChildElement = (type, data) => {
        const element = document.createElement('div');
        element.className = 'item-info';
        element.textContent = `${type}: ${data}`;
        return element;
    };
    const rootElement = document.createElement('div');
    rootElement.className = 'item-meta';
    rootElement.appendChild(createChildElement('Penulis', author));
    rootElement.appendChild(createChildElement('Rilis', year));
    return rootElement;
};

const createBooksElement = (id, title, author, year, isComplete) => {
    const root = document.querySelector('.content');
    const container = document.createElement('article');

    container.className = 'items';
    container.appendChild(createHeaderElement(id, title));
    container.appendChild(createMetaElement(author, year));
    container.appendChild(createFooterElement(id, isComplete));
    root.appendChild(container);
};

export default createBooksElement;
