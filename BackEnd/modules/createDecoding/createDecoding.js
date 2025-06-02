import * as ejs from 'ejs'
import * as fs from 'fs'
import wkhtmltopdf from 'wkhtmltopdf'
wkhtmltopdf.command = '/usr/bin/wkhtmltopdf' // Стандартный путь в Linux

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
		}
	)

	// Конвертация Html в PDF
	/* const phantomPath =
			'/var/www/api-billing-002/node_modules/phantomjs-prebuilt/bin/'

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
			// Явно указываем путь к Linux-версии PhantomJS
			phantomPath: phantomPath,
			phantomArgs: [
				'--local-url-access=false',
				'--ignore-ssl-errors=true',
				'--disk-cache=true',
			],
		}
		pdf
			.create(html, options)
			.toFile(
				`./modules/createDecoding/Расшифровки/Расшифровка для ${companyName}.pdf`,
				(err, res) => {
					if (err) {
						reject(console.error('Error creating PDF:', err))
					}
					if (!res || !res.filename) {
						return reject(
							new Error('PDF creation failed: no filename returned')
						)
					}
					console.log('PDF created:', res.filename)
					// Возврат пути
					resolve(res.filename)
				}
			)
	}) */
	const html = fs.readFileSync(
		'./modules/createDecoding/Расшифровки/curDecoding.html',
		'utf8'
	)
	const pdfPath = `./modules/createDecoding/Расшифровки/Расшифровка для ${companyName}.pdf`
	await new Promise((resolve, reject) => {
		wkhtmltopdf(html, {
			pageSize: 'A4',
			orientation: 'Portrait',
			marginTop: '20mm',
			marginBottom: '20mm',
			marginLeft: '10mm',
			marginRight: '10mm',
			encoding: 'UTF-8', // Явно указываем кодировку
			headerHtml: '<div style="height: 20mm;"></div>',
			footerHtml: '<div style="height: 20mm;"></div>',
		})
			.pipe(fs.createWriteStream(pdfPath))
			.on('finish', () => {
				console.log('PDF successfully created at:', pdfPath)
				resolve(pdfPath)
			})
			.on('error', err => {
				console.error('Error creating PDF:', err)
				reject(err)
			})
	})

	// Добавления файла к заявке
	await addFileToIssueAPI(
		issueId,
		`Расшифровка для ${companyName}`,
		pdfPath,
		true
	)
}
