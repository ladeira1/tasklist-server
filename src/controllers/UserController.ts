import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import * as Yup from 'yup'

import User from '../models/User'

class UserController {
  async store(req: Request, res: Response) {
    const { name, email, password } = req.body

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    })

    if(!(await schema.isValid({ name, email, password }))) {
      return res.status(400).json({ error: 'Validation failed' })
    }

    const usersRepository = getRepository(User)

    const userExists = await usersRepository.findOne({
      where: {
        email
      }
    })
    
    if(userExists) {
      return res.status(400).json({ error: "User already exists" })
    }

    const user = usersRepository.create({
      name,
      email,
      password_hash: password,
    })

    user.hashPassword()

    await usersRepository.save(user)

    const newUser = {
      userId: user.id,
      userName: user.name,
      userEmail: user.email
    }

    return res.status(201).json(newUser)
  }

  async update (req: Request, res: Response) {
    const { name, email, oldPassword, password } = req.body
    const userId = req.userId

    console.log(req.body)

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string().min(6).when('oldPassword', (oldPassword: any, field: any) => 
        oldPassword? field.required() : field
      ),
      confirmPassword: Yup.string().when('password', (password: any, field: any) => 
        password? field.required().oneOf([Yup.ref('password')]) : field
      )
    })

    if(!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' })
    }

    const usersRepository = getRepository(User)
    
    const user = await usersRepository.findOne({
      where: {
        id: userId
      }
    })

    if(email !== user!.email) {
      const userExists = await usersRepository.findOne({
        where: {
          email
        }
      })

      if(userExists) {
        return res.status(400).json({ error: 'User already exists' })
      }
    }

    if(oldPassword) {
      if(!user?.checkIfPasswordAndHashMatch(oldPassword)) {
        return res.status(401).json({ error: 'Wrong password' })
      }

      user.password_hash = password
      user!.hashPassword()
    }

    user!.name = name
    user!.email = email
    
    usersRepository.save(user!)
    
    res.status(200).json({ userId, name, email })
  }
}

export default new UserController()