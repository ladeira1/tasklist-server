import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { promisify } from 'util'

import authConfig from '../config/auth'

export default async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers

  if(!authorization) {
    return res.status(401).json({ error: 'Token does not exist' })
  }

  const [bearer, token] = authorization.split(' ')

  if(bearer !== 'Bearer') {
    return res.status(401).json({ error: 'Token does not match Bearer' })
  }

  try {
    const decoded = await <any>promisify(jwt.verify)(token, authConfig.secret)

    req.userId = decoded.id

    next()
  }
  catch(err) {
    return res.status(401).json({ error: 'Invalid Token' })
  }
}