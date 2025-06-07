import clsx from 'clsx'
import React, { useState } from 'react'
import { CreateString } from './components/String'
import styles from './table.module.scss'

export function Table({
	headers,
	content,
	className,
	OnClickBtn,
	isReverse,
	cellsWidth,
	tableMaxWidth,
	tableMaxHeight,
}) {
	const [hoveredRowIndex, setHoveredRowIndex] = useState(null) // Определяет, в какой строке кнопка будет подсвечиваться

	if (isReverse) {
		content = [...content].reverse()
	}

	return (
		<div
			className={clsx(styles.table, styles[className])}
			style={{ maxHeight: tableMaxHeight, maxWidth: tableMaxWidth }}
		>
			<div className={styles.table__header}>
				<CreateString cellsContent={headers} cellsWidth={cellsWidth} />
			</div>
			<div className={styles.table__content}>
				{content.map((elem, index) => {
					const str = Object.values(elem)
					return (
						<CreateString
							key={index}
							rowIndex={index}
							setHoveredRowIndex={setHoveredRowIndex}
							isHighlighted={
								hoveredRowIndex != null && index === hoveredRowIndex + 1
							}
							cellsContent={str}
							btnEvent={OnClickBtn}
							cellsWidth={cellsWidth}
						/>
					)
				})}
			</div>
		</div>
	)
}
