import { useState } from 'react'
import settings from '../../settings/setting.json'
import { Notice } from '../../utils/Notice/Notice'
import { Table } from '../../utils/Table/table'
import CreateVersion from './components/CreateVersion/CreateVersion'
import { Version } from './components/Version/Version'
import { getVersionsList } from './services/getVersionsListAPI'
import { standartVersionsData } from './utils/standartVersionsData'
import styles from './versionsTable.module.scss'

export let versions = await getVersionsList()

export function VersionsTable() {
	const [openModal, setOpenModal] = useState(false)
	const [newVersionInvoiceDate, setNewVersionInvoiceDate] = useState('')
	const [versionDataToTable, setVersionDataToTable] = useState(
		standartVersionsData(versions)
	)
	const [btnTextAddVersion, setBtnTextAddVersion] = useState('Создать версию')
	const [isLoading, setIsLoading] = useState(false)
	const [isError, setIsError] = useState(false)
	const [errorText, setErrorText] = useState('')
	const [showNotice, setShowNotice] = useState(false)

	return (
		<div className={styles.versionsTableBlock}>
			{/* Таблица версий */}
			<Table
				headers={settings.versionsTableHeaders}
				content={versionDataToTable}
				className={'tableVersions'}
				isReverse={true}
				OnClickBtn={data => {
					// data передастся в Версию
					return <Version {...data} />
				}}
			/>

			{/* Кнопка, которая открывает модалку создания версий */}
			<button
				className={styles.versionsTable__btn_create}
				onClick={e => {
					setOpenModal(true)
					document.body.classList.add('modal-open')
				}}
			>
				Создать версию календарного плана
			</button>

			{/* Модалка создания версии */}
			{openModal && (
				<CreateVersion
					setOpenModal={setOpenModal}
					setIsError={setIsError}
					setErrorText={setErrorText}
					isLoading={isLoading}
					setIsLoading={setIsLoading}
					newVersionInvoiceDate={newVersionInvoiceDate}
					setNewVersionInvoiceDate={setNewVersionInvoiceDate}
					btnTextAddVersion={btnTextAddVersion}
					setBtnTextAddVersion={setBtnTextAddVersion}
					setShowNotice={setShowNotice}
				/>
			)}
			{/* Уведомление об успехе или ошибки */}
			{showNotice && (
				<Notice
					noticeText={isError ? errorText : 'Создание версии успешно запущено'}
					setOpenNotice={setShowNotice}
					noticeType={isError ? 'error' : 'notice'}
				/>
			)}
		</div>
	)
}
