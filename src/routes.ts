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

export default routes