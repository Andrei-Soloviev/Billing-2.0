import clientsTable from '../../../DB/clientsTable.js'
const _clientsTableDB = new clientsTable()

export default async function checkIsClientInDB(companyId) {
	let result = (await _clientsTableDB.findClientById(companyId)) ? true : false
	return result
}
