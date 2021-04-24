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

import { deleteTodo, patchTodo } from '../api/todos-api'
import { createBook, getBooks } from '../api/books-api'
import Auth from '../auth/Auth'
import { Todo } from '../types/Todo'
import { Book } from '../types/Book'

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
    newBookTitle: '',
    newBookAuthor: '',
    newBookPages: 0,
    newBookCover: 'https://sls-tsundoku-images-dev.s3.amazonaws.com/app/default.jpg'
  }


  // -----> FUNCTIONS TO HANDLE NEW BOOK INPUTS >>>>>
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
  ///// <<<<< /////

  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/todos/${todoId}/edit`)
  }

  onBookCreate = async () => {
    try {
      const newBook = await createBook(this.props.auth.getIdToken(), {
        title: this.state.newBookTitle,
        author: this.state.newBookAuthor,
        pages: this.state.newBookPages,
        cover: this.state.newBookCover
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

  onTodoDelete = async (todoId: string) => {
    try {
      await deleteTodo(this.props.auth.getIdToken(), todoId)
      this.setState({
        todos: this.state.todos.filter(todo => todo.todoId != todoId)
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  onTodoCheck = async (pos: number) => {
    try {
      const todo = this.state.todos[pos]
      await patchTodo(this.props.auth.getIdToken(), todo.todoId, {
        name: todo.name,
        dueDate: todo.dueDate,
        done: !todo.done
      })
      this.setState({
        todos: update(this.state.todos, {
          [pos]: { done: { $set: !todo.done } }
        })
      })
    } catch {
      alert('Todo deletion failed')
    }
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
        <input 
          type='file'
        />
        <label>Title:</label>
        <input 
          type='text'
          value={this.state.newBookTitle}
          onChange={this.handleTitleChange}
        />
        <label>Author:</label>
        <input 
          type='text'
          value={this.state.newBookAuthor}
          onChange={this.handleAuthorChange}
        />
        <label>Pages</label>
        <input 
          type='number'
          value={this.state.newBookPages}
          onChange={this.handlePagesChange}
        />
        <button onClick={this.onBookCreate}>Create</button>
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
      <Grid padded>
        {this.state.todos.map((todo, pos) => {
          return (
            <Grid.Row key={todo.todoId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onTodoCheck(pos)}
                  checked={todo.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {todo.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {todo.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(todo.todoId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTodoDelete(todo.todoId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {todo.attachmentUrl && (
                <Image src={todo.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
      <div className='books_list'>
        {this.state.books.map((book) => {
          return (
            <div 
              key={book.bookId}
              className='book_card'
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
      </>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
