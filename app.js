import express from 'express'
import {
	_invoiceDateParamCode,
	_parentCancelStartStatus,
	_parentCreateStartStatus,
	_parentType,
} from './settings/setSettings.js'

import createIssues from './modules/createIssues/createIssues.js'
import deleteIssues from './modules/deleteIssues/deleteIssues.js'
import getObjectsAndClients from './modules/getEntities/getObjectsAndClients.js'
import getTariffs from './modules/getEntities/getTariffs.js'

const app = express()
app.use(express.json())
app.listen(3000, () => console.log('work on Port: 3000'))

app.get('/', (req, res) => {
	res.send('Приложение работает')
	res.status(200)
})
app.post('/', async (req, res) => {
	let curType = req.body.issue.type.code
	let curStatus = req.body.issue.status.code

	let issueData = req.body.issue
	let issueId = issueData.id
	let issueClientId = issueData.client.company.id
	let issueInvoiceDate = issueData.parameters.filter(
		elem => elem.code == _invoiceDateParamCode
	)[0].value

	if (curType == _parentType && curStatus == _parentCreateStartStatus) {
		console.log(`Генерация: ${curStatus}`)
		let issueData = req.body.issue
		let issueId = issueData.id
		let issueClientId = issueData.client.company.id
		let issueInvoiceDate = issueData.parameters.filter(
			elem => elem.code == _invoiceDateParamCode
		)[0].value
		await getTariffs()
		await getObjectsAndClients()
		await createIssues(issueId, issueClientId, issueInvoiceDate)
	} else if (curType == _parentType && curStatus == _parentCancelStartStatus) {
		let issueId = issueData.id
		console.log(`Отмена: ${curStatus}`)
		await deleteIssues(issueId)
	}
	res.send(req.body)
	res.status(200)
})

import 'dotenv/config'

/* import createIssues from './modules/createIssues/createIssues.js'
console.log(await createIssues(423, 14, '2025-03-31')) */

/* import deleteIssues from './modules/deleteIssues/deleteIssues.js'
console.log(await deleteIssues(423)) */
