import bcrypt                 from 'bcrypt'
import { v4 as uuidv4 }       from 'uuid'
import { UserDto }            from '../dto/user.dto.js'
import { ApiException }       from '../exceptions/api.exception.js'
import UserModel              from '../models/user.model.js'
import { sendActivationMail } from './mail.service.js'
import tokenService           from './token.service.js'

class UserService {
  async registration (email, password) {
    const candidate = await UserModel.findOne({ email })
    if (candidate) {
      throw ApiException.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
    }
    const hashPassword = await bcrypt.hash(password, 5)
    const activationLink = uuidv4()
    const user = await UserModel.create({ email, password: hashPassword, activationLink })
    await sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)
    const userDto = new UserDto(user)
    const tokens = tokenService.generateToken({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens, user: userDto
    }
  }

  async activation (activationLink) {
    const user = await UserModel.findOne({ activationLink })
    if (!user) {
      throw ApiException.BadRequest(`Некоррекнтая ссылка`)
    }
    user.isActivated = true
    await user.save()
  }

  async login (email, password) {
    const user = await UserModel.findOne({ email })
    if (!user) {
      throw ApiException.BadRequest(`Пользователь с почтовым адресом ${email} ненайден`)
    }
    const isPassEquals = await bcrypt.compare(password, user.password)
    if (!isPassEquals) {
      throw ApiException.BadRequest(`Пароль не верный`)
    }
    const userDto = new UserDto(user)
    const tokens = tokenService.generateToken({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens, user: userDto
    }
  }

  async logout (refreshToken) {
    return await tokenService.removeToken(refreshToken)
  }

  async refresh (refreshToken) {
    if (!refreshToken) {
      throw ApiException.UnauthorizedError()
    }
    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await tokenService.findToken(refreshToken)
    if (!userData || !tokenFromDb) {
      throw ApiException.UnauthorizedError()
    }
    const user = await UserModel.findById(userData.id)
    const userDto = new UserDto(user)
    const tokens = tokenService.generateToken({ ...userDto })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return { ...tokens, user: userDto }
  }

  async getUsers () {
    const users = await UserModel.find()
    return users.map(user => new UserDto(user))
  }

  async deleteUser (id) {
    const user = await UserModel.findById(id)
    if (!user) {
      throw ApiException.BadRequest(`Пользователь не найден`)
    }
    await UserModel.findByIdAndDelete(id)
  }
}

export default new UserService()
