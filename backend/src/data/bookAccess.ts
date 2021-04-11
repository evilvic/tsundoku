import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { BookItem, User } from '../types/books'

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

}