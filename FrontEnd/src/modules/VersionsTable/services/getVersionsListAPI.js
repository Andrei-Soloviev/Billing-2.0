import settings from '../../../settings/setting.json'
import checkProxyForUrl from '../../../utils/checkProxyForUrl'
export async function getVersionsList() {
	let url = checkProxyForUrl(
		settings.proxyGetVersionsListUrl,
		settings.getVersionsListUrl
	)

	let reqVersions = await fetch(url)
	let newVersions
	if (reqVersions.ok) {
		await reqVersions.json().then(content => {
			newVersions = content
		})
	} else {
		console.error('Ошибка:', reqVersions.statusText)
	}
	return newVersions
}
