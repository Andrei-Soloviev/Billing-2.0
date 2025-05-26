import objectsTable from '../../../DB/objectsTable.js'
const _objectsTableDB = new objectsTable()

export default async function checkIsObjectInDB(companyId) {
	let result = (await _objectsTableDB.findObjectById(companyId)) ? true : false
	return result
}
