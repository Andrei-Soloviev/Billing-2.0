import 'dotenv/config'
import { Pool } from 'pg'

export default class tariffsTable {
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

	async createTableTariffsIfNotExist() {
		const query = `CREATE TABLE IF NOT EXISTS tariffs (
		tariff_id SERIAL PRIMARY KEY,
		tariff_name VARCHAR(255) NOT NULL,
		tariff_price DECIMAL(10,2) NOT NULL,
		tariff_vendor_code VARCHAR(20)
	)`
		try {
			await this.pool.query(query)
			console.log(`Создание таблицы Тарифы отработано`)
		} catch (err) {
			console.error(`Ошибка при создании таблицы Тарифы: ${err}`)
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
			console.log(`В БД успешно вставлен Тариф "${name}"`)
		} catch (err) {
			console.error(`Ошибка вставки в Тарифы: ${err}`)
		}
	}

	async findTariffByID(id) {
		let query = `SELECT tariff_id, tariff_name, tariff_price, tariff_vendor_code
			FROM tariffs
			WHERE tariff_id=$1;`
		try {
			let queryRes = await this.pool.query(query, [id])
			return queryRes.rows[0] || null
		} catch (err) {
			console.log(`Ошибка нахождения Тарифа по id: ${err}`)
		}
	}

	async findTariffByVendorCode(vendorCode) {
		let query = `SELECT tariff_id, tariff_name, tariff_price, tariff_vendor_code
			FROM tariffs
			WHERE tariff_vendor_code=$1;`
		try {
			let queryRes = await this.pool.query(query, [vendorCode])
			return queryRes.rows[0] || null
		} catch (err) {
			console.log(`Ошибка нахождения Тарифа по артикулу: ${err}`)
		}
	}
	async truncateTariffs() {
		let query = `TRUNCATE TABLE tariffs`
		try {
			await this.pool.query(query)
			console.log('Таблица Тарифы очищена')
		} catch (err) {
			console.error(`Ошибка очистки таблицы Тарифы: ${err}`)
		}
	}
}
