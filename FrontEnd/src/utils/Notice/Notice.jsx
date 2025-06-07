import styles from './Notice.module.scss'

export function Notice({ noticeText, noticeType, setOpenNotice }) {
	noticeType = noticeType.toLowerCase()
	return (
		<div className={styles.modal}>
			<div className={styles.modal__bg}></div>
			<div className={styles.modal__content}>
				<button
					className={styles.modal__content__btn_close}
					onClick={e => setOpenNotice(false)}
				>
					&#10006;
				</button>
				<p
					className={styles.modal__content__text}
					style={noticeType == 'error' ? { color: 'red' } : {}}
				>
					{noticeText}
				</p>
			</div>
		</div>
	)
}
