import objectsTable from '../../../DB/objectsTable.js'

const _objectsTableDB = new objectsTable()

export default async function getCurEquipment(curClientId) {
	return (await _objectsTableDB.findActiveObjectsByCompanyId(curClientId)).map(
		equip => equip.object_id
	)
}
