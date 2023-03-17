/**
 * Membuat storage key untuk mengakses local storage
 * Membuat custom event untuk me-render buku dan menyimpan buku
 * Mendeklarasi array buku
 */
const books = []
const RENDER_EVENT = 'render-book'
const SAVED_EVENT = 'saved-book'
const STORAGE_KEY = 'TODO_APPS'

const checkbox = document.getElementById('inputBookIsComplete')
const textSubmit = document.getElementById('textSubmit')

/**
 * Mengganti teks pada btn Submit
 */
checkbox.addEventListener('change', () => {
  textSubmit.innerText = ''

  if(checkbox.checked){
    textSubmit.innerText = 'sudah selesai dibaca'
  } else{
    textSubmit.innerText = 'belum selesai dibaca'
  }
})

const isStorageExist = () => {
  if(typeof(Storage) === undefined){
      alert('Browser anda tidak mendukung Web Storage')
      return false
  } else{
      return true
  }
}

document.addEventListener(SAVED_EVENT, () => {
  console.log(localStorage.getItem(STORAGE_KEY))
})

document.addEventListener('DOMContentLoaded', () => {
  const submitForm = document.getElementById('inputBook')
  submitForm.addEventListener('submit', (event) => {
      event.preventDefault()
      addBook()
  })

  if(isStorageExist()){
      loadDataFromStorage()
  }
})

document.addEventListener(RENDER_EVENT, () => {
  const incompleteBook = document.getElementById('incompleteBookshelfList')
  incompleteBook.innerHTML = ''

  const completedBook = document.getElementById('completeBookshelfList')
  completedBook.innerHTML = ''

  for(let item of books){
    const element = makeBook(item)
    if(!item.isCompleted){
        incompleteBook.append(element)
    } else{
        completedBook.append(element)
    }
  }
})

const addBook = () => {
  const textJudul = document.getElementById('inputBookTitle').value
  const textPenulis = document.getElementById('inputBookAuthor').value
  const textTahun = document.getElementById('inputBookYear').value
  const isCompleted = document.getElementById('inputBookIsComplete').checked

  document.dispatchEvent(new Event(RENDER_EVENT))

  const generatedId = generateId()
  const bookObject = generateBookObject(generatedId, textJudul, textPenulis, textTahun, isCompleted)
  books.push(bookObject)

  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
}

const generateId = () => {
  return +new Date()
}

const generateBookObject = (id, judul, penulis, tahun, isCompleted) => {
  return {
      id,
      judul,
      penulis,
      tahun,
      isCompleted
  }
}

const makeBook = (bookObject) => {

  const textJudul = document.createElement('h3')
  textJudul.innerText = bookObject.judul

  const textPenulis = document.createElement('p')
  textPenulis.innerText = bookObject.penulis

  const textTahun = document.createElement('p')
  textTahun.innerText = bookObject.tahun

  const action = document.createElement('div')
  action.classList.add('action')

  const article = document.createElement('article')
  article.classList.add('book_item')
  article.append(textJudul, textPenulis, textTahun, action)
  article.setAttribute('id', `${bookObject.id}`)

  const btnDelete = document.createElement('button')
  btnDelete.classList.add('red')
  btnDelete.innerText = 'Hapus'
  btnDelete.addEventListener('click', () => {
    removeBook(bookObject.id)
  })

  if(bookObject.isCompleted){
    const btnUnread = document.createElement('button')
    btnUnread.classList.add('green')
    btnUnread.innerText = 'Pindah Buku'

    btnUnread.addEventListener('click', () => {
      unreadBook(bookObject.id)
    })

    action.append(btnUnread, btnDelete)

  } else{
    const btnRead = document.createElement('button')
    btnRead.classList.add('green')
    btnRead.innerText = 'Pindah Buku'

    btnRead.addEventListener('click', () => {
      readBook(bookObject.id)
    })

    action.append(btnRead, btnDelete)
  }

  return article
}

const removeBook = (bookId) => {
  if(findBookIndex(bookId) === -1) return

  books.splice(findBookIndex(bookId), 1)
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
}

const readBook = (bookId) => {
  if(findBook(bookId) === null) return

  findBook(bookId).isCompleted = true
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
}

const unreadBook = (bookId) => {
  if(findBook(bookId) === null) return

  findBook(bookId).isCompleted = false
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
}

const findBook = (bookId) => {
  for(let item of books){
    if(item.id === bookId){
      return item
    }
  }
  return null
}

const findBookIndex = (bookId) => {
  for(let i in books){
    if(books[i].id === bookId){
      return i
    }
  }
  return -1
}

const saveData = () => {
  if(isStorageExist()){
    const parsed = JSON.stringify(books)
    localStorage.setItem(STORAGE_KEY, parsed)
    document.dispatchEvent(new Event(SAVED_EVENT))
  }
}

const loadDataFromStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY)
  let data = JSON.parse(serializedData)

  if(data !== null){
    for(let book of data){
      books.push(book)
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT))
}