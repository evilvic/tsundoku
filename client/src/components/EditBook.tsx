import * as React from 'react'
import { History } from 'history'
import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile } from '../api/books-api'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile
}

interface EditBookProps {
  match: {
    params: {
      bookId: string
    }
  }
  auth: Auth,
  location: any,
  history: History
}

interface EditTodoState {
  file: any
  uploadState: UploadState
  title: string
  author: string
  cover: string
  pages: number
  rate: number
  read: boolean
}

export class EditBook extends React.PureComponent<
  EditBookProps,
  EditTodoState
> {
  state: EditTodoState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    title: '',
    author: '',
    cover: '',
    pages: 0,
    rate: 0,
    read: false
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
        cover: imageUrl
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
      title: event.target.value
    })
  }
  handleAuthorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      author: event.target.value
    })
  }
  handlePagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      pages: Number(event.target.value)
    })
  }

  handleRate = (rate: number) => {
    this.setState({
      rate: Number(rate)
    })
  }



  componentDidMount() {
    const { title, author, cover, pages, rate, read } = this.props.location.state
    this.setState({
      title,
      author,
      cover,
      pages,
      rate,
      read
    })
  }

  render() {
    return (
      <div className='edit_book'>
        {this.renderNewBook()}
      </div>
    )
  }

  renderNewBook() {
    return (
      <div className='new_book'>
        <h1>TSUNDOKU</h1>
        <p>Edit book</p>
        <label htmlFor='upload'>
          {this.state.cover === 'https://sls-tsundoku-images-dev.s3.amazonaws.com/app/default.jpg' ?
            <div className='new_cover-ph'>
              <span style={{fontSize: '50px', color: 'white'}}>+</span>
            </div>
            :
            <img className='new_cover-ph' src={this.state.cover}/>
          }
          <input 
            style={{display: 'none'}}
            id='upload'
            type='file'
            accept="image/*"
            onChange={this.handleImage}
          />
        </label>
        <div style={{display: 'flex', marginBottom: '15px'}}>
          <button className='rate_star-btn' onClick={() => this.handleRate(1)}>{this.state.rate >= 1 ? '★' : '☆'}</button>
          <button className='rate_star-btn' onClick={() => this.handleRate(2)}>{this.state.rate >= 2 ? '★' : '☆'}</button>
          <button className='rate_star-btn' onClick={() => this.handleRate(3)}>{this.state.rate >= 3 ? '★' : '☆'}</button>
          <button className='rate_star-btn' onClick={() => this.handleRate(4)}>{this.state.rate >= 4 ? '★' : '☆'}</button>
          <button className='rate_star-btn' onClick={() => this.handleRate(5)}>{this.state.rate >= 5 ? '★' : '☆'}</button>
        </div>
        {/* <label className='book_label'>TITLE</label> */}
        <input 
          className='book_input update'
          type='text'
          value={this.state.title}
          onChange={this.handleTitleChange}
        />
        {/* <label className='book_label'>AUTHOR</label> */}
        <input 
          className='book_input update'
          type='text'
          value={this.state.author}
          onChange={this.handleAuthorChange}
        />
        {/* <label className='book_label'>PAGES</label> */}
        <input 
          className='book_input update'
          type='number'
          value={this.state.pages}
          onChange={this.handlePagesChange}
        />
        <div style={{display: 'flex', width: '280px', justifyContent: 'space-evenly'}}>
          <button onClick={() => console.log('no')} className='create-btn'>Update</button>
          <button onClick={() => console.log('no')} className='delete-btn'>Delete</button>
        </div>
        <button onClick={() => this.props.history.push('/')} className='cancel-btn'>Cancel</button>
      </div>
    )
  }

}