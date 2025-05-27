import delIssueAPI from '../../API/delIssueAPI.js'
import billingTable from '../../DB/billingTable.js'
import versionsTable from '../../DB/versionsTable.js'

const _versionsTableDB = new versionsTable()
const _billingTableDB = new billingTable()
export default async function deleteIssues(parentIssueId) {
	let versionId = (await _versionsTableDB.findVersionByIssueId(parentIssueId))
		.version_id

	//Отмена версии
	await _versionsTableDB.cancelVersion(versionId)

	//Удаление заявок
	let issuesToDel = new Set(
		(await _billingTableDB.findBillingByVersionId(versionId)).map(
			elem => elem.issue_id
		)
	)
	for (let issueId of issuesToDel) {
		await delIssueAPI(issueId)
		await new Promise(resolve => setTimeout(resolve, 200))
	}

	return issuesToDel
}
