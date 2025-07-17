import createGlobalState from '.';
import { reportQK } from './QueryKeys';

//* Stock
export const useReportStock = (from, to, type, { enabled = false }) =>
	createGlobalState({
		queryKey: reportQK.stock(from, to, type),
		url: `/report/material-stock-report?from_date=${from}&to_date=${to}&store_type=${type}`,
		enabled,
	});

export const useReportStoreApproved = (query, { enabled = false }) =>
	createGlobalState({
		queryKey: reportQK.storeApproved(query),
		url: query
			? `/report/item-zipper-number-end-wise-approved?${query}`
			: `/report/item-zipper-number-end-wise-approved`,
		enabled,
	});

export const useProductionReportDateWise = (
	from = '',
	to = '',
	type = '',
	query,
	{ enabled = false } = {}
) =>
	createGlobalState({
		queryKey: reportQK.productionReportDateWise(from, to, type, query),
		url:
			`/report/daily-production-report?from_date=${from}&to_date=${to}&type=${type}` +
			query,
		enabled: false, // never auto-fetch
		refetchOnWindowFocus: false,
	});
export const useProductionStatementReport = (
	from = '',
	to = '',
	party = '',
	marketing = '',
	type = '',
	order = '',
	reportFor = '',
	priceFor,
	query,
	{ isEnabled = false } = {}
) =>
	createGlobalState({
		queryKey: reportQK.productionReportStatementReport(
			from,
			to,
			party,
			marketing,
			type,
			order,
			reportFor,
			priceFor,
			query
		),
		url: query
			? `/report/delivery-statement-report?from_date=${from}&to_date=${to}&party=${party}&marketing=${marketing}&order_info_uuid=${order}&type=${type}&report_for=${reportFor}&price_for=${priceFor}&${query}`
			: `/report/delivery-statement-report?from_date=${from}&to_date=${to}&party=${party}&marketing=${marketing}&order_info_uuid=${order}&type=${type}&report_for=${reportFor}&price_for=${priceFor}`,
		enabled: !!from && !!to && isEnabled,
	});

export const useOrderStatementReport = (
	from = '',
	to = '',
	party = '',
	marketing = '',
	type = '',
	query = '',
	{ isEnabled = false } = {}
) =>
	createGlobalState({
		queryKey: reportQK.orderStatementReport(
			from,
			to,
			party,
			marketing,
			type,
			query
		),
		url: query
			? `/report/order-sheet-pdf-report?from_date=${from}&to_date=${to}&party=${party}&marketing=${marketing}&type=${type}&${query}`
			: `/report/order-sheet-pdf-report?from_date=${from}&to_date=${to}&party=${party}&marketing=${marketing}&type=${type}`,
		enabled: !!from && !!to && isEnabled,
	});

export const useZipperProduction = (query, { enabled = false } = {}) =>
	createGlobalState({
		queryKey: reportQK.zipperProduction(query),
		url: '/report/zipper-production-status-report?' + query,
		enabled,
	});

export const useThreadProductionBatchWise = (query, { enabled = false } = {}) =>
	createGlobalState({
		queryKey: reportQK.threadProductionBatchWise(query),
		url: '/report/thread-production-batch-wise-report?' + query,
		enabled,
	});

export const useThreadProductionOrderWise = (query, { enabled = false } = {}) =>
	createGlobalState({
		queryKey: reportQK.threadProductionOrderWise(query),
		url: '/report/thread-production-status-order-wise?' + query,
		enabled,
	});

export const useDailyChallan = (type, query, { enabled = false } = {}) =>
	createGlobalState({
		queryKey: reportQK.dailyChallan(type, query),
		url: query
			? `/report/daily-challan-report?type=${type}&${query}`
			: `/report/daily-challan-report?type=${type}`,
		enabled,
	});

export const useDailyChallanDR = (from, to, query, { enabled = false } = {}) =>
	createGlobalState({
		queryKey: reportQK.dailyChallanDR(from, to, query),
		url: query
			? `/report/daily-challan-report?from_date=${from}&to_date=${to}&${query}`
			: `/report/daily-challan-report?from_date=${from}&to_date=${to}`,
		enabled,
	});

export const useThreadStatus = (from, to, query, { enabled = false } = {}) =>
	createGlobalState({
		queryKey: reportQK.threadStatus(query, from, to),
		url:
			`/report/production-report-thread-sales-marketing?from=${from}&to=${to}&` +
			query,
		enabled,
		refetchOnWindowFocus: false,
	});

