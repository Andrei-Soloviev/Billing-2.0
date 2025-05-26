/* import express from 'express'

const app = express()
app.use(express.json())
app.listen(3000, () => console.log('work on Port: 3000')) */

import 'dotenv/config'

import createIssues from './modules/createIssues/createIssues.js'

console.log(await createIssues(423, 14, '2025-03-31'))
