import { useState } from 'react'
import settings from '../../settings/setting.json'
import { Table } from '../../utils/Table/table'
import { CP } from './components/CP/CP'
import { getVersionsData } from './services/getVersionsDataAPI'
import { standartVersionsData } from './utils/standartVersionsData'
import styles from './versionsTable.module.scss'

let versions = await getVersionsData()

export function VersionsTable() {
	const [openModal, setOpenModal] = useState(false)
	const [newVersionName, setNewVersionName] = useState('')
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
					// Дата передастся в CP
					return <CP {...data} />
				}}
			/>
		</div>
	)
}
