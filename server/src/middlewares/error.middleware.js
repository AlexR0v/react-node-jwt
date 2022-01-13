import { ApiException } from '../exceptions/api.exception.js'

export const errorMiddleware = (err, req, res, next) => {
  console.log(err)
  if (err instanceof ApiException) {
    return res.status(err.status).json({ message: err.message, errors: err.errors })
  }
  return res.status(500).json({ message: 'Что-то пошло не так' })
}
