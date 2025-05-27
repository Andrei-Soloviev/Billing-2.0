import getTariffsListAPI from '../../API/getTariffsListAPI.js'
import tariffsTable from '../../DB/tariffsTable.js'

const DB = new tariffsTable()

export default async function getTariffs() {
	DB.truncateTariffs() // Очистка таблицы Тарифы в БД

	let startId = 0
	let tariffs

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
			await DB.addTariff(id, name, price, vendorCode)
		}

		await new Promise(resolve => setTimeout(resolve, 200))
	}
}
