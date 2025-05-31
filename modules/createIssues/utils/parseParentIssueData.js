import { _issueInvoiceDateParamCode } from '../../../settings/setSettings.js'

export default async function parseParentIssueData(parentIssueData) {
	let result = {}
	result.parentIssueId = parentIssueData.id
	result.parentIssueClientId = parentIssueData.client.company.id
	result.invoiceDate = parentIssueData.parameters.filter(
		elem => elem.code == _issueInvoiceDateParamCode
	)[0].value

	return result
}
