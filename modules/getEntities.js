import db from '../DB/DB.js'
import { _account, _priceListId, _token } from '../settings/setSettings.js'

const DB = new db()
export async function getTariffs() {
	let startId = 0
	let result

	DB.truncateTariffs()

	while (result != '' && result != 'Ошибка') {
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
			startId = id + 1
			await DB.addTariff(id, name, price, vendorCode)
		} else {
			result = 'Ошибка'
			return `${request.statusText} ${request.text}`
		}
		await new Promise(resolve => setTimeout(resolve, 200))
	}
}

export async function getClientsAndEquipments() {
	let billingEquipmentsArr = []
	let startId = 0
	let result

	while (result != [] && result != 'Ошибка') {
		let request = await fetch(
			`https://${_account}.okdesk.ru/api/v1/equipments/list?api_token=${_token}&page[size]=1&page[from_id]=${startId}&page[direction]=forward`
		)
		if (request.ok) {
			let result = await request.json()
			if (result == '') {
				break
			}
			let id = result[0].id
			let companyId = result[0].company

			startId = id + 1
			/* billingEquipmentsArr.push({ id, companyId, price, vendorCode }) */
		} else {
			result = 'Ошибка'
			return `${request.statusText} ${request.text}`
		}
		await new Promise(resolve => setTimeout(resolve, 200))
	}
	return billingEquipmentsArr
}
