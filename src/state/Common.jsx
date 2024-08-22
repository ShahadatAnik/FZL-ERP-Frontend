import createGlobalState from '.';
import { commonQK } from './QueryKeys';

// * TAPE * //
// * SFG * //
export const useCommonTapeSFG = () =>
	createGlobalState({
		queryKey: commonQK.tapeSFG(),
		url: `/zipper/tape-coil`,
	});
export const useCommonTapeSFGByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.tapeSFG(uuid),
		url: `/zipper/tape-coil${uuid}`,
	});

// * PRODUCTION * //
export const useCommonTapeProduction = () =>
	createGlobalState({
		queryKey: commonQK.tapeProduction(),
		url: `/zipper/tape-coil-production/by/tape`,
	});
export const useCommonTapeProductionByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.tapeProduction(uuid),
		url: `/zipper/tape-coil-production/by/tape${uuid}`,
	});

// * TAPE TO COIL * //
export const useCommonTapeToCoil = () =>
	createGlobalState({
		queryKey: commonQK.tapeToCoil(),
		url: `/zipper/tape-to-coil`,
	});
export const useCommonTapeToCoilByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.tapeToCoil(uuid),
		url: `/zipper/tape-to-coil${uuid}`,
	});

// * RM * //
export const useCommonTapeRM = () =>
	createGlobalState({
		queryKey: commonQK.tapeRM(),
		url: `/material/stock/by/single-field/tape_making`,
	});
export const useCommonTapeRMByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.tapeRM(uuid),
		url: `/material/stock/by/single-field/tape_making/${uuid}`,
	});

//* RM LOG *//
export const useCommonTapeRMLog = () =>
	createGlobalState({
		queryKey: commonQK.tapeRMLog(),
		url: `/material/used/by/tape_making`,
	});
export const useCommonTapeRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.tapeRMLog(uuid),
		url: `/material/used/by/tape_making${uuid}`,
	});
// * Order Against RM Log * //

export const useCommonOrderAgainstTapeRMLog = () =>
	createGlobalState({
		queryKey: commonQK.orderAgainstTapeRMLog(),
		url: `/zipper/material-trx-against-order/by/tape_making`,
	});
export const useCommonOrderAgainstTapeRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.orderAgainstTapeRMLog(uuid),
		url: `/zipper/material-trx-against-order/by/tape_making${uuid}`,
	});


// * COIL * //
// * SFG * //
export const useCommonCoilSFG = () =>
	createGlobalState({
		queryKey: commonQK.coilSFG(),
		url: `/zipper/tape-coil/by/nylon`,
	});

export const useCommonCoilSFGByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.coilSFG(uuid),
		url: `/zipper/tape-coil/by/nylon${uuid}`,
	});

// * PRODUCTION * //
export const useCommonCoilProduction = () =>
	createGlobalState({
		queryKey: commonQK.coilProduction(),
		url: `/zipper/tape-coil-production/by/coil`,
	});
export const useCommonCoilProductionByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.coilProduction(uuid),
		url: `/zipper/tape-coil-production/by/coil/${uuid}`,
	});
//* RM *//
export const useCommonCoilRM = () =>
	createGlobalState({
		queryKey: commonQK.coilRM(),
		url: `/material/stock/by/single-field/coil_forming`,
	});
export const useCommonCoilRMByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.coilRM(uuid),
		url: `/material/stock/by/single-field/coil_forming${uuid}`,
	});
//* RM LOG *//
export const useCommonCoilRMLog = () =>
	createGlobalState({
		queryKey: commonQK.coilRMLog(),
		url: `/material/used/by/coil_forming`,
	});
export const useCommonCoilRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.coilRMLog(uuid),
		url: `/material/used/by/coil_forming${uuid}`,
	});
//* MATERIAL USED *//
export const useCommonMaterialUsed = () =>
	createGlobalState({
		queryKey: commonQK.materialUsed(),
		url: `/material/used`,
	});
export const useCommonMaterialUsedByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.materialUsed(uuid),
		url: `/material/used${uuid}`,
	});
// * Order Against RM Log * //

export const useCommonOrderAgainstCoilRMLog = () =>
	createGlobalState({
		queryKey: commonQK.orderAgainstCoilRMLog(),
		url: `/zipper/material-trx-against-order/by/coil_forming`,
	});
export const useCommonOrderAgainstCoilRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.orderAgainstCoilRMLog(uuid),
		url: `/zipper/material-trx-against-order/by/coil_forming${uuid}`,
	});

// * MATERIAL TRX *//

export const useCommonMaterialTrx = () =>
	createGlobalState({
		queryKey: commonQK.materialTrx(),
		url: `/zipper/material-trx-against-order`,
	});
export const useCommonMaterialTrxByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.materialTrx(uuid),
		url: `/zipper/material-trx-against-order${uuid}`,
	});
