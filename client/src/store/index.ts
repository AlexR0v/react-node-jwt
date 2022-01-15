import axios                     from 'axios'
import { makeAutoObservable }    from 'mobx'
import { BASE_URL }              from '../http/index'
import AuthService               from '../services/auth.service'
import UsersService              from '../services/users.service'
import { AuthResponseInterface } from '../types/authResponse.interface'
import { UserInterface }         from '../types/user.interface'

export default class Store {
  user = {} as UserInterface
  users = [] as UserInterface[]
  isAuth = false
  isLoading = false

  constructor(){
    makeAutoObservable(this)
  }

  setAuth(data: boolean){
    this.isAuth = data
  }

  setLoading(bool: boolean){
    this.isLoading = bool
  }

  setUser(user: UserInterface){
    this.user = user
  }

  setUsers(users: UserInterface[]){
    this.users = users
  }

  async login(email: string, password: string){
    try {
      const res = await AuthService.login(email, password)
      localStorage.setItem('token', res.data.accessToken)
      this.setAuth(true)
      this.setUser(res.data.user)
    } catch (e) {
      console.log(e)
    }
  }

  async register(email: string, password: string){
    try {
      const res = await AuthService.register(email, password)
      localStorage.setItem('token', res.data.accessToken)
      this.setAuth(true)
      this.setUser(res.data.user)
    } catch (e) {
      console.log(e)
    }
  }

  async logout(){
    try {
      const res = await AuthService.logout()
      localStorage.removeItem('token')
      this.setAuth(false)
      this.setUser({} as UserInterface)
      this.setUsers([] as UserInterface[])
    } catch (e) {
      console.log(e)
    }
  }

  async checkAuth(){
    this.setLoading(true)
    try {
      const res = await axios.get<AuthResponseInterface>(`${BASE_URL}/refresh`, { withCredentials: true })
      localStorage.setItem('token', res.data.accessToken)
      this.setAuth(true)
      this.setUser(res.data.user)
    } catch (e) {
      console.log(e)
    } finally {
      this.setLoading(false)
    }
  }

  async getUsers(){
    try {
      const res = await UsersService.getUsers()
      this.setUsers(res.data)
    } catch (e) {
      console.log(e)
    }
  }
}
