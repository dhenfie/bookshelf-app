const STORAGE_KEY = 'books';
const IS_READED = true;
const IS_UNREAD = false;

const model = () => {
    const localDB = window.localStorage.getItem(STORAGE_KEY);
    if (localDB === null) {
        return [];
    }
    return JSON.parse(localDB);
};

const uniqueProperty = (value, key = 'id') => {
    const propertyValues =
        typeof value === 'string' ? value.toLowerCase().trim() : value;
    return model().find(items => {
        return items[key] === propertyValues;
    });
};

const getIndexFrom = targetId =>
    model().findIndex(items => items.id === targetId);

const add = record => {
    const models = model();
    const generatePrimaryId = models.length + 1;

    models.push({ id: generatePrimaryId, ...record });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
};

const remove = targetId => {
    const indexElement = getIndexFrom(targetId);
    const models = model();

    if (indexElement !== -1) {
        models.splice(indexElement, 1);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
    }
};

const update = (targetId, record) => {
    const indexElement = getIndexFrom(targetId);
    const models = model();

    if (indexElement !== -1) {
        models.splice(indexElement, 1, { id: targetId, ...record });
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
    }
};

const getBooks = (filter = IS_READED) => {
    if (filter === IS_READED) {
        return model().filter(books => books.isComplete === IS_READED);
    }
    return model().filter(books => books.isComplete === IS_UNREAD);
};

const getBook = id => model().find(items => items.id === id);

const Books = {
    add,
    remove,
    update,
    getBooks,
    getBook,
    uniqueProperty,
    IS_READED,
    IS_UNREAD,
};

export default Books;
