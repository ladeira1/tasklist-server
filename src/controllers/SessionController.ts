import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import jwt from 'jsonwebtoken'

import User from '../models/User'
import authConfig from '../config/auth'


class SessionController {
  async store(req: Request, res: Response) {
    const { email, password } = req.body

    const usersRepository = getRepository(User)

    const user = await usersRepository.findOne({
      where: {
        email
      }
    })

    if(!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    if(!user.checkIfPasswordAndHashMatch(password)) {
      return res.status(401).json({ error: 'Password does not match' })
    }

    const { id, name } = user

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: {
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn
        })
      }
    })
  }
}

export default new SessionController()