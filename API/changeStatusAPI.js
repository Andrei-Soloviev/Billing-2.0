import { _account, _token } from '../settings/setSettings.js'

export default async function changeStatusAPI(issueId, statusCode) {
	let result

	let request = await fetch(
		`https://${_account}.okdesk.ru/api/v1/issues/${issueId}/statuses?api_token=${_token}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify({
				code: statusCode,
			}),
		}
	)
	result = await request.json()

	if (!request.ok) {
		throw new Error(
			`Ошибка запроса к АПИ для смены статуса Заявки: ${request.status} ${
				request.statusText
			}: ${JSON.stringify(result.errors)}`
		)
	}
	console.log(`Изменен статус Заявки ${issueId}`)
	return result.id
}
