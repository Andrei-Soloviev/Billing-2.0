import tariffsTable from '../../../DB/tariffsTable.js'
import {
	_equipmentAvtografCode,
	_equipmentNumberSimCode,
	_equipmentOwnerSimCode,
	_equipmentTariffCode,
} from '../../../settings/setSettings.js'

const _tariffsTableDB = new tariffsTable()

export default async function parseEquipmentData(data) {
	let result = {}
	let tariff
	let ownerSim
	let numberSim
	let avtograf

	let type = data.equipment_kind.name
	let manufacturer = data.equipment_manufacturer
		? ' ' + data.equipment_manufacturer.name
		: ''
	let model = data.equipment_model ? ' ' + data.equipment_model.name : ''
	let number = data.inventory_number

	for (let parameter of data.parameters) {
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

	let tariffVendorCode = tariff.split(' ')[0].replace(':', '') || null
	let tariffByVendorCode = await _tariffsTableDB.findTariffByVendorCode(
		tariffVendorCode
	)

	result.name = type + manufacturer + model + ' ' + number
	result.number = number
	result.ownerSim = ownerSim
	result.numberSim = numberSim
	result.avtograf = avtograf
	result.tariffId = tariffByVendorCode ? tariffByVendorCode.tariff_id : null

	return result
}
