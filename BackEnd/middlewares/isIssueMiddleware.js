export default async function isIssueMiddleware(req, res, next) {
	if (!req.body?.issue) {
		console.log(`Отклонен вебхук: ${JSON.stringify(req.body)}`)
		res.status(400)
		res.send('Нет поля issue')
	} else {
		next()
	}
}
