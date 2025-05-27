/* import express from 'express'

const app = express()
app.use(express.json())
app.listen(3000, () => console.log('work on Port: 3000')) */

import 'dotenv/config'

/* import getObjectsAndClients from './modules/getEntities/getObjectsAndClients.js'
import getTariffs from './modules/getEntities/getTariffs.js'
await getTariffs()
await getObjectsAndClients() */

/* import createIssues from './modules/createIssues/createIssues.js'
console.log(await createIssues(423, 14, '2025-03-31')) */

import deleteIssues from './modules/deleteIssues/deleteIssues.js'
console.log(await deleteIssues(423))
