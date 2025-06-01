import express from 'express'
import versionsTable from '../DB/versionsTable.js'

const _versionsTableDB = new versionsTable()

export const routers = express.Router()

routers.get('/versionsList', async (req, res) => {
	let allVersions = await _versionsTableDB.getAllVersions()
	console.log(allVersions)
	res.send(allVersions)
	res.status(200)
})

routers.get('/activeVersionsList', async (req, res) => {
	let allActiveVersions = await _versionsTableDB.getActiveVersions()
	res.send(allActiveVersions)
	res.status(200)
})

routers.get(`/version/:id`, async (req, res) => {
	const { id } = req.params
	let version = await _versionsTableDB.findVersionById(id)
	res.send(version)
	res.status(200)
})
