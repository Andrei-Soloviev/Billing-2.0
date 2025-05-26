import servicersTable from '../../../DB/servicersTable.js'
const _servicersTableDB = new servicersTable()

export default async function checkIsServicerInDB(companyId) {
	let result = (await _servicersTableDB.findServicerById(companyId))
		? true
		: false
	return result
}
