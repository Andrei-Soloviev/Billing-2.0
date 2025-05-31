import { _account, _commentAuthorId, _token } from '../settings/setSettings.js'

export default async function addCommentToIssueAPI(issueId, commentText) {
	let result

	let request = await fetch(
		`https://${_account}.okdesk.ru/api/v1/issues/${issueId}/comments?api_token=${_token}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify({
				comment: {
					content: commentText,
					author_id: _commentAuthorId,
					author_type: 'employee',
				},
			}),
		}
	)
	result = await request.json()

	if (!request.ok) {
		throw new Error(
			`Ошибка запроса к АПИ для добавления Комментария к Заявке: ${
				request.status
			} ${request.statusText}: ${JSON.stringify(result.errors)}`
		)
	}
	console.log(`Добавлен Комментарий к Заявке ${issueId}`)
	return result.id
}
