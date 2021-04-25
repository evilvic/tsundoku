import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getJwt } from '../../auth/utils'
import { deleteBook } from '../../business/books'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const bookId = event.pathParameters.bookId
  const jwt = getJwt(event)

  console.log(' -----> START DELETE BOOK >>>>> ', bookId)

  try {
    
    const deletedItem = await deleteBook(bookId, jwt)
    console.log(' { ^ _ ^ } SUCCESS: BOOK DELETED >>>>> ', deletedItem)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: deletedItem
      })
    }

  } catch (error) {

    console.log(' { X _ X } ERROR: DELETE BOOK FAILED >>>>> ', error)

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: 'Error: Delete book failed.'
      })
    }

  }

}