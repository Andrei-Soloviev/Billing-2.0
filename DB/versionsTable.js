import 'dotenv/config'
import { Pool } from 'pg'

export default class versionsTable {
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

	async createTableVersionsIfNotExists() {
		const query = `CREATE TABLE IF NOT EXISTS Versions (
			version_id SERIAL PRIMARY KEY,
			servicer_company_id INT NOT NULL,
			issue_id INT,
			calculation_period VARCHAR(50),
			is_cancelled BOOLEAN DEFAULT FALSE,
			FOREIGN KEY (servicer_company_id) REFERENCES Servicers(company_id)
		);`
		try {
			await this.pool.query(query)
			console.log(`Создание таблицы Версии отработано`)
		} catch (err) {
			console.error(`Ошибка при создании таблицы Версии: ${err}`)
		}
	}
	async addVersion(servicerId, issueID, calculationPeriod, isCancelled) {
		let query = `INSERT INTO versions(
			servicer_company_id, issue_id, calculation_period, is_cancelled)
			VALUES ($1, $2, $3, $4);`
		try {
			let queryResult = await this.pool.query(query, [
				servicerId,
				issueID,
				calculationPeriod,
				isCancelled,
			])
			console.log(`В БД успешно вставлена Версия`)
			return queryResult
		} catch (err) {
			console.error(`Ошибка вставки в Версии: ${err}`)
		}
	}

	async findVersionById(id) {
		let query = `SELECT version_id, servicer_company_id, issue_id, calculation_period, is_cancelled
			FROM versions
			WHERE version_id=$1;`
		try {
			let queryRes = await this.pool.query(query, [id])
			return queryRes.rows[0] || null
		} catch (err) {
			console.error(`Ошибка нахождения Версии по id: ${err}`)
		}
	}

	async findVersionByIssueId(id) {
		let query = `SELECT version_id, servicer_company_id, issue_id, calculation_period, is_cancelled
			FROM versions
			WHERE issue_id=$1;`
		try {
			let queryRes = await this.pool.query(query, [id])
			return queryRes.rows[queryRes.rows.length - 1] || null
		} catch (err) {
			console.error(`Ошибка нахождения Версии по id: ${err}`)
		}
	}

	async cancelVersion(id) {
		let query = `UPDATE Versions SET is_cancelled = true
			WHERE version_id=$1;`
		try {
			await this.pool.query(query, [id])
			console.log(`Версия с id "${id}" отменена в БД`)
		} catch (err) {
			console.error(`Ошибка отмены Версии по id: ${err}`)
		}
	}
	async truncateVersions() {
		let query = `TRUNCATE TABLE versions CASCADE`
		try {
			await this.pool.query(query)
			console.log('Таблица Версий очищена')
		} catch (err) {
			console.error(`Ошибка очистки таблицы Версий: ${err}`)
		}
	}
}
