import { _account, _priceListId, _token } from '../settings/setSettings.js'
export default async function getTariffsListAPI(startId) {
	let result
	let request = await fetch(
		`https://${_account}.okdesk.ru/api/v1/nomenclature/price_lists/${_priceListId}/services?api_token=${_token}&page[size]=100&page[from_id]=${startId}&page[direction]=forward`
	)
	result = await request.json()
	if (!request.ok) {
		throw new Error(
			`Ошибка запроса к АПИ для получения Тарифов: ${request.status} ${
				request.statusText
			}: ${JSON.stringify(result.errors)}`
		)
	}

	return result
}
