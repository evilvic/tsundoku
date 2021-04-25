import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Icon,
  Image,
  Loader
} from 'semantic-ui-react'

import { createBook, getBooks } from '../api/books-api'
import Auth from '../auth/Auth'
import { Todo } from '../types/Todo'
import { Book } from '../types/Book'
import { getUploadUrl, uploadFile } from '../api/books-api'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}
interface TodosProps {
  auth: Auth
  history: History
}
interface BooksState {
  books: Book[]
  todos: Todo[]
  newTodoName: string
  loadingTodos: boolean
  loadingBooks: boolean
  showNewBook: boolean
  file: any
  uploadState: UploadState
  newBookTitle: string
  newBookAuthor: string
  newBookPages: number
  newBookCover: string
}

export class Todos extends React.PureComponent<TodosProps, BooksState> {
  state: BooksState = {
    books: [],
    todos: [],
    newTodoName: '',
    loadingTodos: true,
    loadingBooks: true,
    showNewBook: false,
    file: undefined,
    uploadState: UploadState.NoUpload,
    newBookTitle: '',
    newBookAuthor: '',
    newBookPages: 0,
    newBookCover: ''
  }

  handleImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return
    this.setState({
      file: files[0]
    })
    this.setUploadState(UploadState.FetchingPresignedUrl)
    const { uploadUrl, imageUrl } = await getUploadUrl(this.props.auth.getIdToken())
    setTimeout(() => {
      this.setState({
        newBookCover: imageUrl
      })
    }, 1000)
    this.setUploadState(UploadState.UploadingFile)
    await uploadFile(uploadUrl, this.state.file)
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      newBookTitle: event.target.value
    })
  }
  handleAuthorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      newBookAuthor: event.target.value
    })
  }
  handlePagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      newBookPages: Number(event.target.value)
    })
  }

  onEditButtonClick = (book: Book) => {
    this.props.history.push({
      pathname: `/books/${book.bookId}/edit`,
      state: {
        ...book
      }
    })
  }

  onBookCreate = async () => {
    try {
      const newBook = await createBook(this.props.auth.getIdToken(), {
        title: this.state.newBookTitle,
        author: this.state.newBookAuthor,
        pages: this.state.newBookPages,
        cover: this.state.newBookCover === '' ? 'https://sls-tsundoku-images-dev.s3.amazonaws.com/app/default.jpg' : this.state.newBookCover
      })
      this.setState({
        books: [newBook, ...this.state.books],
        newBookTitle: '',
        newBookAuthor: '',
        newBookPages: 0,
        newBookCover: '',
        showNewBook: false
      })
    } catch {
      alert('Book creation failed')
    }
  }

  backToBooks = () => {
    this.setState({
      showNewBook: false
    })
  }

  showNewBook = () => {
    this.setState({
      showNewBook: true
    })
  }


  async componentDidMount() {
    try {
      const books = await getBooks(this.props.auth.getIdToken())
      this.setState({
        books,
        loadingBooks: false
      })
    } catch (e) {
      alert(`Failed to fetch books: ${e.message}`)
    }
  }

  render() {
    return (
      <div className='books_screen'>
        <h1>TSUNDOKU</h1>
        {this.renderNewBookButton()}
        {this.renderBooks()}
        {this.state.showNewBook ? this.renderNewBook() : null}
      </div>
    )
  }

  renderNewBookButton() {
    return (
      <button 
        onClick={this.showNewBook}
        className='new_book-btn'
      >
        <span style={{fontSize: '25px'}}>+</span>
        <span style={{fontSize: '15px', marginTop: '2px', fontWeight: 'bold'}}>New book</span>
      </button>
    )
  }

  renderNewBook() {
    return (
      <div className='new_book'>
        <h1>TSUNDOKU</h1>
        <p>New book</p>
        <label htmlFor='upload'>
          {this.state.newBookCover === '' ?
            <div className='new_cover-ph'>
              <span style={{fontSize: '50px', color: 'white'}}>+</span>
            </div>
            :
            <img className='new_cover-ph' src={this.state.newBookCover}/>
          }
          <input 
            style={{display: 'none'}}
            id='upload'
            type='file'
            accept="image/*"
            onChange={this.handleImage}
          />
        </label>
        <label className='book_label'>TITLE</label>
        <input 
          className='book_input'
          type='text'
          value={this.state.newBookTitle}
          onChange={this.handleTitleChange}
        />
        <label className='book_label'>AUTHOR</label>
        <input 
          className='book_input'
          type='text'
          value={this.state.newBookAuthor}
          onChange={this.handleAuthorChange}
        />
        <label className='book_label'>PAGES</label>
        <input 
          className='book_input'
          type='number'
          value={this.state.newBookPages}
          onChange={this.handlePagesChange}
        />
        <button onClick={this.onBookCreate} className='create-btn'>Create</button>
        <button onClick={this.backToBooks} className='cancel-btn'>Cancel</button>
      </div>
    )
  }

  renderBooks() {
    if (this.state.loadingBooks) {
      return this.renderLoading()
    } 
    return this.renderTodosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading books...
        </Loader>
      </Grid.Row>
    )
  }

  renderTodosList() {
    return (
      <>
      
      {this.state.books.length === 0 ? 
      <div className='no_books'>
        <img 
          src='https://sls-tsundoku-images-dev.s3.amazonaws.com/app/no-books.jpg'
          className='no_books-img'
          style={{marginTop: '70px'}}
        />
        <p style={{textAlign: 'center'}}>Still don't have books? Add a new one!</p>
      </div>
      :
      <div className='books_list'>
        {this.state.books.map((book) => {
          return (
            <div 
              key={book.bookId}
              className='book_card'
              onClick={() => this.onEditButtonClick(book)}
            >
              <img 
                src={book.cover}
                className='book_card-img'
              />
              <div className='book_card-details'>
                <h2>{book.title}</h2>
                <p>{book.author}</p>
                <p>{
                  book.rate === 0 ? '☆☆☆☆☆' : 
                  book.rate === 1 ? '★☆☆☆☆' :
                  book.rate === 2 ? '★★☆☆☆' :
                  book.rate === 3 ? '★★★☆☆' :
                  book.rate === 4 ? '★★★★☆' :
                  '★★★★★'
                }</p>
              </div>
              <button>{book.read ? '✔' : ''}</button>
            </div>
          )
        })}
      </div>
      }
      </>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
