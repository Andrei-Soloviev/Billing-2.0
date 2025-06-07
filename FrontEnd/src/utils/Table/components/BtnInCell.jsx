import clsx from 'clsx'
import React, { useState } from 'react'
import styles from '../table.module.scss'
export function CreateBtnInCell({
	btnText,
	renderModalFunc,
	idString,
	onMouseEnter,
	onMouseLeave,
	isHighlighted,
}) {
	/* 	Код компонента */
	const [showModal, setShowModal] = useState(false)
	return (
		<div className={styles.table__btn_container}>
			{/* Кнопка, которая открывает модалку */}
			<button
				onClick={() => setShowModal(true)}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				className={clsx(
					styles.table__btn,
					// Если isHighlighted, подсветка кнопка
					isHighlighted && styles.table__btn_nextAftHovered
				)}
			>
				{btnText}
			</button>
			{/* Рендеринг модалки */}
			{showModal && (
				<div className={styles.table__component_container}>
					{typeof renderModalFunc === 'function'
						? renderModalFunc({
								id: idString,
								isOpen: showModal,
								setIsOpen: setShowModal,
						  })
						: React.cloneElement(renderModalFunc, {
								id: idString,
								isOpen: showModal,
								setIsOpen: setShowModal,
						  })}
				</div>
			)}
		</div>
	)
}
