import express from 'express'
import {
	_commentCancelEndText,
	_commentCancelStartText,
	_commentCreateEndText,
	_commentCreateStartText,
	_commentWrongCompanyText,
	_parentCancelEndStatus,
	_parentCancelStartStatus,
	_parentCreateEndStatus,
	_parentCreateStartStatus,
	_parentIssueCompanyId,
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
import { insertBilling } from './datamart/datamartBilling.js'
import { insertClient } from './datamart/datamartClients.js'
import { insertObject } from './datamart/datamartObjects.js'
import { insertServicer } from './datamart/datamartServicers.js'
import { insertTariff } from './datamart/datamartTariffs.js'
import { insertVersion } from './datamart/datamartVersions.js'
import isIssueMiddleware from './middlewares/isIssueMiddleware.js'
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

/* await truncateTariffsCascade() */
const tariffs = await _tariffsTableDB.getTariffs()
const servicers = await _servicersTableDB.getServicers()
const versions = await _versionsTableDB.getAllVersions()
const clients = await _clientsTableDB.getClients()
const objects = await _objectsTableDB.getObjects()
const billing = await _billingTableDB.getBilling()

let queueWebhooks = [] // Очередь вебхуков
let isWebhook = false // Идет ли обработка вебхука в данный момент

app.get('/', (req, res) => {
	res.send('Приложение работает')
	res.status(200)
})

app.post('/', isIssueMiddleware, async (req, res) => {
	// Сразу кидаем статус, чтобы избежать повторных вебхуков
	res.status(200)
	res.send('Вебхук принят')

	// Проверка идет ли обработка вебхука прямо сейчас
	if (isWebhook) {
		queueWebhooks.push(req)
	}
	isWebhook = true

	let issueData = req.body.issue
	let issueId = issueData.id
	let curType = issueData.type.code
	let curStatus = issueData.status.code
	let curClientId = issueData.client.company.id

	if (curType == _parentType && curStatus == _parentCreateStartStatus) {
		// Проверка "Выбрана ли правильная компания"
		if (curClientId == _parentIssueCompanyId) {
			await addCommentToIssueAPI(issueId, _commentCreateStartText)
			// Получение текущего состояния из Okdesk
			await getTariffs()
			await getObjectsAndClients()
			await createIssues(issueData)
			await changeStatusAPI(issueId, _parentCreateEndStatus)
			await addCommentToIssueAPI(issueId, _commentCreateEndText)

			// Вставка данных в кликхаус
			/* for (let tariff of tariffs) {
				await insertTariff(tariff)
			}
			for (let servicer of servicers) {
				await insertServicer(servicer)
			}
			for (let version of versions) {
				await insertVersion(version)
			}
			for (let client of clients) {
				await insertClient(client)
			}
			for (let object of objects) {
				await insertObject(object)
			}
			for (let invoice of billing) {
				await insertBilling(invoice)
			} */
		} else {
			await addCommentToIssueAPI(issueId, _commentWrongCompanyText)
		}
	} else if (curType == _parentType && curStatus == _parentCancelStartStatus) {
		await addCommentToIssueAPI(issueId, _commentCancelStartText)
		await deleteIssues(issueId)
		await changeStatusAPI(issueId, _parentCancelEndStatus)
		await addCommentToIssueAPI(issueId, _commentCancelEndText)
		/* for (let version of versions) {
			await insertVersion(version)
		} */
	}

	isWebhook = false
})

app.use('/', routers)

// Обработка очереди вебхуков
for (req of queueWebhooks) {
	isWebhook = true

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
		for (let tariff of tariffs) {
			await insertTariff(tariff)
		}
		for (let servicer of servicers) {
			await insertServicer(servicer)
		}
		for (let version of versions) {
			await insertVersion(version)
		}
		for (let client of clients) {
			await insertClient(client)
		}
		for (let object of objects) {
			await insertObject(object)
		}
		for (let invoice of billing) {
			await insertBilling(invoice)
		}
	} else if (curType == _parentType && curStatus == _parentCancelStartStatus) {
		await addCommentToIssueAPI(issueId, _commentCancelStartText)
		await deleteIssues(issueId)
		await changeStatusAPI(issueId, _parentCancelEndStatus)
		await addCommentToIssueAPI(issueId, _commentCancelEndText)
		for (let version of versions) {
			await insertVersion(version)
		}
	}

	res.send(req.body)
	res.status(200)
	isWebhook = false
}
