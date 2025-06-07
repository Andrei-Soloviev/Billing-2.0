export default function standartVersionData(data) {
	try {
		let numberPos = 1
		return data.map(elem => {
			const processedItem = {}

			Object.keys(elem).forEach(key => {
				if (key === 'billing_id') {
					processedItem[key] = numberPos
					numberPos++
				} else {
					processedItem[key] = elem[key]
				}
			})
			return processedItem
		})
	} catch (e) {
		console.log(e)
		return 'Error'
	}
}
