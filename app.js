/* import express from 'express'

const app = express()
app.use(express.json())
app.listen(3000, () => console.log('work on Port: 3000')) */

import 'dotenv/config'
import DB from './db/db.js'
import { getClientsAndEquipments } from './modules/getEntities.js'

console.log(process.env.PORT)
let db = new DB()
await db.addTariff(54, 'a', 22, 'ad')

console.log(await getClientsAndEquipments())
