import { useState } from 'react'
import { VersionsTable } from './modules/versionsTable/VersionsTable'
function App() {
	const [count, setCount] = useState(0)

	return (
		<div className='app'>
			<h1>Биллинг ТС</h1>
			<h2>Версии биллинга ТС</h2>
			<VersionsTable />
		</div>
	)
}

export default App
