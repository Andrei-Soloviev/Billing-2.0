import getCompanyAPI from '../../../API/getCompanyAPI.js'
import { _companyServicerCode } from '../../../settings/setSettings.js'

export default async function getCurClientServicer(curClientId) {
	return (await getCompanyAPI(curClientId)).parameters.filter(
		param => param.code == _companyServicerCode
	)[0].value
}
