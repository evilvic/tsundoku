import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { BookItem } from '../types/books'

const XAWS = AWSXRay.captureAWS(AWS)

export class BookAccess {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly booksTable = process.env.BOOKS_TABLE
  ) {}

  async createBook(book: BookItem): Promise<BookItem> {
    await this.docClient.put({
      TableName: this.booksTable,
      Item: book
    }).promise()
    return book
  }

}