export class ApiException extends Error {
  status
  errors

  constructor (status, message, errors = []) {
    super(message)
    this.status = status
    this.errors = errors
  }

  static UnauthorizedError () {
    return new ApiException(401, 'Пользователь не авторизован')
  }

  static BadRequest (message, errors = []) {
    return new ApiException(400, message, errors)
  }
}
