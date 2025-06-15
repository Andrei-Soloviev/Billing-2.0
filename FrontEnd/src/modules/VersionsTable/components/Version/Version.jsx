import clsx from 'clsx'
import { useState } from 'react'
import settings from '../../../../settings/setting.json'
import { Notice } from '../../../../utils/Notice/Notice'
import { Table } from '../../../../utils/Table/table'
import cancelVersionAPI from '../../services/cancelVersionAPI'
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
	const [loadingVersionData, setLoadingVersionData] = useState(true)
	const [errorVersionData, setErrorVersionData] = useState(null)
	const [showNotice, setShowNotice] = useState(false)
	const [loadingVersionAction, setLoadingVersionAction] = useState(false)
	const [errorVersionAction, setErrorVersionAction] = useState(null)

	document.body.classList.add('modal-open')

	// Получение конкретной версии
	getVersionAPI(id, setData, setErrorVersionData, setLoadingVersionData)
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
					loadingVersionData && styles.modal__content_loading,
					errorVersionData && styles.modal__content_error
				)}
			>
				{/* Кнопка закрытия модалки */}
				<button
					disabled={loadingVersionData}
					className={clsx(
						styles.modal__content__btn_close,
						loadingVersionData && 'btn_unwork'
					)}
					onClick={e => {
						document.body.classList.remove('modal-open')
						setIsOpen(false)
					}}
				>
					&#10006;
				</button>

				{/*Блок вывода, если нет ошибок и данные получены */}
				{errorVersionData ? (
					<div className={clsx(styles.modal__content__error)}>
						Error: {errorVersionData}
					</div>
				) : loadingVersionData ? (
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
									: setErrorVersionData('Ошибка стандартизации данных')
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
							{!isCancelled && (
								<button
									disabled={loadingVersionAction}
									className={clsx(
										/* styles.modal__content__btn_close, */
										loadingVersionAction && 'btn_unwork'
									)}
									onClick={e => {
										setLoadingVersionAction(true)
										cancelVersionAPI(
											id,
											setErrorVersionAction,
											setLoadingVersionAction,
											setShowNotice,
											setIsCancelled
										)
									}}
								>
									Отменить версию
								</button>
							)}
							{showNotice && (
								<Notice
									noticeText={
										errorVersionAction
											? errorVersionAction
											: 'Отмена версии успешно запущена'
									}
									setOpenNotice={setShowNotice}
									noticeType={errorVersionAction ? 'error' : 'notice'}
								/>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
