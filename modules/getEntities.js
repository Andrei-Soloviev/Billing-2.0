import db from '../DB/DB.js'
import {
	_account,
	_equipmentAvtografCode,
	_equipmentBillingCode,
	_equipmentBillingValue,
	_equipmentNumberSimCode,
	_equipmentOwnerSimCode,
	_equipmentTariffCode,
	_priceListId,
	_token,
} from '../settings/setSettings.js'

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
			`https://${_account}.okdesk.ru/api/v1/equipments/list?api_token=${_token}&custom_parameters[${_equipmentBillingCode}][]=${_equipmentBillingValue}&page[size]=100&page[from_id]=${startId}&page[direction]=forward`
		)
		if (request.ok) {
			let result = await request.json()
			if (result == '') {
				break
			}
			for (let elem of result) {
				let id = elem.id
				let companyId
				try {
					companyId = elem.company.id
				} catch (e) {
					startId = id + 1
					continue
				}
				let type = elem.equipment_kind.name
				let manufacturer = elem.equipment_manufacturer
					? elem.equipment_manufacturer.name
					: ''
				let model = elem.equipment_model ? elem.equipment_model.name : ''
				let number = elem.inventory_number

				let tariff
				let ownerSim
				let numberSim
				let avtograf
				for (let parameter of elem.parameters) {
					if (parameter.code == _equipmentTariffCode) {
						tariff = parameter.value
					} else if (parameter.code == _equipmentOwnerSimCode) {
						ownerSim = parameter.value
					} else if (parameter.code == _equipmentNumberSimCode) {
						numberSim = parameter.value
					} else if (parameter.code == _equipmentAvtografCode) {
						avtograf = parameter.value
					}
				}
				console.log({
					id: id,
					companyId: companyId,
					tariff: tariff,
					name: type + ' ' + manufacturer + ' ' + model,
					number: number,
					ownerSim: ownerSim,
					numberSim: numberSim,
					avtograf: avtograf,
				})
				startId = id + 1
			}
		} else {
			result = 'Ошибка'
			return `${request.statusText} ${request.text}`
		}
		await new Promise(resolve => setTimeout(resolve, 200))
	}
}
