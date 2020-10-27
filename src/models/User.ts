import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm'
import bcrypt from 'bcrypt'

import Task from './Task'

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  password_hash: string

  @OneToMany(() => Task, task => task.user, {
    cascade: ['insert', 'update']
  })
  @JoinColumn({ name: 'user_id' })
  tasks: Task[]

  hashPassword() {
    this.password_hash = bcrypt.hashSync(this.password_hash, 8);
  }

  checkIfPasswordAndHashMatch(password: string) {
    return bcrypt.compareSync(password, this.password_hash)
  }
}