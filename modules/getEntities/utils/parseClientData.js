import { _companyAgreementCode } from '../../../settings/setSettings.js'

export default function parseClientData(data) {
	let result = {}

	result.companyId = data.id
	result.companyName = data.name
	result.companyAgreement = data.parameters.filter(
		elem => elem.code == _companyAgreementCode
	)[0].value

	return result
}
