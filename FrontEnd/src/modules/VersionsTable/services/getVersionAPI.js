import settings from '../../../settings/setting.json'
import checkProxyForUrl from '../../../utils/checkProxyForUrl'

export default async function getVersionAPI(id, setData, setError, setLoading) {
	try {
		let stringId = String(id)
		let baseUrl = checkProxyForUrl(
			settings.proxyGetVersion,
			settings.getVersion
		)
		let url = `${baseUrl}${stringId}`

		let req = await fetch(url)

		let result
		if (req.ok) {
			result = await req.json()
		} else {
			setError(`HTTP error! ${req.status} ${req.statusText}`)
			throw new Error(`HTTP error! status: ${req.status}`)
		}

		if (result == '' || result == undefined) {
			setError('Не удалось получить данные')
		}
		setData(result)
	} catch (err) {
		console.error('Fetch error:', err)
		setError(err.message)
	} finally {
		setLoading(false)
	}
}
