import bcrypt           from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { UserDto }      from '../dto/user.dto.js'
import UserModel        from '../models/user.model.js'
import mailService      from './mail.service.js'
import tokenService     from './token.service.js'

class UserService {
  async registration (email, password) {
    const candidate = await UserModel.findOne({ email })
    if (candidate) {
      throw new Error(`Пользователь с почтовым адресом ${email} уже существует`)
    }
    const hashPassword = await bcrypt.hash(password, 5)
    const activationLink = uuidv4()
    const user = await UserModel.create({ email, password: hashPassword, activationLink })
    await mailService.sendActivationMail(email, activationLink)
    const userDto = new UserDto(user)
    const tokens = tokenService.generateToken({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens, user: userDto
    }
  }

  async getUsers () {
    const users = await UserModel.find()
    return users.map(user => new UserDto(user))
  }
}

export default new UserService()
