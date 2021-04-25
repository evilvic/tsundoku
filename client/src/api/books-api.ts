import { apiEndpoint } from '../config'
import { Todo } from '../types/Todo';
import { Book } from '../types/Book'
import { CreateBookRequest } from '../types/CreateBookRequest'
import Axios from 'axios'
import { UpdateBookRequest } from '../types/UpdateBookRequest';

export async function getTodos(idToken: string): Promise<Todo[]> {
  console.log('Fetching todos')

  const response = await Axios.get(`${apiEndpoint}/todos`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Todos:', response.data)
  return response.data.items
}

export async function getBooks(idToken: string): Promise<Book[]> {
  console.log('Fetching books')
  const response = await Axios.get(`${apiEndpoint}/books`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Books:', response.data)
  return response.data.items
}

export async function createBook(
  idToken: string,
  newBook: CreateBookRequest
): Promise<Book> {
  const response = await Axios.post(`${apiEndpoint}/books`,  JSON.stringify(newBook), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchBook(
  idToken: string,
  bookId: string,
  updatedBook: UpdateBookRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/books/${bookId}`, JSON.stringify(updatedBook), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteBook(
  idToken: string,
  bookId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/books/${bookId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

interface GetUploadUrlResponse {
  uploadUrl: string
  imageUrl: string
}

export async function getUploadUrl(
  idToken: string
): Promise<GetUploadUrlResponse> {
  const response = await Axios.post(`${apiEndpoint}/books/cover`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}