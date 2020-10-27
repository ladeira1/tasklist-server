import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import * as Yup from 'yup'
import Task from '../models/Task'

class TaskController {
  async store(req: Request, res: Response) {
    const { description } = req.body
    const { userId } = req

    const schema = Yup.object().shape({
      description: Yup.string().required(),
    })

    if(!(await schema.isValid({ description }))) {
      return res.status(400).json({ error: 'Task is not valid' })
    }

    const tasksRepository = getRepository(Task)
    const newTask = tasksRepository.create({
      user: <any>userId,
      description,
    })

    await tasksRepository.save(newTask)

    return res.json(newTask)
  }
}

export default new TaskController()