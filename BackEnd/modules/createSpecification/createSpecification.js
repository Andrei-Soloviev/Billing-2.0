import addSpecificationAPI from '../../API/addSpecificationAPI.js'
import objectsTable from '../../DB/objectsTable.js'

const _objectsTableDB = new objectsTable()

export default async function createSpecification(issueId, equipmentsIds) {
	let tariffQuantity = {}

	// Подсчет количества каждого тарифа
	let equipTariffId
	for (let equipId of equipmentsIds) {
		equipTariffId = (await _objectsTableDB.findObjectById(equipId)).tariff_id

		if (Object.keys(tariffQuantity).includes(String(equipTariffId))) {
			tariffQuantity[equipTariffId]++
		} else {
			equipTariffId != null && (tariffQuantity[equipTariffId] = 1)
		}
	}

	// Занесение тарифов в спецификацию
	for (let tariffId of Object.keys(tariffQuantity)) {
		await addSpecificationAPI(issueId, tariffId, tariffQuantity[tariffId])
		await new Promise(resolve => setTimeout(resolve, 200))
	}
}
