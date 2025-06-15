//Приведение данных списка версий к необходимому формату

export function standartVersionsData(versionData) {
	let dataVersionsNew = versionData.map((elem, index) => {
		let str = {}
		Object.keys(elem).map((key, index) => {
			if (key.includes('version_id') || key.includes('issue_id')) {
				str[key] = String(elem[key]) + '_IDMAIN'
			}
			if (key.includes('issue_id')) {
				str[key] = String(elem[key]) + '_NUM'
			} else if (key.includes('is_cancelled')) {
				if (elem[key]) {
					str[key] = 'Да' + '_TEXT'
				} else {
					str[key] = 'Нет' + '_TEXT'
				}
			} else if (key.includes('calculation_period')) {
				str[key] =
					elem[key].replace(elem[key][0], elem[key][0].toUpperCase()) + '_TEXT'
			} else if (key.includes('invoice_date')) {
				/* str[key] = String(elem[key]).split('T') */
				str[key] = new Date(elem[key]).toLocaleString().split(',')[0]
			}
		})
		str.version_open = 'Открыть_BTN'
		return str
	})
	return dataVersionsNew
}
