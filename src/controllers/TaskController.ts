import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import * as Yup from 'yup'
import Task from '../models/Task'

class TaskController {
  async index(req: Request, res: Response) {
    const tasksRepository = getRepository(Task)
    const tasks = await tasksRepository.find({
      where: {
        user: req.userId,
        check: false
      }
    })

    res.status(200).json(tasks)
  }

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

  async update(req: Request, res: Response) {
    const { task_id } = req.params

    const tasksRepository = getRepository(Task)

    const task = await tasksRepository.findOne({
      where: {
        id: task_id
      }
    })

    if(!task) {
      return res.status(400).json({ error: 'Task not found' })
    }

    task.check = !task.check

    await tasksRepository.save(task)


    return res.status(200).json(task)
  }

  async delete(req: Request, res: Response) {
    const { task_id } = req.params    

    const tasksRepository = getRepository(Task)
    const task = await tasksRepository.findOne({
      where: {
        id: task_id,
        user: req.userId,
      }
    })

    if(!task) {
      return res.status(400).json({ error: 'Task not found' })
    }

    await tasksRepository.delete(task)

    return res.status(400).json(task)
  }
}

export default new TaskController()