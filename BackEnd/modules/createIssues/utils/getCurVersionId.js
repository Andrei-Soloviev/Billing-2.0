import versionsTable from '../../../DB/versionsTable.js'

const _versionsTableDB = new versionsTable()

export default async function getCurVersionId(parentIssueId) {
	return (await _versionsTableDB.findVersionByIssueId(parentIssueId)).version_id
}
