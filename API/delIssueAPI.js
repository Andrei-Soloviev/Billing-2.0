import { _account, _token } from '../settings/setSettings.js'
export default async function delIssueAPI(issueId) {
	let result

	let request = await fetch(
		`https://${_account}.okdesk.ru/api/v1/issues/${issueId}?api_token=${_token}`,
		{
			method: 'DELETE',
			/* headers: {
				'Content-Type': 'application/json;charset=utf-8',
			}, */
		}
	)
	result = await request.json()

	if (!request.ok) {
		throw new Error(
			`Ошибка запроса к АПИ для удаления заявки: ${request.status} ${
				request.statusText
			}: ${JSON.stringify(result.errors)}`
		)
	}
	console.log(`Удалена заявка: ${result.issue.id}`)
	return result.issue.id
}
