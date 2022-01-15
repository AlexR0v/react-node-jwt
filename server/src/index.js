import cookieParser        from 'cookie-parser'
import cors                from 'cors'
import dotenv              from 'dotenv'
import express             from 'express'
import mongoose            from 'mongoose'
import { errorMiddleware } from './middlewares/error.middleware.js'
import router              from './router/index.js'

dotenv.config()
const PORT = process.env.PORT ?? 5501

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}))
app.use('/api', router)
app.use(errorMiddleware)

const bootstrap = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
      .then((e) => console.log(`Connected to db_name: ${e.connections[0].name}`))
    app.listen(PORT, () => console.log(`Server started on port:${PORT}`))
  } catch (e) {
    console.log(e)
  }
}

bootstrap()
