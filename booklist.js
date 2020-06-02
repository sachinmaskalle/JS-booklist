// Book Class: Represents a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handle UI Tasks
class UI {

    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(book => UI.addBookToList(book));
    }

    static showAlert(message, className) {

        const TIMEOUT_INTERVAL = 3000;
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // remove alert after 3 seconds

        setTimeout(() => {
            document.querySelector('.alert').remove()
        }, TIMEOUT_INTERVAL);
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td class="text-center"><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row);
    }

    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// Store Class: Local Storage
class Store {

    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'))
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }

}

// Event: display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Display books from Store
Store.getBooks();

// Event: Add a NEW Book
document.querySelector('#book-form').addEventListener('submit', e => {
    e.preventDefault();
    // get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('ERROR : Please add required fields!', 'danger');
    } else {
        // instantiate book Class
        let book = new Book(title, author, isbn);

        // Add book to UI
        UI.addBookToList(book);

        // Add book to store
        Store.addBook(book);

        // success message
        UI.showAlert('SUCCESS : Book successfully added!', 'success');

        // Clear fields
        UI.clearFields();
    }
});


// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', e => {
    // remove book from UI
    UI.deleteBook(e.target);

    // remove book from Storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // Info message
    UI.showAlert('INFO : Book Removed', 'info');
});