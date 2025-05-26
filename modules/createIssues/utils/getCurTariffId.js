import objectsTable from '../../../DB/objectsTable.js'

const _objectsTableDB = new objectsTable()

export default async function getCurTariffId(curEquipId) {
	return (await _objectsTableDB.findObjectById(curEquipId)).tariff_id
}
