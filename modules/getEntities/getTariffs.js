import getTariffsListAPI from '../../API/getTariffsListAPI.js'
import tariffsTable from '../../DB/tariffsTable.js'

const _tariffsTableDB = new tariffsTable()

export default async function getTariffs() {
	let startId = 0
	let tariffs

	await _tariffsTableDB.deactivateTariffs() // Деактивация тарифов

	while (tariffs != '') {
		tariffs = await getTariffsListAPI(startId)
		if (tariffs == '') {
			break
		}
		for (let tariff of tariffs) {
			let id = tariff.id
			let name = tariff.name
			let price = tariff.price
			let vendorCode = tariff.vendor_code
			startId = id + 1

			if (await _tariffsTableDB.findTariffByID(id)) {
				await _tariffsTableDB.changeTariff(id, name, price, vendorCode, true)
			} else {
				await _tariffsTableDB.addTariff(id, name, price, vendorCode, true)
			}
		}

		await new Promise(resolve => setTimeout(resolve, 200))
	}
}
