import createGlobalState from '.';
import { commercialQK } from './QueryKeys';

// * Bank * //
export const useCommercialDashboard = () =>
	createGlobalState({
		queryKey: commercialQK.dashboard(),
		url: '/report/cash-invoice-report',
	});

// * Bank * //
export const useCommercialBank = () =>
	createGlobalState({
		queryKey: commercialQK.bank(),
		url: '/commercial/bank',
	});

export const useCommercialBankByUUID = (uuid) =>
	createGlobalState({
		queryKey: commercialQK.bankByUUID(uuid),
		url: `/commercial/bank/${uuid}`,
		enabled: !!uuid,
	});

// * PI * //
export const useCommercialPI = () =>
	createGlobalState({
		queryKey: commercialQK.pi(),
		url: '/commercial/pi-cash?is_cash=false',
	});

export const useCommercialPIByQuery = (params, { enabled = false }, piType) =>
	createGlobalState({
		queryKey: commercialQK.piByQuery(params, piType),
		url: `/commercial/pi-cash${params}`,
		enabled,
	});

export const useCommercialPICash = () =>
	createGlobalState({
		queryKey: commercialQK.piCash(),
		url: '/commercial/pi-cash?is_cash=true',
	});

export const useCommercialPIByUUID = (uuid) =>
	createGlobalState({
		queryKey: commercialQK.piByUUID(uuid),
		url: `/commercial/pi-cash/${uuid}`,
		enabled: !!uuid,
	});

export const useCommercialPIDetailsByUUID = (uuid) =>
	createGlobalState({
		queryKey: commercialQK.piDetailsByUUID(uuid),
		url: `/commercial/pi-cash/details/${uuid}`,
		enabled: !!uuid,
	});

export const useCommercialPIDetailsByPiId = (pi_cash_id) =>
	createGlobalState({
		queryKey: commercialQK.piDetailsByPiID(pi_cash_id),
		url: `/commercial/pi-cash/details/by/pi-cash-id/${pi_cash_id}`,
		enabled: !!pi_cash_id,
	});

export const useCommercialReceiveAmount = () =>
	createGlobalState({
		queryKey: commercialQK.receiveAmount(),
		url: '/commercial/cash-receive',
	});
export const useCommercialReceiveAmountByUUID = (uuid) =>
	createGlobalState({
		queryKey: commercialQK.receiveAmountByUUID(uuid),
		url: `/commercial/cash-receive/${uuid}`,
	});

// * PI Entry * //
export const useCommercialPIEntry = () =>
	createGlobalState({
		queryKey: commercialQK.piEntry(),
		url: '/commercial/pi-cash-entry',
	});

export const useCommercialPIEntryByUUID = (uuid) =>
	createGlobalState({
		queryKey: commercialQK.piEntryByUUID(uuid),
		url: `/commercial/pi-cash-entry/${uuid}`,
		enabled: !!uuid,
	});

// * PI by orderInfoIds * //
export const useCommercialPIByOrderInfo = (
	orderInfoIds,
	partyId,
	marketingId,
	params
) =>
	createGlobalState({
		queryKey: commercialQK.piByOrderInfo(
			orderInfoIds,
			partyId,
			marketingId
		),

		url: params
			? `/commercial/pi-cash/details/by/order-info-ids/${orderInfoIds}/${partyId}/${marketingId}?${params}`
			: `/commercial/pi-cash/details/by/order-info-ids/${orderInfoIds}/${partyId}/${marketingId}`,
		enabled:
			!!orderInfoIds &&
			orderInfoIds.length > 0 &&
			!!partyId &&
			!!marketingId,
	});

export const useCommercialPThreadByOrderInfo = (
	orderInfoIds,
	partyId,
	marketingId,
	params
) =>
	createGlobalState({
		queryKey: commercialQK.piThreadByOrderInfo(
			orderInfoIds,
			partyId,
			marketingId
		),

		url: params
			? `/commercial/pi-cash/thread-details/by/order-info-ids/${orderInfoIds}/${partyId}/${marketingId}?${params}`
			: `/commercial/pi-cash/thread-details/by/order-info-ids/${orderInfoIds}/${partyId}/${marketingId}`,
		enabled:
			!!orderInfoIds &&
			orderInfoIds.length > 0 &&
			!!partyId &&
			!!marketingId,
	});

// * MANUAL PI * //
export const useCommercialManualPI = (query, { enabled = false } = {}) =>
	createGlobalState({
		queryKey: commercialQK.manualPI(query),
		url: query ? `/commercial/manual-pi?${query}` : '/commercial/manual-pi',
		enabled,
	});

export const useCommercialManualPIDetails = (uuid) =>
	createGlobalState({
		queryKey: commercialQK.manualPIDetails(uuid),
		url: `/commercial/manual-pi/details/by/${uuid}`,
	});

// * LC * //
export const useCommercialLC = () =>
	createGlobalState({
		queryKey: commercialQK.lc(),
		url: '/commercial/lc',
	});

export const useCommercialLCByQuery = (params, { enabled = false }) =>
	createGlobalState({
		queryKey: commercialQK.lcByQuery(),
		url: `/commercial/lc${params}`,
		enabled,
	});

export const useCommercialLCByUUID = (uuid) =>
	createGlobalState({
		queryKey: commercialQK.lcByUUID(uuid),
		url: `/commercial/lc/${uuid}`,
		enabled: !!uuid,
	});

export const useCommercialLCPIByUUID = (uuid) =>
	createGlobalState({
		queryKey: commercialQK.lcByPi(uuid),
		url: `/commercial/lc-pi-cash/by/${uuid}`,
		enabled: !!uuid,
	});

export const useCommercialLCByNumber = (number) =>
	createGlobalState({
		queryKey: commercialQK.lcByNumber(number),
		url: `/commercial/lc/by/lc-number/${number}`,
		enabled: !!number,
	});
