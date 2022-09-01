import { IOtherUser, IUser } from 'app/shared/services/user/user.interface'

export interface IClanWithOwner {
  _id: string
  owner: IUser
  name: string
  description: string
  isRequest: number
}

export interface IClan {
  _id: string
  name: string
  description: string
  owner: string
}

export interface IClanRequest {
  _id: string
  user: IOtherUser
}