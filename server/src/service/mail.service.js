import nodemailer from 'nodemailer'

export const sendActivationMail = async (to, link) => {
  try {

    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    })

    await transport.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `Активация аккаунта на ` + process.env.API_URL,
      text: '',
      html:
        `
          <div>
            <h1>Для активации аккаунта перейдите по ссылке:</h1>
            <a href='${link}'>${link}</a>
          </div>
        `
    })
  } catch (e) {
    console.log(e)
  }
}
