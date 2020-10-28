import { Router } from 'express'

import authMiddleware from './middlewares/auth'

import UserController from './controllers/UserController'
import SessionController from './controllers/SessionController'
import TaskController from './controllers/TaskController'

const routes = Router()

routes.post('/users', UserController.store)
routes.post('/sessions', SessionController.store)

routes.use(authMiddleware)
//update user
routes.put('/users', UserController.update)

routes.post('/tasks', TaskController.store)
routes.get('/tasks', TaskController.index)
routes.put('/tasks/:task_id', TaskController.update)
routes.delete('/tasks/:task_id', TaskController.delete)

export default routes