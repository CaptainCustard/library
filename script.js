/* -------------------------------------------------------------------------- */
/*                               Initialization                               */
/* -------------------------------------------------------------------------- */
let myLibrary;
if (localStorage.getItem('myLibrary')) {
  myLibrary = [];
  const savedLibrary = localStorage.getItem('myLibrary');
  myLibrary = JSON.parse(savedLibrary);
} else {
  myLibrary = [];
}
// Where books as objects will be stored.
// const dbLibrary = firebase.database().ref().child("myLibrary");
// dbLibrary.on("value", (snap) => console.log(snap.val()));
// let firestore = firebase.firestore();
// let docRef = firestore.doc("userBooks/library");
// saveLibrary = function () {
//   docRef
//     .set({
//       userLibrary: myLibrary,
//     })
//     .then(function () {
//       console.log("Library saved!");
//     })
//     .catch(function (error) {
//       console.log("Got an error: ", error);
//     });
// };
// saveLibrary();
// getUpdate = function () {
//   docRef.onSnapshot(function (doc) {
//     if (doc && doc.exists) {
//       const myData = doc.data();
//       myLibrary = myData.userLibrary;
//       console.log(myData.userLibrary);
//     }
//   });
// };
/* -------------------------------------------------------------------------- */
/*                          Grabbing Items from HTML                          */
/* -------------------------------------------------------------------------- */
// Grab the add form.
const addBookForm = document.getElementById('addBookForm');
// Grab the Open/Add button.
const addButton = document.getElementById('buttonOpenForm');
// Grab the table body.
const bookTableBody = document.getElementById('bookTableBody');
// Grab the close button.
const closeButton = document.getElementById('closeX');
// Grab the addBookButton button.
const addBookButton = document.getElementById('addBookButton');
// Grab searchBox
const searchBox = document.getElementById('searchBox');
/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */
// Generate a unique ID for each Book.
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
// Function constructor to create instances of Book.
class Book {
  constructor(id, title, author, pages, isRead) {
    this.id = uuid();
    this.title = title;
    this.author = author;
    this.read = false;
    // this.pages = pages;
    // this.isRead = true;
    // this.info = function () {
    //   return `${book.title} by ${book.author}, ${book.pages} pages, ${book.isRead}.`;
    // };
  }
}

// Search function
function findBooks(array, searchText) {
  const searchArray = array.filter(
    (obj) => obj.title.toLowerCase().includes(searchText)
      || obj.author.toLowerCase().includes(searchText),
  );
  addToHTML(searchArray);
}

// Delete book.
function removeBook(array, id) {
  const index = array.findIndex((obj) => obj.id === id);
  array.splice(index, 1);
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
  addToHTML(array);
}
// Convert text in searchbox into lower case and pass it into findBooks function
// along with myLibrary.
function onSearch() {
  const searchText = searchBox.value.toLowerCase();
  findBooks(myLibrary, searchText);
}
// Hide adding form.
function hideForm() {
  document.getElementById('bookTitle').value = '';
  document.getElementById('authorName').value = '';
  document.getElementById('bookTitle').placeholder = 'Title';
  document.getElementById('authorName').placeholder = 'Author';
  addBookForm.style.display = 'none';
}

// Display adding form.
function showForm() {
  addBookForm.style.display = 'block';
}
// Hide adding form when user clicks outside of adding form box.
window.onclick = function (event) {
  if (event.target === addBookForm) {
    hideForm();
  }
};

// Create a book instance of Book and add it to myLibrary array. Then hide the adding form.
function addBooks() {
  if (
    document.getElementById('bookTitle').value === ''
    || document.getElementById('authorName').value === ''
  ) {
    document.getElementById('bookTitle').placeholder = 'Required field!';
    document.getElementById('authorName').placeholder = 'Required field!';
  } else {
    const book = new Book();
    book.title = document.getElementById('bookTitle').value;
    book.author = document.getElementById('authorName').value;
    myLibrary.push(book);
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
    addToHTML(myLibrary);
    hideForm();
  }
}

// Remove all children (books) inside the table.
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

// Loop over the new myLibrary array and add new elements/object to the table.
// Update HTML and myLibrary with books.
function addToHTML(array) {
  // Remove all books inside the table.
  removeAllChildNodes(bookTableBody);
  // Loop over the the array myLibrary and create a tr for every object and a
  // td for every title key/value.
  array.forEach((obj) => {
    // Create a tr inside the table.
    const bookRow = document.createElement('tr');
    // Add class book to tr element.
    bookRow.classList.add('book');
    // Create a td for every title and for every author.
    const bookTitle = document.createElement('td');
    const bookAuthor = document.createElement('td');
    const deleteButton = document.createElement('button');
    // Add class bookTitle to tr bookTitle element.
    bookTitle.classList.add('bookTitle');
    // Add class bookAuthor to tr bookAuthor element.
    bookAuthor.classList.add('bookAuthor');
    // Add class deleteButton to tr deleteButton element.
    deleteButton.classList.add('deleteButton');
    deleteButton.setAttribute('id', obj.id);
    deleteButton.onclick = function () {
      removeBook(myLibrary, obj.id);
    };
    // Append the bookTitle under bookRow.
    bookRow.appendChild(bookTitle);
    bookRow.appendChild(bookAuthor);
    bookRow.appendChild(deleteButton);
    // Write the title value into HTML.
    bookTitle.innerHTML = obj.title;
    bookAuthor.innerHTML = obj.author;
    deleteButton.innerHTML = '&times;';
    // Append the bookRow under bookTableBody (the table body.)
    bookTableBody.appendChild(bookRow);
    // saveLibrary();
    // getUpdate();
  });
}
/* -------------------------------------------------------------------------- */
/*                           Buttons Functionalities                          */
/* -------------------------------------------------------------------------- */
// Show book form popup.
addButton.onclick = showForm;

// Hide book form popup.
closeButton.onclick = hideForm;

// Run the function to add the entered text as a book.
addBookButton.onclick = addBooks;

// on Typing start searching
searchBox.onkeyup = onSearch;

addToHTML(myLibrary);
