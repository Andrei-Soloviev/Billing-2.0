import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	esbuild: {
		supported: {
			'top-level-await': true, // правильное место для настройки поддержки top-level await
		},
	},
	server: {
		proxy: {
			'/api': {
				target: 'https://api-billing-002-test.helpdesk.systems',
				changeOrigin: true,
				secure: false, // если self-signed SSL сертификат
				rewrite: path => path.replace(/^\/api/, ''),
			},
		},
	},
})