export const useZipperStatus = (from, to, query, { enabled = false } = {}) =>
	createGlobalState({
		queryKey: reportQK.zipperStatus(query, from, to),
		url:
			`/report/production-report-sales-marketing?from=${from}&to=${to}&` +
			query,
		enabled,
		refetchOnWindowFocus: false,
	});

export const useItemWise = (from, to, query, { enabled = false } = {}) =>
	createGlobalState({
		queryKey: reportQK.itemWise(from, to, query),
		url:
			`/report/item-wise-production-report?from=${from}&to=${to}` + query,
		enabled,
	});

export const useItemZipperEndWise = (
	from,
	to,
	query,
	{ enabled = false } = {}
) =>
	createGlobalState({
		queryKey: reportQK.itemZipperEndWise(from, to, query),
		url:
			`/report/item-zipper-end-wise-production-report?from=${from}&to=${to}` +
			query,
		enabled,
	});

export const usePIRegister = (
	from,
	to,
	query,
	{ enabled = false } = { enabled: false }
) =>
	createGlobalState({
		queryKey: reportQK.piRegister(from, to, query),
		url: `/report/pi-register-report?from=${from}&to=${to}` + query,
		enabled,
	});

export const usePIToBeSubmitted = (
	query,
	{ enabled = false } = { enabled: false }
) =>
	createGlobalState({
		queryKey: reportQK.piToBeSubmitted(query),
		url: '/report/pi-to-be-register-report?' + query,
		enabled,
	});

export const usePIToBeSubmittedByMarketing = (
	query,
	{ enabled = false } = { enabled: false }
) =>
	createGlobalState({
		queryKey: reportQK.piToBeSubmittedByMarketing(query),
		url: '/report/pi-to-be-register-report-marketing-wise?' + query,
		enabled,
	});

export const useLC = (url, { enabled = false } = {}) => {
	return createGlobalState({
		queryKey: reportQK.lc(url),
		url,
		enabled,
	});
};

export const useProductionReport = (url, { enabled = false } = {}) =>
	createGlobalState({
		queryKey: reportQK.productionReport(url),
		url: `/report/production-report-${url}`,
		enabled,
	});
export const useDeliveryStatement = (url, { enabled = false } = {}) =>
	createGlobalState({
		queryKey: reportQK.deliveryStatement(url),
		url: `/report/delivery-statement-report?` + url,
		enabled,
	});

export const useProductionReportThreadPartyWise = (
	query,
	{ enabled = false } = {}
) =>
	createGlobalState({
		queryKey: reportQK.productionReportThreadPartyWise(query),
		url: `/report/production-report-thread-party-wise?` + query,
		enabled,
	});

export const useSample = (
	date,
	toDate,
	is_sample = 1,
	query,
	{ enabled = false } = {}
) =>
	createGlobalState({
		queryKey: reportQK.sample(date, toDate, is_sample, query),
		url: query
			? `/report/sample-report-by-date?date=${date}&to_date=${toDate}&is_sample=${is_sample}` +
				query
			: `/report/sample-report-by-date?date=${date}&to_date=${toDate}&is_sample=${is_sample}`,
		enabled,
	});

export const useBulk = (
	dateAccess = false,
	date,
	toDate,
	query,
	enabled = false
) =>
	createGlobalState({
		queryKey: reportQK.bulk(dateAccess, date, toDate, query),
		url: dateAccess
			? `/report/sample-report-by-date?is_sample=0&date=${date}&to_date=${toDate}&` +
				query
			: `/report/sample-report-by-date?is_sample=0&` + query,
		enabled,
	});

export const useItemConsumption = (
	date,
	toDate,
	type,
	query,
	enabled = false
) =>
	createGlobalState({
		queryKey: reportQK.itemConsumption(date, toDate, type, query),
		url:
			`/report/product-wise-consumption-report?from_date=${date}&to_date=${toDate}&type=${type}` +
			query,
		enabled,
	});

export const useDescriptionConsumption = (
	date,
	toDate,
	type,
	query,
	enabled = false
) =>
	createGlobalState({
		queryKey: reportQK.descConsumption(date, toDate, type, query),
		url:
			`/report/product-wise-consumption-for-order-report?from_date=${date}&to_date=${toDate}&type=${type}` +
			query,
		enabled,
	});

