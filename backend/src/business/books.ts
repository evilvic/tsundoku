import * as uuid from 'uuid'

import { CreateBookRequest, UpdateBookRequest } from '../types/requests'
import { BookItem } from '../types/books'
import { parseUserId } from '../auth/utils'
import { BookAccess } from '../data/bookAccess'

const bookAccess = new BookAccess()

export const createBook = async (
  createBookRequest: CreateBookRequest,
  jwt: string
): Promise<BookItem> => {

  const userId = parseUserId(jwt)
  const itemId = uuid.v4()

  return await bookAccess.createBook({
    userId: userId,
    bookId: itemId,
    createdAt: new Date().toISOString(),
    read: false,
    rate: 0,
    ...createBookRequest
  })

}

export const getBooks = async (jwt: string): Promise<BookItem[]> => {

  const userId = parseUserId(jwt)
  return await bookAccess.getBooks({ userId })

}

export const updateBook = async (
  bookId: string,
  bookToUpdate: UpdateBookRequest,
  jwt: string
): Promise<BookItem> => {

  const userId = parseUserId(jwt)
  return await bookAccess.updateBook({ bookId, userId, ...bookToUpdate })

}