import addCommentToIssueAPI from '../../API/addCommentToIssueAPI.js'
import addNestedIssueAPI from '../../API/addNestedIssueAPI.js'
import changeIssueParamsAPI from '../../API/changeIssueParamsAPI.js'
import changeStatusAPI from '../../API/changeStatusAPI.js'
import getCompanyAPI from '../../API/getCompanyAPI.js'
import billingTable from '../../DB/billingTable.js'
import clientsTable from '../../DB/clientsTable.js'
import servicersTable from '../../DB/servicersTable.js'
import versionsTable from '../../DB/versionsTable.js'
import {
	_commentNestedEndText,
	_nestedEndStatus,
	_nestedType,
} from '../../settings/setSettings.js'
import createDecoding from '../createDecoding/createDecoding.js'
import createSpecification from '../createSpecification/createSpecification.js'
import checkIsServicerInDB from './utils/checkIsServicerInDB.js'
import getCurClientServicer from './utils/getCurClientServicer.js'
import getCurEquipment from './utils/getCurEquipment.js'
import getCurPrice from './utils/getCurPrice.js'
import getCurTariffId from './utils/getCurTariffId.js'
import getCurVersionId from './utils/getCurVersionId.js'
import parseParametersForNestedIssue from './utils/parseParametersForNestedIssue.js'
import parseParentIssueData from './utils/parseParentIssueData.js'

const _clientsTableDB = new clientsTable()
const _servicersTableDB = new servicersTable()
const _versionsTableDB = new versionsTable()
const _billingTableDB = new billingTable()

export default async function createIssues(parentIssueData) {
	let { parentIssueId, parentIssueClientId, invoiceDate } =
		await parseParentIssueData(parentIssueData)

	let parentIssueClientInfo = await getCompanyAPI(parentIssueClientId)
	let parentIssueClientName = parentIssueClientInfo.name

	let activeClients = await _clientsTableDB.getActiveClients()

	// Проверка есть ли обслуживающая организация в БД
	let isServicerInDB = await checkIsServicerInDB(parentIssueClientId)
	if (!isServicerInDB) {
		await _servicersTableDB.addServicer(
			parentIssueClientId,
			parentIssueClientName
		)
		console.log(
			await _versionsTableDB.addVersion(
				parentIssueClientId,
				parentIssueId,
				invoiceDate,
				false
			)
		)
	} else {
		await _versionsTableDB.addVersion(
			parentIssueClientId,
			parentIssueId,
			invoiceDate,
			false
		)
	}

	// Перебор клиентов с биллингуемым оборудованием
	let curClientId
	let curClientName
	let curClientServicer
	let curEquipments
	let curTariffId
	let curPrice
	let curVersionId
	for (let client of activeClients) {
		curClientId = client.company_id
		curClientName = client.company_name
		curClientServicer = await getCurClientServicer(curClientId)

		// Проверка соответствия обслуживающей организации
		if (curClientServicer.includes(parentIssueClientName)) {
			curEquipments = await getCurEquipment(curClientId)

			// Создание вложенной заявки
			let curIssueId = await addNestedIssueAPI(
				parentIssueId,
				curClientId,
				curClientName,
				curEquipments,
				_nestedType
			)

			// Добавление биллинга в БД
			for (let curEquipId of curEquipments) {
				curTariffId = await getCurTariffId(curEquipId)
				curPrice = await getCurPrice(curTariffId)
				curVersionId = await getCurVersionId(parentIssueId)

				await _billingTableDB.addBilling(
					curVersionId,
					curEquipId,
					curIssueId,
					curPrice
				)
			}

			// Создание спецификации
			await createSpecification(curIssueId, curEquipments)

			// Создание расшифровки
			await createDecoding(
				curIssueId,
				curClientId,
				curEquipments,
				curVersionId,
				invoiceDate
			)

			// Добавление атрибутов в заявку
			let curIssueParams = await parseParametersForNestedIssue(
				parentIssueClientInfo,
				parentIssueData
			)
			await changeIssueParamsAPI(curIssueId, curIssueParams, invoiceDate)

			// Смена статуса и комментарий
			await addCommentToIssueAPI(curIssueId, _commentNestedEndText)
			await new Promise(resolve => setTimeout(resolve, 200))
			await changeStatusAPI(curIssueId, _nestedEndStatus)
			await new Promise(resolve => setTimeout(resolve, 200))
		}
	}
}
