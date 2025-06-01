import express from 'express'
import {
	_commentCancelEndText,
	_commentCancelStartText,
	_commentCreateEndText,
	_commentCreateStartText,
	_parentCancelEndStatus,
	_parentCancelStartStatus,
	_parentCreateEndStatus,
	_parentCreateStartStatus,
	_parentType,
} from './settings/setSettings.js'

import 'dotenv/config'
import addCommentToIssueAPI from './API/addCommentToIssueAPI.js'
import changeStatusAPI from './API/changeStatusAPI.js'
import createIssues from './modules/createIssues/createIssues.js'
import deleteIssues from './modules/deleteIssues/deleteIssues.js'
import getObjectsAndClients from './modules/getEntities/getObjectsAndClients.js'
import getTariffs from './modules/getEntities/getTariffs.js'

import billingTable from './DB/billingTable.js'
import clientsTable from './DB/clientsTable.js'
import objectsTable from './DB/objectsTable.js'
import servicersTable from './DB/servicersTable.js'
import tariffsTable from './DB/tariffsTable.js'
import versionsTable from './DB/versionsTable.js'
import { routers } from './routers/routers.js'

const _tariffsTableDB = new tariffsTable()
const _clientsTableDB = new clientsTable()
const _objectsTableDB = new objectsTable()
const _billingTableDB = new billingTable()
const _servicersTableDB = new servicersTable()
const _versionsTableDB = new versionsTable()

await _clientsTableDB.createTableClientsIfNotExist()
await _tariffsTableDB.createTableTariffsIfNotExist()
await _servicersTableDB.createTableServicersIfNotExists()
await _objectsTableDB.createTableObjectsIfNotExist()
await _versionsTableDB.createTableVersionsIfNotExists()
await _billingTableDB.createTableBillingIfNotExist()

export const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.listen(PORT, () => console.log(`work on Port: ${PORT}`))

app.get('/', (req, res) => {
	res.send('Приложение работает')
	res.status(200)
})

app.post('/', async (req, res) => {
	let issueData = req.body.issue
	let issueId = issueData.id
	let curType = issueData.type.code
	let curStatus = issueData.status.code

	if (curType == _parentType && curStatus == _parentCreateStartStatus) {
		await addCommentToIssueAPI(issueId, _commentCreateStartText)
		await getTariffs()
		await getObjectsAndClients()
		await createIssues(issueData)
		await changeStatusAPI(issueId, _parentCreateEndStatus)
		await addCommentToIssueAPI(issueId, _commentCreateEndText)
	} else if (curType == _parentType && curStatus == _parentCancelStartStatus) {
		await addCommentToIssueAPI(issueId, _commentCancelStartText)
		await deleteIssues(issueId)
		await changeStatusAPI(issueId, _parentCancelEndStatus)
		await addCommentToIssueAPI(issueId, _commentCancelEndText)
	}
	res.send(req.body)
	res.status(200)
})

app.use('/', routers)
