import clsx from 'clsx'
import { useState } from 'react'
import settings from '../../../../settings/setting.json'
import { Table } from '../../../../utils/Table/table'
import getVersionAPI from '../../services/getVersionAPI'
import standartVersionData from '../../utils/standartVersionData'
import styles from './CP.module.scss'

export function CP(props) {
	const [data, setData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	let { id, isOpen, setIsOpen } = props // Деструктуризация объекта. Позволяет присваивать значения свойств переменным

	document.body.classList.add('modal-open')

	// Получение КП конкретной версии
	getVersionAPI(id, setData, setError, setLoading)

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

				{/*Блок вывода КП, если нет ошибок и данные получены */}
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
					</div>
				)}
			</div>
		</div>
	)
}