export const usePackingList = (query) =>
	createGlobalState({
		queryKey: reportQK.packingList(query),
		url: query
			? `/report/packing-list-report?` + query
			: `/report/packing-list-report`,
	});

export const useThreadDelivery = (date, toDate, query) =>
	createGlobalState({
		queryKey: reportQK.threadDelivery(date, toDate, query),
		url: query
			? `/report/count-length-wise-delivery-report?from=${date}&to=${toDate}` +
				query
			: `/report/count-length-wise-delivery-report?from=${date}&to=${toDate}`,
	});

export const useOrderTracing = (date, toDate, query) =>
	createGlobalState({
		queryKey: reportQK.orderTracking(date, toDate, query),
		url: query
			? `/report/report-for-ed?from=${date}&to=${toDate}` + query
			: `/report/report-for-ed?from=${date}&to=${toDate}`,
	});

export const useSampleCombined = (
	date,
	is_sample = 1,
	query,
	{ enabled = false } = {}
) =>
	createGlobalState({
		queryKey: reportQK.sampleCombined(date, is_sample, query),
		url: query
			? `/report/sample-report-by-date-combined?date=${date}&is_sample=${is_sample}` +
				query
			: `/report/sample-report-by-date-combined?date=${date}&is_sample=${is_sample}`,
		enabled,
	});

export const useApprovedOrdersPartyWise = (query, { enabled = false } = {}) =>
	createGlobalState({
		queryKey: reportQK.approvedOrdersPartyWise(query),
		url: query
			? `/report/party-wise-approved-quantity?${query}`
			: `/report/party-wise-approved-quantity`,
		enabled,
	});

export const useChallanStatusReport = (uuid, query) =>
	createGlobalState({
		queryKey: reportQK.challanStatusReport(uuid, query),
		url: query
			? `/report/challan-pdf-report/${uuid}?${query}`
			: `/report/challan-pdf-report/${uuid}`,
		enabled: !!uuid,
	});

export const useOrderSummary = (uuid) =>
	createGlobalState({
		queryKey: reportQK.orderSummaryReport(uuid),
		url: `/report/order-register-report/${uuid}`,
		enabled: !!uuid,
	});

export const useOrderSummaryPl = (uuid) =>
	createGlobalState({
		queryKey: reportQK.orderSummaryPlReport(uuid),
		url: `/report/order-register-report-for-packing-list/${uuid}`,
		enabled: !!uuid,
	});

//* Delivery Report
export const useDeliveryReportZipper = (
	from,
	to,
	type,
	query,
	{ enabled = false } = {}
) =>
	createGlobalState({
		queryKey: reportQK.deliveryReportZipper(from, to, type, query),
		url: `/report/delivery-report?${query}&from=${from}&to=${to}&order_type=${type}`,
		enabled,
	});

export const useDeliveryReportThread = (
	from,
	to,
	type,
	query,
	{ enabled = false } = {}
) =>
	createGlobalState({
		queryKey: reportQK.deliveryReportThread(from, to, type, query),
		url: `/report/delivery-report-thread?${query}&from=${from}&to=${to}&order_type=${type}`,
		enabled,
	});

export const useThreadBatch = (query) =>
	createGlobalState({
		queryKey: reportQK.threadBatch(query),
		url: `/report/thread-batch-report?${query}`,
	});

// * Order Sheet send & receive

export const useOrderSheetSRZipper = (
	from,
	to,
	type,
	{ enabled = false } = {}
) =>
	createGlobalState({
		queryKey: reportQK.orderSheetSRZipper(from, to, type),
		url: `/report/order-sheet-send-receive-report?from_date=${from}&to_date=${to}&date_type=${type}`,
		enabled,
	});

export const useOrderSheetSRThread = (
	from,
	to,
	type,
	{ enabled = false } = {}
) =>
	createGlobalState({
		queryKey: reportQK.orderSheetSRThread(from, to, type),
		url: `/report/order-sheet-send-receive-report-thread?from_date=${from}&to_date=${to}&date_type=${type}`,
		enabled,
	});

export const useIndividualMaterial = (material_uuid, query) =>
	createGlobalState({
		queryKey: reportQK.individualMaterial(material_uuid, query),
		url: query
			? `/report/individual-material-report/${material_uuid}?${query}`
			: `/report/individual-material-report/${material_uuid}`,
		enabled: !!material_uuid,
	});
