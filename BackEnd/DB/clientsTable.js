import 'dotenv/config'
import { Pool } from 'pg'

export default class clientsTable {
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

	async createTableClientsIfNotExist() {
		const query = `CREATE TABLE IF NOT EXISTS Clients (
			company_id SERIAL PRIMARY KEY,
			company_name VARCHAR(255) NOT NULL,
			agreement TEXT,
			is_active BOOLEAN
		);`
		try {
			await this.pool.query(query)
			console.log(`Создание таблицы Клиенты отработано`)
		} catch (err) {
			console.error(`Ошибка при создании таблицы Клиенты: ${err}`)
		}
	}

	async getActiveClients() {
		const query = `SELECT *
			FROM clients
			WHERE is_active=true;`
		try {
			let queryRes = await this.pool.query(query)
			return queryRes.rows
		} catch (err) {
			console.error(`Ошибка получения активных Клиентов: ${err}`)
		}
	}

	async addClient(id, name, agreement, isActive) {
		let query = `INSERT INTO clients(
			company_id, company_name, agreement, is_active)
			VALUES ($1, $2, $3, $4);`
		try {
			await this.pool.query(query, [id, name, agreement, isActive])
			console.log(`В БД успешно вставлен Клиент "${name}"`)
		} catch (err) {
			console.error(`Ошибка вставки Клиента: ${err}`)
		}
	}

	async findClientById(id) {
		let query = `SELECT company_id, company_name, agreement, is_active
	FROM clients
			WHERE company_id=$1;`
		try {
			let queryRes = await this.pool.query(query, [id])
			return queryRes.rows[0] || null
		} catch (err) {
			console.error(`Ошибка нахождения Клиента по id: ${err}`)
		}
	}

	async activateClient(id, companyName, agreement, isActive) {
		let query = `
			UPDATE Clients 
			SET 
				company_name=$2,
				agreement=$3,
				is_active = $4
			WHERE company_id=$1;`
		try {
			await this.pool.query(query, [id, companyName, agreement, isActive])
			console.log(`Клиент с id "${id}" изменен в БД`)
		} catch (err) {
			console.error(`Ошибка изменения Клиента по id: ${err}`)
		}
	}

	async deactivateClients() {
		let query = `UPDATE Clients SET is_active = false`
		try {
			await this.pool.query(query)
			console.log('Клиенты деактивированы в БД')
		} catch (err) {
			console.error(`Ошибка деактивации Клиентов в БД: ${err}`)
		}
	}

	async truncateClients() {
		let query = `TRUNCATE TABLE clients CASCADE`
		try {
			await this.pool.query(query)
			console.log('Таблица Клиенты очищена')
		} catch (err) {
			console.error(`Ошибка очистки таблицы Клиенты: ${err}`)
		}
	}
}
