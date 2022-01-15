import { validationResult } from 'express-validator'
import { ApiException }     from '../exceptions/api.exception.js'
import userService          from '../service/user.service.js'

class UserController {
  async registration (req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiException.BadRequest('Ошибка валидации', errors.array()))
      }
      const { email, password } = req.body
      const userData = await userService.registration(email, password)
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
      return res.status(201).json(userData)

    } catch (e) {
      next(e)
    }
  }

  async login (req, res, next) {
    try {
      const { email, password } = req.body
      const userData = await userService.login(email, password)
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
      return res.status(201).json(userData)
    } catch (e) {
      next(e)
    }
  }

  async logout (req, res, next) {
    try {
      const { refreshToken } = req.cookies

      const token = await userService.logout(refreshToken)
      res.clearCookie('refreshToken')
      return res.json(token)

    } catch (e) {
      next(e)
    }
  }

  async activate (req, res, next) {
    try {
      const activationLink = req.params.link
      await userService.activation(activationLink)
      return res.redirect(process.env.CLIENT_URL)
    } catch (e) {
      next(e)
    }
  }

  async refresh (req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const userData = await userService.refresh(refreshToken)
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
      return res.status(201).json(userData)
    } catch (e) {
      next(e)
    }
  }

  async getUsers (req, res, next) {
    try {
      const users = await userService.getUsers()
      res.json(users)
    } catch (e) {
      next(e)
    }
  }

  async deleteUser (req, res, next) {
    try {
      const { id } = req.params
      await userService.deleteUser(id)
      res.json({ message: 'Пользователь удален' })
    } catch (e) {
      next(e)
    }
  }
}

export default new UserController()
