import * as fs from 'fs'

let settings = fs.readFileSync('./settings/settings.json', 'utf8')
/* let settings = fs.readFileSync(
	'/var/www/api-billing-002/settings/setting.json',
	'utf8'
) */

settings = JSON.parse(settings)

export const _account = settings.account
export const _token = settings.token
export const _priceListId = settings.priceListId
