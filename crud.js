// Book 
class Book {
    constructor(title, author, isbn) {
        [this.title, this.author, this.isbn] = arguments;
    }
}

// Store
class Store {
    static getBooks() {
        let books;

        if (localStorage.getItem("books") === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem("books"));
        }

        return books;
    }

    static addBookToStore(book) {
        const books = Store.getBooks();
        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBookFromStore(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// UI 
class UI {
    static displayBooks() {

        const booksArr = Store.getBooks();

        booksArr.forEach(book => UI.addBookToList(book));
    }

    static addBookToList(bookObj) {
        const tbody = document.querySelector("#book-list");
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${bookObj.title}</td>
            <td>${bookObj.author}</td>
            <td>${bookObj.isbn}</td>
            <td><a href="#" class="btn btn-success btn-sm edit">Edit</a></td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        tbody.appendChild(row);
    }

    static removeBook(element) {
        if (element.classList.contains("delete")) {
            element.parentElement.parentElement.remove();
        }
    }

    static clearFields() {
        document.querySelector("#title").value = '';
        document.querySelector("#author").value = '';
        document.querySelector("#isbn").value = '';
    }

    static showAlert(message, className) {

        const TIMEOUT_INTERVAL = 2000;
        const container = document.querySelector(".container");
        const form = document.querySelector("#book-form");

        let alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${className}`;
        alertDiv.appendChild(document.createTextNode(message));

        container.insertBefore(alertDiv, form);

        // remove alert after 2 seconds
        setTimeout(() => {
            document.querySelector('.alert').remove()
        }, TIMEOUT_INTERVAL);

    }


}

// Load: Event
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Add: Event
document.querySelector("#book-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    if (title == '' || author == '' || isbn == '') {
        UI.showAlert("Please fill all fields..!", "danger");
    } else {

        // instantiate Book class, and add to UI table
        let book = new Book(title, author, isbn);
        UI.addBookToList(book);
        UI.showAlert("Book added to Store ..!!", "success");

        // add Book to Store
        Store.addBookToStore(book);

        // clear form fields
        UI.clearFields();
    }
});


// Delete : Event
document.querySelector("#book-list").addEventListener("click", (e) => {

    // delete book from UI
    UI.removeBook(e.target);

    // delete book from Store
    console.log(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);
    Store.removeBookFromStore(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);
});