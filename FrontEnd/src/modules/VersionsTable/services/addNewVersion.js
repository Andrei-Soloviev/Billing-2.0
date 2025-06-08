import settings from '../../../settings/setting.json'
import checkProxyForUrl from '../../../utils/checkProxyForUrl'

export default async function addNewVersion(
	invoiceDate,
	setIsError,
	setErrorText,
	setOpenModal,
	setIsLoading,
	setTextAddVersionBtn,
	setShowNotice
) {
	let url = checkProxyForUrl(
		settings.proxyCreateVersionUrl,
		settings.createVersionUrl
	)
	let req = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({ date: invoiceDate }),
	})
	if (req.ok) {
		setOpenModal(false)
		setIsLoading(false)
		setTextAddVersionBtn('Создать версию')
		document.body.classList.remove('modal-open')
		setShowNotice(true)
	} else {
		setIsError(true)
		setIsLoading(false)
		setTextAddVersionBtn('Создать версию')
		setErrorText(`Ошибка: ${req.status} ${req.statusText}`)
		setShowNotice(true)
		console.log(`Ошибка создания версии: ${req.status} ${req.statusText}`)
	}
	return true
}
