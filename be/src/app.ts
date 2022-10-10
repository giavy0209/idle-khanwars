import express from 'express'
import routers from 'routers'
import cors from 'cors'
import { errorHandlers } from 'utils'
import path from 'path'
const app = express()
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: '100mb' }))
app.use('/api', routers)
app.use(errorHandlers.internalServerError)
app.use(errorHandlers.PageNotFound)

export default app