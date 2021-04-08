export const handler = async (event) => {

  console.log(event.body)

  try {
    
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Lambda working correctly!'
      })
    }

  } catch (error) {

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Lambda fail.'
      })
    }

  }

}