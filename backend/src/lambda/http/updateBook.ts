import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateBookRequest } from '../../types/requests'
import { getJwt } from '../../auth/utils'
import { updateBook } from '../../business/books'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const bookId = event.pathParameters.bookId
  const bookToUpdate: UpdateBookRequest = JSON.parse(event.body)
  const jwt = getJwt(event)

  console.log(' -----> START BOOK UPDATE >>>>> ', bookToUpdate)

  try {
    
    const updatedItem = await updateBook(bookId, bookToUpdate, jwt)
    console.log(' { ^ _ ^ } SUCCESS: BOOK CREATED >>>>> ', updatedItem)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: updatedItem
      })
    }

  } catch (error) {

    console.log(' { X _ X } ERROR: BOOK UPDATE FAILED >>>>> ', error)

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: 'Error: Book update failed.'
      })
    }

  }

}