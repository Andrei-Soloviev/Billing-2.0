import settings from '../../../settings/setting.json'
import checkProxyForUrl from '../../../utils/checkProxyForUrl'

export default async function cancelVersionAPI(
	id,
	setError,
	setLoading,
	setShowNotice,
	setIsCancelled
) {
	try {
		let stringId = String(id)
		let baseUrl = checkProxyForUrl(
			settings.proxyCancelVersionUrl,
			settings.cancelVersionUrl
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
			setError('Не запустить версию')
		}
	} catch (err) {
		console.error(`Ошибка запуска версии ${id}:`, err)
		setError(err.message)
	} finally {
		setLoading(false)
		setShowNotice(true)
		setIsCancelled(true)
	}
}
