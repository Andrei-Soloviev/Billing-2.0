import {
	_account,
	_equipmentBillingCode,
	_equipmentBillingValue,
	_token,
} from '../../../settings/setSettings.js'
export default async function getBillableEquipmentsListAPI(startId) {
	let result
	let request = await fetch(
		`https://${_account}.okdesk.ru/api/v1/equipments/list?api_token=${_token}&custom_parameters[${_equipmentBillingCode}][]=${_equipmentBillingValue}&page[size]=100&page[from_id]=${startId}&page[direction]=forward`
	)
	result = await request.json()
	if (!request.ok) {
		throw new Error(
			`Ошибка запроса к АПИ для получения Биллингуемого Оборудования: ${
				request.status
			} ${request.statusText}: ${JSON.stringify(result.errors)}`
		)
	}

	return result
}
