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
	async truncateTariffs() {
		let query = `TRUNCATE TABLE tariffs`
		try {
			await this.pool.query(query)
			console.log('Таблица Тарифы очищена')
		} catch (err) {
			console.error(`Ошибка очистки таблицы Тарифы: ${err}`)
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

	async createTableClients() {
		const query = `CREATE TABLE Clients (
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
			console.log(`Ошибка нахождения Клиента по id: ${err}`)
		}
	}

	async createTableObjects() {
		const query = `CREATE TABLE Objects (
    object_id SERIAL PRIMARY KEY,
    company_id INT NOT NULL,
    tariff_id INT NOT NULL,
    name VARCHAR(255),
    number_vehicle VARCHAR(50),
    owner_sim VARCHAR(255),
    number_sim VARCHAR(50),
    avtograf VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (company_id) REFERENCES Clients(company_id),
    FOREIGN KEY (tariff_id) REFERENCES Tariffs(tariff_id)
);`
		try {
			await this.pool.query(query)
			console.log(`Создание таблицы Объекты отработано`)
		} catch (err) {
			console.error(`Ошибка при создании таблицы Объекты: ${err}`)
		}
	}
	async addObject(
		id,
		companyId,
		tariffId,
		name,
		numberVehicle,
		ownerSim,
		numberSim,
		avtograf,
		is_active
	) {
		let query = `INSERT INTO objects(
			object_id, company_id, tariff_id, name, number_vehicle, owner_sim, number_sim, avtograf, is_active)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`
		try {
			await this.pool.query(query, [
				id,
				companyId,
				tariffId,
				name,
				numberVehicle,
				ownerSim,
				numberSim,
				avtograf,
				is_active,
			])
			console.log(`В БД успешно вставлен Объект "${name}"`)
			await this.getTariffs()
		} catch (err) {
			console.error(`Ошибка вставки в Объекты: ${err}`)
		}
	}

	async findObjectById(id) {
		let query = `SELECT object_id, company_id, tariff_id, name, number_vehicle, owner_sim, number_sim, avtograf, is_active
			FROM objects
			WHERE object_id=$1;`
		try {
			let queryRes = await this.pool.query(query, [id])
			return queryRes.rows[0] || null
		} catch (err) {
			console.log(`Ошибка нахождения Объекта по id: ${err}`)
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
