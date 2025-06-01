export default async function getCalculationPeriod(invoiceDate) {
	let monthRatio = {
		'01': 'январь',
		'02': 'февраль',
		'03': 'март',
		'04': 'апрель',
		'05': 'май',
		'06': 'июнь',
		'07': 'июль',
		'08': 'август',
		'09': 'сентябрь',
		10: 'октябрь',
		11: 'ноябрь',
		12: 'декабрь',
	}

	let curMonthNumber = String(invoiceDate).split('-')[1]

	return monthRatio[curMonthNumber]
}
