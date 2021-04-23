import 'source-map-support/register'
import { APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as uuid from 'uuid'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({ signatureVersion: 'v4' })
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {

  const imageId = uuid.v4()
  console.log(' -----> START UPLOAD URL CREATION >>>>> ', imageId)

  try {

    const uploadUrl = s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: imageId,
      Expires: Number(urlExpiration)
    })

    console.log(' { ^ _ ^ } SUCCESS: UPLOAD URL CREATED >>>>> ', uploadUrl)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        uploadUrl: uploadUrl,
        imageUrl: `https://${bucketName}.s3.amazonaws.com/${imageId}`
      })
    }

  } catch (error) {

    console.log(' { X _ X } ERROR: UPLOAD URL CREATION FAILED >>>>> ', error)

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: 'Error: Upload url creation failed.'
      })
    }

  }

}