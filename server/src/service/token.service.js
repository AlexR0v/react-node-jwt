import jwt        from 'jsonwebtoken'
import tokenModel from '../models/token.model.js'

class TokenService {
  generateToken (payload) {
    const accessToken = jwt.sign(payload, process.env.SECRET_KEY_JWT, { expiresIn: '30m' })
    const refreshToken = jwt.sign(payload, process.env.SECRET_KEY_JWT_REFRESH, { expiresIn: '30d' })
    return { accessToken, refreshToken }
  }

  async saveToken (userId, refreshToken) {
    const tokenData = await tokenModel.findOne({ user: userId })
    if (tokenData) {
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }
    return await tokenModel.create({ user: userId, refreshToken })
  }
}

export default new TokenService()
