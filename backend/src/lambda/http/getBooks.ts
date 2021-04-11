import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getJwt } from '../../auth/utils'
import { getBooks } from '../../business/books'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const jwt = getJwt(event)
  console.log(' -----> START BOOKS FETCH >>>>> ')

  try {

    const items = await getBooks(jwt)
    console.log(' { ^ _ ^ } SUCCESS: BOOKS FETCHED >>>>> ', items)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        items: items
      })
    }

  } catch (error) {

    console.log(' { X _ X } ERROR: FETCH BOOKS FAILED >>>>> ', error)

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: 'Error: Fetch books failed.'
      })
    }

  }

}