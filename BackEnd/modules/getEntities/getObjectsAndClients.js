import getBillableEquipmentsListAPI from '../../API/getBillableEquipmentsListAPI.js'
import getCompanyAPI from '../../API/getCompanyAPI.js'
import clientsTable from '../../DB/clientsTable.js'
import objectsTable from '../../DB/objectsTable.js'
import checkIsClientInDB from './utils/checkIsClientInDB.js'
import checkIsObjectInDB from './utils/checkIsObjectInDB.js'
import parseClientData from './utils/parseClientData.js'
import parseEquipmentData from './utils/parseEquipmentData.js'

const _clientsTableDB = new clientsTable()
const _objectsTableDB = new objectsTable()

export default async function getObjectsAndClients() {
	let startId = 0
	let result
	await _clientsTableDB.deactivateClients()
	await _objectsTableDB.deactivateObjects()
	while (true) {
		let result = await getBillableEquipmentsListAPI(startId)
		if (result == '' || result.parent_id != null) {
			break
		}
		for (let elem of result) {
			let objectId = elem.id
			let companyId

			try {
				if (elem.parent_id != null) {
					continue
				}
				// Получение данных клиента
				companyId = elem.company.id
				let companyData = await getCompanyAPI(companyId)
				let { companyName, companyAgreement } = parseClientData(companyData)

				// 	Вставка клиента в БД
				let isClientInDb = await checkIsClientInDB(companyId)
				if (!isClientInDb) {
					await _clientsTableDB.addClient(
						companyId,
						companyName,
						companyAgreement,
						true
					)
				} else {
					await _clientsTableDB.activateClient(
						companyId,
						companyName,
						companyAgreement,
						true
					)
				}
				// Если у оборудки нет клиента
			} catch (e) {
				startId = objectId + 1
				continue
			}

			let { name, tariffId, number, ownerSim, numberSim, avtograf } =
				await parseEquipmentData(elem)

			// Вставка объекта в БД
			let isObjInDB = await checkIsObjectInDB(objectId)
			if (!isObjInDB) {
				await _objectsTableDB.addObject(
					objectId,
					companyId,
					tariffId,
					name,
					number,
					ownerSim,
					numberSim,
					avtograf,
					true
				)
			} else {
				await _objectsTableDB.changeObject(
					objectId,
					companyId,
					tariffId,
					name,
					number,
					ownerSim,
					numberSim,
					avtograf,
					true
				)
			}
			startId = objectId + 1

			await new Promise(resolve => setTimeout(resolve, 200))
		}
	}
}
