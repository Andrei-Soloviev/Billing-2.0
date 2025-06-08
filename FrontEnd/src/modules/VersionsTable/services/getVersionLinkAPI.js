import settings from '../../../settings/setting.json'
import checkProxyForUrl from '../../../utils/checkProxyForUrl'

export default async function getVersionLinkAPI(id, setIssueLink) {
	try {
		let stringId = String(id)
		let baseUrl = checkProxyForUrl(
			settings.proxyGetVersionLinkUrl,
			settings.getVersionLinkUrl
		)
		let url = `${baseUrl}${stringId}`

		let req = await fetch(url)

		let result
		if (req.ok) {
			result = await req.json()
		} else {
			throw new Error(`HTTP error! status: ${req.status}`)
		}

		setIssueLink(result)
	} catch (err) {
		console.error('Ошибка получения ссылки на заявку:', err)
	}
}
