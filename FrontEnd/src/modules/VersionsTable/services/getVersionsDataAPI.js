import settings from '../../../settings/setting.json'
import checkProxyForUrl from '../../../utils/checkProxyForUrl'
export async function getVersionsData() {
	let url = checkProxyForUrl(
		settings.proxyGetVersionsDataUrl,
		settings.getVersionsDataUrl
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
