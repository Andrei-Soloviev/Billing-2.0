import { _account, _token } from '../settings/setSettings.js'
export default async function addSpecificationAPI(
	issueId,
	serviceId,
	quantity
) {
	let result

	let request = await fetch(
		`https://${_account}.okdesk.ru/api/v1/issues/${issueId}/services?api_token=${_token}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify({
				issue_service: {
					service_id: Number(serviceId),
					quantity: quantity,
				},
			}),
		}
	)
	result = await request.json()

	if (!request.ok) {
		throw new Error(
			`Ошибка запроса к АПИ для создания Спецификации: ${request.status} ${
				request.statusText
			}: ${JSON.stringify(result.errors)}`
		)
	}
	console.log(`Создана Спецификация для ${issueId}`)
	return result.id
}
