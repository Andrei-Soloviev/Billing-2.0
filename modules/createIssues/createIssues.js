import addNestedIssueAPI from '../../API/addNestedIssueAPI.js'
import getCompanyAPI from '../../API/getCompanyAPI.js'
import billingTable from '../../DB/billingTable.js'
import clientsTable from '../../DB/clientsTable.js'
import servicersTable from '../../DB/servicersTable.js'
import versionsTable from '../../DB/versionsTable.js'
import checkIsServicerInDB from './utils/checkIsServicerInDB.js'
import getCurClientServicer from './utils/getCurClientServicer.js'
import getCurEquipment from './utils/getCurEquipment.js'
import getCurPrice from './utils/getCurPrice.js'
import getCurTariffId from './utils/getCurTariffId.js'
import getCurVersionId from './utils/getCurVersionId.js'

const _clientsTableDB = new clientsTable()
const _servicersTableDB = new servicersTable()
const _versionsTableDB = new versionsTable()
const _billingTableDB = new billingTable()

export default async function createIssues(
	parentIssueId,
	parentIssueClientId,
	invoiceDate
) {
	let parentIssueClientName = (await getCompanyAPI(parentIssueClientId)).name
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

	let curClientId
	let curClientName
	let curClientServicer
	let curEquipments
	let curTariffId
	let curPrice
	let curVersionId
	// Перебор клиентов с биллингуемым оборудованием
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
				curEquipments
			)

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

			await new Promise(resolve => setTimeout(resolve, 200))
		}
	}
	return parentIssueClientName
}
