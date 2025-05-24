/* import express from 'express'

const app = express()
app.use(express.json())
app.listen(3000, () => console.log('work on Port: 3000')) */

import 'dotenv/config'
import { getTariffs } from './modules/getEntities.js'

console.log(await getTariffs())
