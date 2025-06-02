import fs from 'fs'
import path from 'path'
import { _account, _commentAuthorId, _token } from '../settings/setSettings.js'

export default async function addFileToIssueAPI(
	issueId,
	commentText,
	filePath,
	isPublic
) {
	let result

	// 1. Читаем файл
	const fileBuffer = fs.readFileSync(filePath)
	// 2. Создаем Blob (данные в бинарном формате)
	const fileBlob = new Blob([fileBuffer], { type: 'application/pdf' })

	let formData = new FormData()
	formData.append('comment[content]', commentText)
	formData.append('comment[public]', isPublic)
	formData.append('comment[author_id]', _commentAuthorId)
	// Добавление файла в formatData
	formData.append(
		'comment[attachments][0][attachment]',
		fileBlob,
		path.basename(filePath)
	)

	let request = await fetch(
		`https://${_account}.okdesk.ru/api/v1/issues/${issueId}/comments?api_token=${_token}`,
		{
			method: 'POST',
			body: formData,
		}
	)
	result = await request.json()

	if (!request.ok) {
		throw new Error(
			`Ошибка запроса к АПИ для добавления Файла к Заявке: ${request.status} ${
				request.statusText
			}: ${JSON.stringify(result.errors)}`
		)
	}
	console.log(`Добавлен Файл к Заявке ${issueId}`)
	return result.id
}
