import clientsTable from '../../DB/clientsTable.js'
import objectsTable from '../../DB/objectsTable.js'
import tariffsTable from '../../DB/tariffsTable.js'
import checkIsClientInDB from './services/checkIsClientInDB.js'
import checkIsObjectInDB from './services/checkIsObjectInDB.js'
import getBillableEquipmentsListAPI from './services/getBillableEquipmentsListAPI.js'
import getCompanyAPI from './services/getCompanyAPI.js'
import parseClientData from './utils/parseClientData.js'
import parseEquipmentData from './utils/parseEquipmentData.js'

const _tariffsTableDB = new tariffsTable()
const _clientsTableDB = new clientsTable()
const _objectsTableDB = new objectsTable()

export default async function getObjectsAndClients() {
	let startId = 0
	let result

	await _clientsTableDB.truncateClients()

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
				companyId = elem.company.id
				let companyData = await getCompanyAPI(companyId)
				let { companyName, companyAgreement } = parseClientData(companyData)

				let isClientInDb = await checkIsClientInDB(companyId)
				if (!isClientInDb) {
					await _clientsTableDB.addClient(
						companyId,
						companyName,
						companyAgreement,
						true
					)
				}
			} catch (e) {
				startId = objectId + 1
				continue
			}

			let { name, tariffId, number, ownerSim, numberSim, avtograf } =
				await parseEquipmentData(elem)

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
			}
			/* console.log({
				id: id,
				companyId: companyId,
				tariffId: tariffId,
				name: type + manufacturer + model + number,
				number: number,
				ownerSim: ownerSim,
				numberSim: numberSim,
				avtograf: avtograf,
			}) */
			startId = objectId + 1

			await new Promise(resolve => setTimeout(resolve, 200))
		}
	}
}
