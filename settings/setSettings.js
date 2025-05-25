import * as fs from 'fs'

let settings = fs.readFileSync('./settings/settings.json', 'utf8')
/* let settings = fs.readFileSync(
	'/var/www/api-billing-002/settings/setting.json',
	'utf8'
) */

settings = JSON.parse(settings)

export const _account = settings.account
export const _token = settings.token

export const _priceListId = settings.priceList.id
export const _priceListPosNotFound = settings.priceList.posNotFound

export const _equipmentBillingCode = settings.equipmentParametersCodes.billing
export const _equipmentBillingValue = settings.equipmentParametersValues.billing
export const _equipmentTariffCode = settings.equipmentParametersCodes.tariff
export const _equipmentOwnerSimCode = settings.equipmentParametersCodes.ownerSim
export const _equipmentNumberSimCode =
	settings.equipmentParametersCodes.numberSim
export const _equipmentAvtografCode = settings.equipmentParametersCodes.avtograf

export const _companyAgreementCode = settings.companyParametersCodes.agreement
