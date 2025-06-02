import 'dotenv/config'
import { Pool } from 'pg'

export default class billingTable {
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

	async createTableBillingIfNotExist() {
		const query = `CREATE TABLE IF NOT EXISTS Billing (
    billing_id SERIAL PRIMARY KEY,
    version_id INT NOT NULL,
    object_id INT NOT NULL,
    issue_id INT,
    price_payment_time DECIMAL(10, 2),
    FOREIGN KEY (version_id) REFERENCES Versions(version_id),
    FOREIGN KEY (object_id) REFERENCES Objects(object_id)
);`
		try {
			await this.pool.query(query)
			console.log(`Создание таблицы Биллинг отработано`)
		} catch (err) {
			console.error(`Ошибка при создании таблицы Биллинг: ${err}`)
		}
	}

	async addBilling(versionId, objectId, issueId, curPrice) {
		let query = `INSERT INTO billing(
			version_id, object_id, issue_id, price_payment_time)
			VALUES ($1, $2, $3, $4);`
		try {
			await this.pool.query(query, [versionId, objectId, issueId, curPrice])
			console.log(`В БД успешно вставлен Счет "${issueId}"`)
		} catch (err) {
			console.error(`Ошибка вставки в Биллинг: ${err}`)
		}
	}

	async findBillingByID(id) {
		let query = `SELECT billing_id, version_id, object_id, issue_id, price_payment_time 
			FROM billing
			WHERE billing_id=$1;`
		try {
			let queryRes = await this.pool.query(query, [id])
			return queryRes.rows[0] || null
		} catch (err) {
			console.error(`Ошибка нахождения Биллинга по id: ${err}`)
		}
	}

	async findBillingByVersionId(id) {
		let query = `SELECT billing_id, version_id, object_id, issue_id, price_payment_time 
			FROM billing
			WHERE version_id=$1;`
		try {
			let queryRes = await this.pool.query(query, [id])
			return queryRes.rows || null
		} catch (err) {
			console.error(`Ошибка нахождения Биллинга по version_id: ${err}`)
		}
	}

	async findBillingByObjectIdAndVersionId(object_id, version_id) {
		let query = `SELECT billing_id, version_id, object_id, issue_id, price_payment_time 
			FROM billing
			WHERE object_id=$1 and version_id=$2;`
		try {
			let queryRes = await this.pool.query(query, [object_id, version_id])
			return queryRes.rows || null
		} catch (err) {
			console.error(
				`Ошибка нахождения Биллинга по object_id и version_id: ${err}`
			)
		}
	}

	async truncateBillings() {
		let query = `TRUNCATE TABLE billings`
		try {
			await this.pool.query(query)
			console.log('Таблица Биллинг очищена')
		} catch (err) {
			console.error(`Ошибка очистки таблицы Биллинг: ${err}`)
		}
	}
}
