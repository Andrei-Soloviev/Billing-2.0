import { _account, _priceListId, _token } from '../settings/setSettings.js'

export async function getTariffs() {
	let allTariffsArr = []
	let startId = 0
	let result

	while (result != [] && result != 'Ошибка') {
		let request = await fetch(
			`https://${_account}.okdesk.ru/api/v1/nomenclature/price_lists/${_priceListId}/services?api_token=${_token}&page[size]=1&page[from_id]=${startId}&page[direction]=forward`
		)
		if (request.ok) {
			let result = await request.json()
			if (result == '') {
				break
			}
			let id = result[0].id
			let name = result[0].name
			let price = result[0].price
			let vendorCode = result[0].vendor_code
			let equipmentName = result[0].equipment_name_format
			startId = id + 1
			allTariffsArr.push({ id, name, equipmentName, price, vendorCode })
		} else {
			result = 'Ошибка'
			return `${request.statusText} ${request.text}`
		}
	}

	return allTariffsArr
}

export async function getClientsAndEquipments() {}
