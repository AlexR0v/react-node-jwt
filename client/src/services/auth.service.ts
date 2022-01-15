import { AxiosResponse }         from 'axios'
import api                       from '../http/index'
import { AuthResponseInterface } from '../types/authResponse.interface'

export default class AuthService {
  static async login(email: string, password: string): Promise<AxiosResponse<AuthResponseInterface>>{
    return api.post<AuthResponseInterface>('/login', { email, password })
  }

  static async register(email: string, password: string): Promise<AxiosResponse<AuthResponseInterface>>{
    return api.post<AuthResponseInterface>('/registration', { email, password })
  }

  static async logout(): Promise<void>{
    return api.post('/logout')
  }

}
