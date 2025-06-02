import { _account, _token } from '../settings/setSettings.js'
export default async function changeIssueParamsAPI(issueId, params) {
	let result

	let request = await fetch(
		`https://${_account}.okdesk.ru/api/v1/issues/${issueId}/parameters?api_token=${_token}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify({
				custom_parameters: params,
			}),
		}
	)

	if (!request.ok) {
		throw new Error(
			`Ошибка запроса к АПИ для редактирования Атрибутов: ${request.status} ${
				request.statusText
			}: ${JSON.stringify(result)}`
		)
	}
	console.log(
		`Отредактированы атрибуты ${JSON.stringify(params)} в Заявке ${issueId}`
	)
}
