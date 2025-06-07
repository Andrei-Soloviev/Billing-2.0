import clsx from 'clsx'
import styles from '../table.module.scss'

export function CreateCell({
	cellData,
	verticalAlign,
	horizontalAlign,
	cellsWidth,
}) {
	/* Код компонента */
	horizontalAlign = String(horizontalAlign).toLowerCase() || 'center'
	verticalAlign = String(verticalAlign).toLowerCase() || 'center'

	return (
		<div
			className={clsx(styles.table__cell)}
			style={{
				width: cellsWidth,
				justifyContent: horizontalAlign,
				textAlign: horizontalAlign,
				alignItems: verticalAlign,
				verticalAlign: verticalAlign,
			}}
		>
			{cellData}
		</div>
	)
}
