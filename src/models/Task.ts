import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import User from './User'

@Entity('tasks')
export default class Task {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  description: string

  @Column()
  check: boolean

  @ManyToOne(() => User, user => user.tasks)
  @JoinColumn({ name: 'user_id' })
  user: User
}