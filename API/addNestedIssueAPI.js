import { _account, _token } from '../settings/setSettings.js'
export default async function addNestedIssueAPI(
	parentId,
	clientId,
	clientName,
	equipmentsIds
) {
	let result

	let request = await fetch(
		`https://${_account}.okdesk.ru/api/v1/issues?api_token=${_token}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify({
				title: `Расчет АО для "${clientName}"`,
				company_id: clientId,
				equipment_ids: equipmentsIds,
				parent_id: parentId,
			}),
		}
	)
	result = await request.json()

	if (!request.ok) {
		throw new Error(
			`Ошибка запроса к АПИ для создания Заявки: ${request.status} ${
				request.statusText
			}: ${JSON.stringify(result.errors)}`
		)
	}
	console.log(`Создана Заявка для ${clientName}: ${result.id}`)
	return result.id
}
