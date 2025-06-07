import 'dotenv/config'
import fs from 'fs'
import https from 'https'
import querystring from 'querystring'

const DB_HOST = process.env.ch_db_host
const DB_NAME = process.env.ch_db_name
const DB_USER = process.env.ch_db_user
const DB_PASS = process.env.ch_db_pass
const DB_PORT = process.env.ch_db_port
const CACERT = process.env.ch_ssl_path

export async function insertServicer(servicerData) {
	const query = `
			INSERT INTO servicers (
					company_id,
					company_name
			) VALUES (
					${servicerData.company_id},
					'${servicerData.company_name}'
			)
	`
	const options = {
		method: 'POST',
		ca: CACERT ? fs.readFileSync(CACERT) : undefined,
		path:
			'/?' +
			querystring.stringify({
				database: DB_NAME,
				query: query,
			}),
		port: DB_PORT,
		hostname: DB_HOST,
		headers: {
			'X-ClickHouse-User': DB_USER,
			'X-ClickHouse-Key': DB_PASS,
			'Accept-Encoding': 'gzip',
		},
	}

	return new Promise((resolve, reject) => {
		let data = ''
		const req = https.request(options, res => {
			res.setEncoding('utf8')
			res.on('data', chunk => {
				data += chunk
			})

			res.on('end', () => {
				try {
					console.log('Servicer inserted successfully:', data)
					resolve(data)
				} catch (error) {
					console.error('Error servicer parsing response:', error)
					reject(error)
				}
			})
		})
		req.on('error', error => {
			console.error(`Request error: ${error.message}`)
			reject(error)
		})
		req.end()
	})
}

export async function truncateServicersCascade() {
	const query = `TRUNCATE TABLE servicers`
	// Примечание: ClickHouse не поддерживает CASCADE в TRUNCATE,
	// но если нужно очистить связанные таблицы, можно добавить дополнительные запросы
	const options = {
		method: 'POST',
		ca: CACERT ? fs.readFileSync(CACERT) : undefined,
		path:
			'/?' +
			querystring.stringify({
				database: DB_NAME,
				query: query,
			}),
		port: DB_PORT,
		hostname: DB_HOST,
		headers: {
			'X-ClickHouse-User': DB_USER,
			'X-ClickHouse-Key': DB_PASS,
			'Accept-Encoding': 'gzip',
		},
	}
	return new Promise((resolve, reject) => {
		let data = ''
		const req = https.request(options, res => {
			res.setEncoding('utf8')
			res.on('data', chunk => {
				data += chunk
			})
			res.on('end', () => {
				try {
					console.log('Table truncated successfully:', data)
					resolve(data)
				} catch (error) {
					console.error('Error parsing response:', error)
					reject(error)
				}
			})
		})
		req.on('error', error => {
			console.error(`Request error: ${error.message}`)
			reject(error)
		})
		req.end()
	})
}
