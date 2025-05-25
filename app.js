/* import express from 'express'

const app = express()
app.use(express.json())
app.listen(3000, () => console.log('work on Port: 3000')) */

import 'dotenv/config'

import getObjectsAndClients from './modules/getEntities/getObjectsAndClients.js'
import getTariffs from './modules/getEntities/getTariffs.js'
getTariffs

await getObjectsAndClients()
