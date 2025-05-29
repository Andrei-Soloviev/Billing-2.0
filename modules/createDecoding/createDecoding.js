import * as ejs from 'ejs'
import * as fs from 'fs'
import * as pdf from 'html-pdf'

import addFileToIssueAPI from '../../API/addFileToIssueAPI.js'
import billingTable from '../../DB/billingTable.js'
import clientsTable from '../../DB/clientsTable.js'
import objectsTable from '../../DB/objectsTable.js'

const _clientsTableDB = new clientsTable()
const _objectsTableDB = new objectsTable()
const _billingTableDB = new billingTable()

export default async function createDecoding(
	issueId,
	companyId,
	objectIds,
	versionId,
	invoiceDate
) {
	let companyName = (await _clientsTableDB.findClientById(companyId))
		.company_name

	let objectsData = [] // Список объектов для создания html
	let sumPrice = 0.0 // Итоговая сумма

	for (let id of objectIds) {
		let objectInfo = await _objectsTableDB.findObjectById(id)

		let price =
			(
				await _billingTableDB.findBillingByObjectIdAndVersionId(
					objectInfo.object_id,
					versionId
				)
			)[0].price_payment_time || 'Тариф не найден'

		// Подсчет итоговой суммы в расшифровке
		if (parseFloat(price)) {
			sumPrice += parseFloat(price)
		}

		// Добавление данных объекта в список
		objectsData.push({
			number_vehicle: objectInfo.number_vehicle,
			name: objectInfo.name,
			owner_sim: objectInfo.owner_sim,
			number_sim: objectInfo.number_sim,
			avtograf: objectInfo.avtograf,
			price: price,
		})
	}

	// Создание HTML-расшифровки
	let decodingFilePath = await new Promise((resolve, reject) => {
		const data = {
			title: `Расшифровка по транспортным средствам для "${companyName}"`,
			objects: objectsData,
			invoiceDate: invoiceDate,
			resultPrice: sumPrice,
		}
		ejs.renderFile(
			'./modules/createDecoding/pattern.ejs',
			{ data },
			(err, html) => {
				if (err) throw err

				// Сохраняем HTML в файл
				fs.writeFileSync(
					`./modules/createDecoding/Расшифровки/curDecoding.html`,
					html
				)
				console.log('HTML сгенерирован!')
			}
		)

		// Конвертация Html в PDF
		const html = fs.readFileSync(
			'./modules/createDecoding/Расшифровки/curDecoding.html',
			'utf8'
		)
		const options = {
			format: 'A4',
			orientation: 'portrait',
			border: '10mm',
			header: {
				height: '20mm',
			},
			footer: {
				height: '20mm',
			},
		}
		pdf
			.create(html, options)
			.toFile(
				`./modules/createDecoding/Расшифровки/Расшифровка для ${companyName}.pdf`,
				(err, res) => {
					if (err) reject(console.error('Error creating PDF:', err))
					console.log('PDF created:', res)
					// Возврат пути
					resolve(res.filename)
				}
			)
	})

	// Добавления файла к заявке
	await addFileToIssueAPI(
		issueId,
		`Расшифровка для ${companyName}`,
		decodingFilePath
	)
}
