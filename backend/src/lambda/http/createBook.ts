import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateBookRequest } from '../../types/requests'
import { getJwt } from '../../auth/utils'
import { createBook } from '../../business/books'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const newBook: CreateBookRequest = JSON.parse(event.body)
  const jwt = getJwt(event)

  console.log(' -----> START BOOK CREATION >>>>> ', newBook)

  try {
    
    const newItem = await createBook(newBook, jwt)
    console.log(' { ^ _ ^ } SUCCESS: BOOK CREATED >>>>> ', newItem)
    
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: newItem
      })
    }

  } catch (error) {

    console.log(' { X _ X } ERROR: BOOK CREATION FAILED >>>>> ', error)

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: 'Error: Book creation failed.'
      })
    }

  }

}