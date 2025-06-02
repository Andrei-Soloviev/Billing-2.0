import tariffsTable from '../../../DB/tariffsTable.js'

const _tariffsTableDB = new tariffsTable()
export default async function getCurPrice(curTariffId) {
	let tariffById = await _tariffsTableDB.findTariffByID(curTariffId)
	return tariffById ? tariffById.tariff_price : null
}
