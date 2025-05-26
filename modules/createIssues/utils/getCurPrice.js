import tariffsTable from '../../../DB/tariffsTable.js'

const _tariffsTableDB = new tariffsTable()
export default async function getCurPrice(curTariffId) {
	return (await _tariffsTableDB.findTariffByID(curTariffId)).tariff_price
}
