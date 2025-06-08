import clsx from 'clsx'
import { useState } from 'react'
import settings from '../../../../settings/setting.json'
import { Table } from '../../../../utils/Table/table'
import getVersionAPI from '../../services/getVersionAPI'
import getVersionLinkAPI from '../../services/getVersionLinkAPI'
import standartVersionData from '../../utils/standartVersionData'
import { versions } from '../../VersionsTable'
import styles from './Version.module.scss'

export function Version({ id, isOpen, setIsOpen }) {
	const [data, setData] = useState(null)
	const [curVersion, setCurVersion] = useState(
		versions.filter(elem => elem.version_id == id)[0]
	)
	const [isCancelled, setIsCancelled] = useState(curVersion.is_cancelled)
	const [issueLink, setIssueLink] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	document.body.classList.add('modal-open')

	// Получение конкретной версии
	getVersionAPI(id, setData, setError, setLoading)
	//Получение ссылку на заявку с версией
	getVersionLinkAPI(id, setIssueLink)

	return (
		<div className={clsx(styles.modal, styles.modal_open)}>
			{/* Фон модалки */}
			<div
				className={styles.modal__bg}
				onClick={e => {
					document.body.classList.remove('modal-open')
					setIsOpen(false)
				}}
			/>

			{/* Контент модального окна */}
			<div
				className={clsx(
					styles.modal__content,
					loading && styles.modal__content_loading,
					error && styles.modal__content_error
				)}
			>
				{/* Кнопка закрытия модалки */}
				<button
					disabled={loading}
					className={clsx(
						styles.modal__content__btn_close,
						loading && 'btn_unwork'
					)}
					onClick={e => {
						document.body.classList.remove('modal-open')
						setIsOpen(false)
					}}
				>
					&#10006;
				</button>

				{/*Блок вывода, если нет ошибок и данные получены */}
				{error ? (
					<div className={clsx(styles.modal__content__error)}>
						Error: {error}
					</div>
				) : loading ? (
					<div className={clsx(styles.modal__content__loading)}>
						Загрузка...
					</div>
				) : (
					<div className={clsx(styles.modal__content__tableContainer)}>
						<Table
							headers={settings.CpTableHeaders}
							content={
								standartVersionData(data) != 'Error'
									? standartVersionData(data)
									: setError('Ошибка стандартизации данных')
							}
							tableMaxHeight={696}
							className='CpTable'
						/>
						<div
							className={clsx(styles.modal__content__tableContainer__buttons)}
						>
							<a className='button' href={issueLink} target='_blank'>
								Открыть версию в Okdesk
							</a>
							{isCancelled ? (
								<button>Запустить версию</button>
							) : (
								<button>Отменить версию</button>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
