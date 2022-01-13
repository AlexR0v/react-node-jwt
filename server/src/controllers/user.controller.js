import userService from '../service/user.service.js'

class UserController {
  async registration (req, res, next) {
    try {
      const { email, password } = req.body
      const userData = await userService.registration(email, password)
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
      return res.status(201).json(userData)

    } catch (e) {
      console.log(e)
    }
  }

  async login (req, res, next) {
    try {

    } catch (e) {
      console.log(e)
    }
  }

  async logout (req, res, next) {
    try {

    } catch (e) {
      console.log(e)
    }
  }

  async activate (req, res, next) {
    try {

    } catch (e) {
      console.log(e)
    }
  }

  async refresh (req, res, next) {
    try {

    } catch (e) {
      console.log(e)
    }
  }

  async getUsers (req, res, next) {
    try {
      const users = await userService.getUsers()
      res.json(users)
    } catch (e) {
      console.log(e)
    }
  }
}

export default new UserController()