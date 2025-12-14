import {
	_companyBankCode,
	_companyBankPaymentAccountCode,
	_companyBikCode,
	_companyDirectorCode,
	_companyINNCode,
	_companyKPPCode,
	_companyPaymentAccountCode,
	_issueBankCode,
	_issueBankPaymentAccountParamCode,
	_issueBikParamCode,
	_issueCompanyPaymentAccountParamCode,
	_issueDirectorCode,
	_issueINNParamCode,
	_issueInvoiceDateParamCode,
	_issueKPPParamCode,
	_issueObserverAddressParamCode,
	_issueObserverPhoneParamCode,
	_issuePayBeforeCode,
	_issuePeriodCode,
} from '../../../settings/setSettings.js'
import getCalculationPeriod from './getCalculationPeriod.js'

export default async function parseParentIssueData(
	parentIssueClientInfo,
	parentIssueData,
	invoiceDate
) {
	let curIssueParams = {}

	// Атрибуты клиента родительской заявки
	curIssueParams[_issueObserverAddressParamCode] = parentIssueClientInfo.address
	curIssueParams[_issueObserverPhoneParamCode] = parentIssueClientInfo.phone
	for (let elem of parentIssueClientInfo.parameters) {
		if (elem.code == _companyINNCode) {
			curIssueParams[_issueINNParamCode] = elem.value
		} else if (elem.code == _companyKPPCode) {
			curIssueParams[_issueKPPParamCode] = elem.value
		} else if (elem.code == _companyPaymentAccountCode) {
			curIssueParams[_issueCompanyPaymentAccountParamCode] = elem.value
		} else if (elem.code == _companyBankPaymentAccountCode) {
			curIssueParams[_issueBankPaymentAccountParamCode] = elem.value
		} else if (elem.code == _companyBikCode) {
			curIssueParams[_issueBikParamCode] = elem.value
		} else if (elem.code == _companyBankCode) {
			curIssueParams[_issueBankCode] = elem.value
		} else if (elem.code == _companyDirectorCode) {
			curIssueParams[_issueDirectorCode] = elem.value
		}
	}

	// Атрибуты родительской заявки
	curIssueParams[_issueInvoiceDateParamCode] = invoiceDate
	for (let elem of parentIssueData.parameters) {
		if (elem.code == _issueInvoiceDateParamCode) {
			let curMonthNumber = String(elem.value).split('-')[1]
			let secondMonthNumber = (Number(curMonthNumber) % 12) + 1
			let curYear = String(elem.value).split('-')[0]
			let curPeriod = await getCalculationPeriod(invoiceDate)

			curIssueParams[_issuePeriodCode] = curPeriod
			if (curMonthNumber == 12) {
				curIssueParams[_issuePayBeforeCode] = `${
					Number(curYear) + 1
				}-${secondMonthNumber}-10 23:59`
			} else {
				curIssueParams[
					_issuePayBeforeCode
				] = `${curYear}-${secondMonthNumber}-10 23:59`
			}
		}
	}
	return curIssueParams
}
