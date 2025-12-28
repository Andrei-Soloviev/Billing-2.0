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

export const _parentType = settings.issue.type.parent
export const _nestedType = settings.issue.type.nested

export const _parentCreateStartStatus =
	settings.issue.statuses.parentCreateStart
export const _parentCreateEndStatus = settings.issue.statuses.parentCreateEnd
export const _parentCancelStartStatus =
	settings.issue.statuses.parentCancelStart
export const _parentCancelEndStatus = settings.issue.statuses.parentCancelEnd
export const _nestedEndStatus = settings.issue.statuses.nestedEnd

export const _issueInvoiceDateParamCode = settings.issue.params.invoiceDateCode
export const _issueINNParamCode = settings.issue.params.innCode
export const _issueKPPParamCode = settings.issue.params.kppCode
export const _issueObserverAddressParamCode =
	settings.issue.params.observerAddressCode
export const _issueObserverPhoneParamCode =
	settings.issue.params.observerPhoneCode
export const _issueCompanyPaymentAccountParamCode =
	settings.issue.params.companyPaymentAccountCode
export const _issueBankPaymentAccountParamCode =
	settings.issue.params.bankPaymentAccountCode
export const _issueBikParamCode = settings.issue.params.bikCode
export const _issueBankCode = settings.issue.params.bank
export const _issueDirectorCode = settings.issue.params.director
export const _issuePeriodCode = settings.issue.params.period
export const _issuePayBeforeCode = settings.issue.params.payBefore

export const _commentAuthorId = settings.issue.comments.authorId
export const _commentCreateStartText = settings.issue.comments.createStartText
export const _commentWrongCompanyText = settings.issue.comments.wrongCompanyText
export const _commentCreateEndText = settings.issue.comments.createEndText
export const _commentCancelStartText = settings.issue.comments.cancelStartText
export const _commentCancelEndText = settings.issue.comments.cancelEndText
export const _commentNestedEndText = settings.issue.comments.nestedEndText

export const _equipmentBillingCode = settings.equipmentParametersCodes.billing
export const _equipmentBillingValue = settings.equipmentParametersValues.billing
export const _equipmentTariffCode = settings.equipmentParametersCodes.tariff
export const _equipmentOwnerSimCode = settings.equipmentParametersCodes.ownerSim
export const _equipmentNumberSimCode =
	settings.equipmentParametersCodes.numberSim
export const _equipmentAvtografCode = settings.equipmentParametersCodes.avtograf

export const _companyAgreementCode = settings.companyParametersCodes.agreement
export const _companyServicerCode = settings.companyParametersCodes.servicer
export const _companyINNCode = settings.companyParametersCodes.inn
export const _companyKPPCode = settings.companyParametersCodes.kpp
export const _companyPaymentAccountCode =
	settings.companyParametersCodes.companyPaymentAccount
export const _companyBankPaymentAccountCode =
	settings.companyParametersCodes.bankPaymentAccount
export const _companyBikCode = settings.companyParametersCodes.bik
export const _companyBankCode = settings.companyParametersCodes.bank
export const _companyDirectorCode = settings.companyParametersCodes.director

export const _parentIssueTitle = settings.parentIssue.title
export const _parentIssueCompanyIds = settings.parentIssue.companyIds
