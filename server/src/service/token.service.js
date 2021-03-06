import jwt        from 'jsonwebtoken'
import tokenModel from '../models/token.model.js'

class TokenService {
  generateToken (payload) {
    const accessToken = jwt.sign(payload, process.env.SECRET_KEY_JWT, { expiresIn: '10m' })
    const refreshToken = jwt.sign(payload, process.env.SECRET_KEY_JWT_REFRESH, { expiresIn: '30d' })
    return { accessToken, refreshToken }
  }

  validateAccessToken (token) {
    try {
      return jwt.verify(token, process.env.SECRET_KEY_JWT)
    } catch (e) {
      return null
    }
  }

  validateRefreshToken (token) {
    try {
      return jwt.verify(token, process.env.SECRET_KEY_JWT_REFRESH)
    } catch (e) {
      return null
    }
  }

  async saveToken (userId, refreshToken) {
    const tokenData = await tokenModel.findOne({ user: userId })
    if (tokenData) {
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }
    return await tokenModel.create({ user: userId, refreshToken })
  }

  async removeToken (refreshToken) {
    return await tokenModel.deleteOne({ refreshToken })
  }

  async findToken (refreshToken) {
    return await tokenModel.findOne({ refreshToken })
  }
}

export default new TokenService()
