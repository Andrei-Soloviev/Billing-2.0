export default function checkProxyForUrl(proxyUrl, normalUrl) {
	// Если localhost, то будет использоваться проксирование. Если прод, то запросы идут напрямую
	const isDev = window.location.hostname === 'localhost'
	return isDev
		? proxyUrl // работает через Vite proxy
		: normalUrl // продакшн
}
