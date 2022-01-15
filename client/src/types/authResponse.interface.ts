import { UserInterface } from './user.interface'

export interface AuthResponseInterface {
  accessToken: string
  refreshToken: string
  user: UserInterface
}
