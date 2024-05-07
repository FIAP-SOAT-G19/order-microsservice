import '../shared/config/module-alias'
import express from 'express'
import cors from 'cors'
import { router } from './routes'
import { logger } from '@/shared/helpers/logger.helper'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/v1', router)

const port = process.env.PORT ?? 3000

app.listen(port, () => { logger.info(`Server running at port ${port}`) })
