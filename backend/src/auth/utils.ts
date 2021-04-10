import { JwtPayload, Jwt } from './types'
import { decode, verify } from 'jsonwebtoken'
import axios from 'axios'

const jwksUrl = 'https://dev-6ou2bi5h.us.auth0.com/.well-known/jwks.json'

export const verifyToken = async (authHeader: string): Promise<JwtPayload>  => {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt
  const key = await getSigningKey(jwt.header.kid)
  return verify(token, key.publicKey, { algorithms: ['RS256'] }) as JwtPayload
}

const getToken = (authHeader: string): string => {
  if (!authHeader) throw new Error('No authentication header')
  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')
  const split = authHeader.split(' ')
  const token = split[1]
  return token
}

const getSigningKey = async (kid: string) => {
  const response = await axios.get(jwksUrl)
  const keys = response.data.keys
  const signingKeys = keys.filter(key => key.use === 'sig'
      && key.kty === 'RSA'
      && key.kid
      && key.x5c 
      && key.x5c.length
    ).map(key => {
      return { kid: key.kid, nbf: key.nbf, publicKey: certToPEM(key.x5c[0]) }
    })
  const signingKey = signingKeys.find(key => key.kid === kid)
  return signingKey
}

const certToPEM = cert => {
  cert = cert.match(/.{1,64}/g).join('\n')
  cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`
  return cert
}