import express from 'express'
import {
	_commentCancelEndText,
	_commentCancelStartText,
	_commentCreateEndText,
	_parentCancelEndStatus,
	_parentCancelStartStatus,
	_parentCreateEndStatus,
	_parentCreateStartStatus,
	_parentType,
} from './settings/setSettings.js'

import 'dotenv/config'
import addCommentToIssueAPI from './API/addCommentToIssueAPI.js'
import changeStatusAPI from './API/changeStatusAPI.js'
import createIssues from './modules/createIssues/createIssues.js'
import deleteIssues from './modules/deleteIssues/deleteIssues.js'

const app = express()
app.use(express.json())
app.listen(3000, () => console.log('work on Port: 3000'))



app.get('/', (req, res) => {
	res.send('Приложение работает')
	res.status(200)
})
app.post('/', async (req, res) => {
	let issueData = req.body.issue
	let issueId = issueData.id
	let curType = issueData.type.code
	let curStatus = issueData.status.code

	if (curType == _parentType && curStatus == _parentCreateStartStatus) {
		await addCommentToIssueAPI(issueId, _commentCreateStartText)
		await getTariffs()
		await getObjectsAndClients()
		await createIssues(issueData)
		await changeStatusAPI(issueId, _parentCreateEndStatus)
		await addCommentToIssueAPI(issueId, _commentCreateEndText)
	} else if (curType == _parentType && curStatus == _parentCancelStartStatus) {
		await addCommentToIssueAPI(issueId, _commentCancelStartText)
		await deleteIssues(issueId)
		await changeStatusAPI(issueId, _parentCancelEndStatus)
		await addCommentToIssueAPI(issueId, _commentCancelEndText)
	}
	res.send(req.body)
	res.status(200)
})

/* import createIssues from './modules/createIssues/createIssues.js'
console.log(await createIssues(423, 14, '2025-03-31')) */

/* import deleteIssues from './modules/deleteIssues/deleteIssues.js'
console.log(await deleteIssues(423)) */
