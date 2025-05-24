import 'dotenv/config'
import { Pool } from 'pg'

export default class DB {
	constructor() {
		this.user = process.env.user
		this.host = process.env.host
		this.database = process.env.database
		this.password = process.env.password
		this.port = process.env.portDB

		this.pool = new Pool({
			user: this.user, // 🔹 Замените на своего пользователя
			host: this.host, // 🔹 Или IP-адрес сервера БД
			database: this.database, // 🔹 Название БД
			password: this.password, // 🔹 Пароль
			port: this.port, // 🔹 Порт PostgreSQL (по умолчанию 5432)
		})
	}

	async checkDB() {
		const query = `SELECT NOW();`
		try {
			await this.pool.query(query)
			console.log(`БД подключена`)
		} catch (err) {
			console.error(`Ошибка подключения к БД: ${err}`)
		}
	}

	async createTableTariffs() {
		const query = `CREATE TABLE IF NOT EXISTS tariffs (
		tariff_id SERIAL PRIMARY KEY,
		tariff_name VARCHAR(255) NOT NULL,
		tariff_price DECIMAL(10,2) NOT NULL,
		tariff_vendor_code VARCHAR(20)
	)`
		try {
			await this.pool.query(query)
			console.log(`Создание таблицы отработано`)
		} catch (err) {
			console.error(`Ошибка: ${err}`)
		}
	}

	async getTariffs() {
		const query = `SELECT *
			FROM tariffs;`
		try {
			let queryRes = await this.pool.query(query)
			return queryRes.rows
		} catch (err) {
			console.error(`Ошибка получения таблицы Тарифы: ${err}`)
		}
	}

	async addTariff(id, name, price, vendorCode) {
		let query = `INSERT INTO tariffs(
			tariff_id, tariff_name, tariff_price, tariff_vendor_code)
			VALUES ($1, $2, $3, $4);`
		try {
			await this.pool.query(query, [id, name, price, vendorCode])
			console.log('Успешно вставлено в Тарифы')
			await this.getData()
		} catch (err) {
			console.error(`Ошибка вставки в Тарифы: ${err}`)
		}
	}

	async getData() {
		const query = `SELECT id, completed_at
	FROM issues;`
		try {
			let queryRes = await this.pool.query(query)
			console.log(queryRes.rows)
			return queryRes.rows
		} catch (err) {
			console.error(`Ошибка: ${err}`)
		}
	}
}
