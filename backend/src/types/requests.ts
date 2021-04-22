export interface CreateBookRequest {
  title: string
  author: string
  pages: number
  cover: string
}

export interface UpdateBookRequest {
  title: string
  author: string
  pages: number
  cover: string
  read: boolean
  rate: number
}
