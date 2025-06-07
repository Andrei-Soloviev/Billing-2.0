import { useRef } from 'react'
import styles from '../table.module.scss'
import { CreateBtnInCell } from './BtnInCell'
import { CreateCell } from './Cell'

export function CreateString({
	cellsContent,
	btnEvent,
	rowIndex,
	setHoveredRowIndex,
	isHighlighted,
	cellsWidth,
}) {
	/* Код компонента */
	const idRef = useRef('') // Хранение id без ререндеров

	return (
		<div className={styles.table__string}>
			{cellsContent.map((element, index) => {
				let uniqKey = `${rowIndex}-${index}`
				element = String(element)

				if (element.includes('_IDMAIN')) {
					idRef.current = element.replace('_IDMAIN', '')
					return (
						<CreateCell
							key={uniqKey}
							cellData={element.replace('_IDMAIN', '')}
							horizontalAlign={'right'}
							cellsWidth={cellsWidth}
						/>
					)
				}

				if (element.includes('_BTN')) {
					return (
						<CreateBtnInCell
							key={rowIndex}
							btnText={element.replace('_BTN', '')}
							renderModalFunc={btnEvent}
							idString={idRef.current}
							isHighlighted={isHighlighted}
							// При наведении: передача родителю индекса строки, кнопку в которой нужно подсветить
							onMouseEnter={() => {
								setHoveredRowIndex(rowIndex)
							}}
							// Обнуление кода предыдущей строки
							onMouseLeave={() => setHoveredRowIndex(null)}
						/>
					)
				}
				/* Создание ячейки с выравниванием текста по левому краю */
				if (element.includes('_TEXT')) {
					return (
						<CreateCell
							key={uniqKey}
							cellData={element.replace('_TEXT', '')}
							horizontalAlign={'left'}
							cellsWidth={cellsWidth}
						/>
					)
				}

				if (element.includes('_NUM')) {
					return (
						<CreateCell
							key={uniqKey}
							cellData={element.replace('_NUM', '')}
							horizontalAlign={'right'}
							cellsWidth={cellsWidth}
						/>
					)
				}

				return (
					<CreateCell
						key={uniqKey}
						cellData={element}
						cellsWidth={cellsWidth}
					/>
				)
			})}
		</div>
	)
}
