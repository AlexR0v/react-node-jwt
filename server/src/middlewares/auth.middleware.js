import { ApiException } from '../exceptions/api.exception.js'
import tokenService     from '../service/token.service.js'

export const authMiddleware = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader) {
      return next(ApiException.UnauthorizedError())
    }

    const accessToken = authorizationHeader.split(' ')[1]
    if (!accessToken) {
      return next(ApiException.UnauthorizedError())
    }

    const userData = tokenService.validateAccessToken(accessToken)
    if (!userData) {
      return next(ApiException.UnauthorizedError())
    }

    req.user = userData
    next()
  } catch (e) {
    return next(ApiException.UnauthorizedError())
  }
}
