import 'dotenv/config'
import { Pool } from 'pg'

export default class servicersTable {
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

	async createTableServicersIfNotExists() {
		const query = `CREATE TABLE IF NOT EXISTS Servicers (
    	company_id INT PRIMARY KEY,
    	company_name VARCHAR(255) NOT NULL,
		);`
		try {
			await this.pool.query(query)
			console.log(`Создание таблицы Обс.организации отработано`)
		} catch (err) {
			console.error(`Ошибка при создании таблицы Обс.организации: ${err}`)
		}
	}
	async addServicer(id, name) {
		let query = `INSERT INTO servicers(
			company_id, company_name)
			VALUES ($1, $2);`
		try {
			await this.pool.query(query, [id, name])
			console.log(`В БД успешно вставлен Обс.организация "${name}"`)
		} catch (err) {
			console.error(`Ошибка вставки в Обс.организации: ${err}`)
		}
	}

	async findServicerById(id) {
		let query = `SELECT company_id, company_name
			FROM servicers
			WHERE company_id=$1;`
		try {
			let queryRes = await this.pool.query(query, [id])
			return queryRes.rows[0] || null
		} catch (err) {
			console.log(`Ошибка нахождения Обс.организации по id: ${err}`)
		}
	}

	async truncateServicers() {
		let query = `TRUNCATE TABLE servicers CASCADE`
		try {
			await this.pool.query(query)
			console.log('Таблица Обс.организации очищена')
		} catch (err) {
			console.error(`Ошибка очистки таблицы Обс.организации: ${err}`)
		}
	}
}
