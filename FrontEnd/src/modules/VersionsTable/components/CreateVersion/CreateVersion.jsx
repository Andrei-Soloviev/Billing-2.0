import clsx from 'clsx'
import addNewVersion from '../../services/addNewVersion'
import styles from './CreateVersion.module.scss'

export default function CreateVersion({
	setOpenModal,
	setIsError,
	setErrorText,
	isLoading,
	setIsLoading,
	setNewVersionName,
	newVersionName,
	setVersionDataToTable,
	btnTextAddVersion,
	setBtnTextAddVersion,
	setShowNotice,
}) {
	return (
		<div className={styles.modal}>
			<div>
				<div className={styles.modal__bg}></div>
				<div className={styles.modal__content}>
					{/* Закрытие модалки */}
					<button
						disabled={isLoading}
						className={clsx(
							styles.modal__content__btn_close,
							isLoading && 'btn_unwork'
						)}
						onClick={e => {
							setOpenModal(false)
							setIsError(false)
							setIsLoading(false)
							setBtnTextAddVersion('Создать версию')
							document.body.classList.remove('modal-open')
						}}
					>
						&#10006;
					</button>
					{/* Блок ввода названия версии */}
					<div className={styles.modal__content__input}>
						<span>Название версии:</span>
						<input
							disabled={isLoading}
							type='text'
							onChange={e => {
								setNewVersionName(e.target.value)
							}}
						/>
					</div>
					{/* Кнопка создания версии */}
					<button
						className={clsx(
							styles.modal__content__btn_create,
							isLoading && 'btn_unwork'
						)}
						onClick={async e => {
							setIsLoading(true)
							// Проверка введено ли имя версии
							if (newVersionName == '' || newVersionName == undefined) {
								setIsError(true)
								setErrorText('Не указано название версии')
								setIsLoading(false)
								setShowNotice(true)
							}
							// Если имя версии введено
							else {
								setIsError(false)
								setBtnTextAddVersion('Загрузка...')
								// АПИ-запрос на добавление версии
								await addNewVersion(
									newVersionName,
									setIsError,
									setErrorText,
									setOpenModal,
									setIsLoading,
									setBtnTextAddVersion,
									setVersionDataToTable,
									setShowNotice
								)
							}
							setNewVersionName('')
						}}
					>
						{btnTextAddVersion}
					</button>
				</div>
			</div>
		</div>
	)
}
