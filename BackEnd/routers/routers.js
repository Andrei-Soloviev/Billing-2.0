import express from 'express'
import addIssueAPI from '../API/addIssueAPI.js'
import changeIssueParamsAPI from '../API/changeIssueParamsAPI.js'
import changeStatusAPI from '../API/changeStatusAPI.js'
import billingTable from '../DB/billingTable.js'
import versionsTable from '../DB/versionsTable.js'
import {
	_issueInvoiceDateParamCode,
	_parentCreateStartStatus,
	_parentIssueCompanyId,
	_parentIssueTitle,
	_parentType,
} from '../settings/setSettings.js'

const _versionsTableDB = new versionsTable()
const _billingTableDB = new billingTable()

export const routers = express.Router()

routers.get('/versions/list', async (req, res) => {
	let allVersions = await _versionsTableDB.getAllVersions()
	console.log(allVersions)
	res.send(allVersions)
	res.status(200)
})

/* routers.get('/activeVersionsList', async (req, res) => {
	let allActiveVersions = await _versionsTableDB.getActiveVersions()
	res.send(allActiveVersions)
	res.status(200)
}) */

routers.get(`/version/:id`, async (req, res) => {
	const { id } = req.params
	let version = await _billingTableDB.findBillingByVersionId(id)
	res.send(version)
	res.status(200)
})

routers.post('/versions', async (req, res) => {
	let issueId = await addIssueAPI(
		_parentIssueCompanyId,
		_parentType,
		_parentIssueTitle
	)
	let invoiceDate = req.body.date
	invoiceDate = invoiceDate.split('.').reverse().join('-')
	let params = {}
	params[_issueInvoiceDateParamCode] = invoiceDate
	await changeIssueParamsAPI(issueId, params)
	await changeStatusAPI(issueId, _parentCreateStartStatus)
	res.send(issueId)
})
