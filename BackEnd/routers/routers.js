import express from 'express'
import changeStatusAPI from '../API/changeStatusAPI.js'
import billingTable from '../DB/billingTable.js'
import versionsTable from '../DB/versionsTable.js'
import {
	_account,
	_parentCancelStartStatus,
	_parentCreateStartStatus,
} from '../settings/setSettings.js'

const _versionsTableDB = new versionsTable()
const _billingTableDB = new billingTable()
const versions = await _versionsTableDB.getAllVersions()

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

// Ссылка на заявку по версии
routers.get('/version/link/:id', async (req, res) => {
	const { id } = req.params
	let issueId = (await _versionsTableDB.findVersionById(id)).issue_id
	res.send({ link: `https://${_account}.okdesk.ru/issues/${issueId}` })
	res.status(200)
})

// Создание версии
routers.post('/versions', async (req, res) => {
	let invoiceDate = req.body.date
	let parentIssueCompanyId = req.body.parentIssueCompanyId
	invoiceDate = invoiceDate.split('.').reverse().join('-')
	let curMonthName = await getCalculationPeriod(invoiceDate)
	let issueName = _parentIssueTitle + ' ' + curMonthName

	let params = {}
	params[_issueInvoiceDateParamCode] = invoiceDate

	let issueId = await addIssueAPI(parentIssueCompanyId, _parentType, issueName)
	await changeIssueParamsAPI(issueId, params)
	await changeStatusAPI(issueId, _parentCreateStartStatus)
	res.send({ issueId: 'Создана' })
	res.status(200)
})

// Отмена версии
routers.get(`/version/cancel/:id`, async (req, res) => {
	const { id } = req.params
	console.log(id)
	let issueId = (await _versionsTableDB.findVersionById(id)).issue_id
	console.log(issueId)
	await changeStatusAPI(issueId, _parentCancelStartStatus)
	res.send({ issueId: 'Отменена' })
	res.status(200)
})

// Запуск отмененной версии
routers.get(`/version/start/:id`, async (req, res) => {
	const { id } = req.params
	console.log(id)
	let issueId = (await _versionsTableDB.findVersionById(id)).issue_id
	console.log(issueId)
	await changeStatusAPI(issueId, _parentCreateStartStatus)
	res.send({ issueId: 'Запущена' })
	res.status(200)
})
