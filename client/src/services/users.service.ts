import { AxiosResponse } from 'axios'
import api               from '../http/index'
import { UserInterface } from '../types/user.interface'

export default class UsersService {
  static async getUsers(): Promise<AxiosResponse<UserInterface[]>>{
    return api.get<UserInterface[]>('/users')
  }
}
