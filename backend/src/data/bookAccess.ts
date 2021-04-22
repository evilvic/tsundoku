import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { BookItem, BookUpdate, User } from '../types/books'

const XAWS = AWSXRay.captureAWS(AWS)

export class BookAccess {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly booksTable = process.env.BOOKS_TABLE,
    private readonly userIdIndex = process.env.USER_ID_INDEX
  ) {}

  async createBook(book: BookItem): Promise<BookItem> {
    await this.docClient.put({
      TableName: this.booksTable,
      Item: book
    }).promise()
    return book
  }

  async getBooks(user: User): Promise<BookItem[]> {
    const result = await this.docClient.query({
      TableName: this.booksTable,
      IndexName: this.userIdIndex,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": user.userId
      }
    }).promise()
    const books = result.Items ? result.Items : []
    return books as BookItem[]
  }

  async updateBook(book: BookUpdate): Promise<BookItem> {
    await this.docClient.update({
      TableName: this.booksTable,
      Key: {
        bookId: book.bookId
      },
      ExpressionAttributeNames: { "#R": "read" },
      UpdateExpression: "set title = :title, author = :author, pages = :pages, cover = :cover, #R = :read, rate = :rate",
      ConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":title": book.title,
        ":author": book.author,
        ":pages": book.pages,
        ":cover": book.cover,
        ":read": book.read,
        ":rate": book.rate,
        ":userId": book.userId
      },
      ReturnValues: "UPDATED_NEW"
    }).promise()
    return book as BookItem
  }

}