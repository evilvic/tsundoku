import * as uuid from 'uuid'

import { CreateBookRequest } from '../types/requests'
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
    ...createBookRequest
  })

}