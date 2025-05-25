import { _account, _token } from '../../../settings/setSettings.js'
export default async function getCompanyAPI(companyId) {
	let result

	let request = await fetch(
		`https://${_account}.okdesk.ru/api/v1/companies?api_token=${_token}&id=${companyId}`
	)
	result = await request.json()

	if (!request.ok) {
		throw new Error(
			`Ошибка запроса к АПИ для получения Клиента: ${request.status} ${
				request.statusText
			}: ${JSON.stringify(result.errors)}`
		)
	}

	return result
}
