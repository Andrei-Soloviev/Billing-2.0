import db from '../DB/DB.js'
import {
	_account,
	_companyAgreementCode,
	_equipmentAvtografCode,
	_equipmentBillingCode,
	_equipmentBillingValue,
	_equipmentNumberSimCode,
	_equipmentOwnerSimCode,
	_equipmentTariffCode,
	_priceListId,
	_priceListPosNotFound,
	_token,
} from '../settings/setSettings.js'

const DB = new db()


export async function getClientsAndEquipments() {
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
					let companyData
					let findCompanyRequest = await fetch(
						`https://${_account}.okdesk.ru/api/v1/companies?api_token=${_token}&id=${companyId}`
					)
						.then(async result => (companyData = await result.json()).body)
						.catch(err => console.log(err))
					let companyName = companyData.name
					let companyAgreement = companyData.parameters.filter(
						elem => elem.code == _companyAgreementCode
					)[0].value
					let isClientInDb = (await DB.findClientById(companyId)) ? true : false
					if (!isClientInDb) {
						await DB.addClient(companyId, companyName, companyAgreement, true)
					}
				} catch (e) {
					startId = id + 1
					continue
				}
				let type = elem.equipment_kind.name
				let manufacturer = elem.equipment_manufacturer
					? ' ' + elem.equipment_manufacturer.name
					: ''
				let model = elem.equipment_model ? ' ' + elem.equipment_model.name : ''
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

				let tariffVendorCode =
					tariff.split(' ')[0].replace(':', '') || _priceListPosNotFound
				let tariffId = (await DB.findTariffByVendorCode(tariffVendorCode))
					.tariff_id
				let isObjInDB = (await DB.findObjectById(id)) ? true : false
				if (!isObjInDB) {
					/* await DB.addObject(
						id,
						companyId,
						tariffId,
						type + manufacturer + model,
						number,
						ownerSim,
						numberSim,
						avtograf,
						true
					) */
				}
				/* console.log({
					id: id,
					companyId: companyId,
					tariffId: tariffId,
					name: type + manufacturer + model,
					number: number,
					ownerSim: ownerSim,
					numberSim: numberSim,
					avtograf: avtograf,
				}) */
				startId = id + 1
			}
		} else {
			result = 'Ошибка'
			return `${request.statusText} ${request.text}`
		}
		await new Promise(resolve => setTimeout(resolve, 200))
	}
}
