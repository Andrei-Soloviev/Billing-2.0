import 'dotenv/config'
import { Pool } from 'pg'

export default class objectsTable {
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

	async createTableObjectsIfNotExist() {
		const query = `CREATE TABLE IF NOT EXISTS Objects (
    object_id SERIAL PRIMARY KEY,
    company_id INT NOT NULL,
    tariff_id INT,
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

	async getObjects() {
		const query = `SELECT *
			FROM objects;`
		try {
			let queryRes = await this.pool.query(query)
			return queryRes.rows
		} catch (err) {
			console.error(`Ошибка получения Объектов: ${err}`)
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
			console.error(`Ошибка нахождения Объекта по id: ${err}`)
		}
	}

	async findActiveObjectsByCompanyId(id) {
		let query = `SELECT object_id, company_id, tariff_id, name, number_vehicle, owner_sim, number_sim, avtograf, is_active
			FROM objects
			WHERE company_id=$1 and is_active=true;`
		try {
			let queryRes = await this.pool.query(query, [id])
			return queryRes.rows || null
		} catch (err) {
			console.error(`Ошибка нахождения Объекта по id: ${err}`)
		}
	}

	async changeObject(
		id,
		companyId,
		tariffId,
		name,
		numberVechicle,
		ownerSim,
		numberSim,
		avtograf,
		isActive
	) {
		let query = `
			UPDATE Objects 
			SET company_id = $2,
				tariff_id = $3,
				name = $4,
				number_vehicle = $5,
				owner_sim = $6,
				number_sim = $7,
				avtograf = $8,
				is_active = $9
			WHERE object_id=$1;`
		try {
			await this.pool.query(query, [
				id,
				companyId,
				tariffId,
				name,
				numberVechicle,
				ownerSim,
				numberSim,
				avtograf,
				isActive,
			])
			console.log(`Объект с id "${id}" изменен в БД`)
		} catch (err) {
			console.error(`Ошибка изменения Объекта по id: ${err}`)
		}
	}

	async deactivateObjects() {
		let query = `UPDATE Objects SET is_active = false`
		try {
			await this.pool.query(query)
			console.log('Объекты деактивированы в БД')
		} catch (err) {
			console.error(`Ошибка деактивации Объектов в БД: ${err}`)
		}
	}
}
