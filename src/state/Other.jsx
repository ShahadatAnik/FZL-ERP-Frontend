import createGlobalState from '.';
import { otherQK } from './QueryKeys';

// GET OTHER HR USERS
export const useOtherHRUser = () =>
	createGlobalState({
		queryKey: otherQK.hrUser(),
		url: `/other/hr/user/value/label?designation=driver`,
	});

export const useOtherHRUserByDesignation = (department) =>
	createGlobalState({
		queryKey: otherQK.hrUserByDesignation(department),
		url: department
			? `/other/hr/user/value/label?department=${department}`
			: '/other/hr/user/value/label',
		// enabled: !!designation,
	});

// GET OTHER PARTY
export const useOtherParty = (params) =>
	createGlobalState({
		queryKey: otherQK.party(params),
		url: params
			? `/other/party/value/label?${params}`
			: '/other/party/value/label',
		refetchOnWindowFocus: false,
	});

// GET OTHER MARKETING USER
export const useOtherMarketingUser = () =>
	createGlobalState({
		queryKey: otherQK.marketingUser(),
		url: '/other/marketing-user/value/label',
	});

// GET OTHER BUYER
export const useOtherBuyer = () =>
	createGlobalState({
		queryKey: otherQK.buyer(),
		url: '/other/buyer/value/label',
		refetchOnWindowFocus: false,
	});

// GET OTHER MERCHANDISER BY PARTY UUID
export const useOtherMerchandiserByPartyUUID = (uuid) =>
	createGlobalState({
		queryKey: otherQK.merchandiserByPartyUUID(uuid),
		url: `/other/merchandiser/value/label/${uuid}`,
		enabled: !!uuid,
		refetchOnWindowFocus: false,
	});

// GET OTHER FACTORY BY PARTY UUID
export const useOtherFactoryByPartyUUID = (uuid) =>
	createGlobalState({
		queryKey: otherQK.factoryByPartyUUID(uuid),
		url: `/other/factory/value/label/${uuid}`,
		enabled: !!uuid,
		refetchOnWindowFocus: false,
	});

// GET OTHER MARKETING
export const useOtherMarketing = () =>
	createGlobalState({
		queryKey: otherQK.marketing(),
		url: '/other/marketing/value/label',
		refetchOnWindowFocus: false,
	});

// GET OTHER ORDER
export const useOtherOrder = (
	query,
	enabled = true,
	refetchOnWindowFocus = false
) =>
	createGlobalState({
		queryKey: otherQK.order(query),
		url: query
			? `/other/order/info/value/label?${query}`
			: '/other/order/info/value/label',
		enabled,
		refetchOnWindowFocus,
	});

// GET OTHER ORDER FOR PACKING LIST
export const useOtherOrderPackingList = (param) =>
	createGlobalState({
		queryKey: otherQK.orderPackingList(),
		url: `/other/order/info/value/label?page=challan${param}`,
	});
// GET OTHER PACKING LIST
export const useOtherPackingList = () =>
	createGlobalState({
		queryKey: otherQK.packingList(),
		url: `/other/delivery/packing-list/value/label?is_received=false`,
	});
// GET THREAD ORDER
export const useThreadOrder = (query) =>
	createGlobalState({
		queryKey: otherQK.threadOrders(query),
		url: query
			? `/other/thread/value/label?${query}`
			: '/other/thread/value/label',
	});
export const useOtherThreadOrderPackingList = (param) =>
	createGlobalState({
		queryKey: otherQK.threadOrderPackingList(),
		url: `/other/thread/value/label?page=challan${param}`,
	});
// GET THREAD ORDER For Challan
export const useThreadOrderForChallan = () =>
	createGlobalState({
		queryKey: otherQK.threadOrdersForChallan(),
		url: '/other/thread/value/label?page=challan',
	});

export const useOtherOrderDescription = (params, enabled = true) =>
	createGlobalState({
		queryKey: otherQK.orderDescription(params),
		url: params
			? `/other/order/description/value/label?${params}`
			: '/other/order/description/value/label',
		enabled,
	});

export const useOtherPlanningBatchByDate = (date, uuid, enabled = false) =>
	createGlobalState({
		queryKey: otherQK.planningBatchByDate(date, uuid),
		url: `/zipper/finishing-batch-planning-info?date=${date}&order_description_uuid=${uuid}`,
		enabled,
	});

export const useOtherOrderStore = (params) =>
	createGlobalState({
		queryKey: otherQK.orderStore(params),
		url: params
			? `/other/order/order-description-store/value/label?${params}`
			: '/other/order/order-description-store/value/label',
	});

export const useOtherOrderBatchDescription = (params) =>
	createGlobalState({
		queryKey: otherQK.orderBatchDescription(params),
		url: params
			? `/other/zipper/finishing-batch/value/label?${params}`
			: '/other/zipper/finishing-batch/value/label',
	});

// GET OTHER ORDER PROPERTIES BY TYPE NAME
export const useOtherOrderPropertiesByTypeName = (name) =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByTypeName(name),
		url: `/other/order-properties/by/${name}`,
		enabled: !!name,
		refetchOnWindowFocus: false,
	});

// GET OTHER ORDER ENTRY
export const useOtherOrderEntry = () =>
	createGlobalState({
		queryKey: otherQK.orderEntry(),
		url: `/other/order/entry/value/label`,
	});

// GET OTHER VENDOR
export const useOtherVendor = (type) =>
	createGlobalState({
		queryKey: otherQK.vendor(type),
		url: type
			? `/other/vendor/value/label?store_type=${type}`
			: `/other/vendor/value/label`,
	});

// GET OTHER MATERIAL SECTION
export const useOtherMaterialSection = (type) =>
	createGlobalState({
		queryKey: otherQK.materialSection(type),
		url: type
			? `/other/material-section/value/label?store_type=${type}`
			: `/other/material-section/value/label`,
	});

// GET OTHER MATERIAL TYPE
export const useOtherMaterialType = (type) =>
	createGlobalState({
		queryKey: otherQK.materialType(type),
		url: type
			? `/other/material-type/value/label?store_type=${type}`
			: `/other/material-type/value/label`,
	});

// GET OTHER MATERIAL
export const useOtherMaterial = (type) =>
	createGlobalState({
		queryKey: otherQK.material(type),
		url: type
			? `/other/material/value/label/unit/quantity?store_type=${type}`
			: `/other/material/value/label/unit/quantity`,
	});

//GET OTHER DYES CATEGORY
export const useOtherDyesCategory = () =>
	createGlobalState({
		queryKey: otherQK.dyesCategory(),
		url: `/other/thread/dyes-category/value/label`,
	});
// GET OTHER MATERIAL
export const useOtherMaterialByParams = (params) =>
	createGlobalState({
		queryKey: otherQK.materialByParams(params),
		url: `/other/material/value/label/unit/quantity?${params}`,
	});
// GET OTHER BANK
export const useOtherBank = () =>
	createGlobalState({
		queryKey: otherQK.bank(),
		url: `/other/bank/value/label`,
	});

// GET OTHER LC BY PARTY UUID
export const useOtherLcByPartyUUID = (uuid) =>
	createGlobalState({
		queryKey: otherQK.lcByPartyUUID(uuid),
		url: `/other/lc/value/label/${uuid}`,
		enabled: !!uuid,
	});

// GET OTHER PI
export const useOtherPiValues = (query) =>
	createGlobalState({
		queryKey: otherQK.pi(query),
		url: query ? `/other/pi/value/label?${query}` : `/other/pi/value/label`,
	});

// GET OTHER ORDER DESCRIPTION BY ORDER NUMBER
export const useOtherOrderDescriptionByOrderNumber = (orderNumber) =>
	createGlobalState({
		queryKey: otherQK.orderDescriptionByOrderNumber(orderNumber),
		url: `/other/order/order_description_uuid/by/${orderNumber}`,
		enabled: !!orderNumber,
	});

// GET OTHER ORDER NUMBER FOR ZIPPER BY MARKETING AND PARTY UUID
export const useOtherOrderNumberForZipperByMarketingAndPartyUUID = (
	marketingUUID,
	partyUUID,
	params
) =>
	createGlobalState({
		queryKey: otherQK.orderNumberForZipperByMarketingAndPartyUUID(
			marketingUUID,
			partyUUID,
			params
		),

		url: `/other/order-number-for-pi-zipper/value/label/${marketingUUID}/${partyUUID}?${params}`,
		enabled: !!marketingUUID && !!partyUUID,
	});

// GET OTHER ORDER NUMBER FOR THREAD BY MARKETING AND PARTY UUID
export const useOtherOrderNumberForThreadByMarketingAndPartyUUID = (
	partyUUID,
	marketingUUID,
	params
) =>
	createGlobalState({
		queryKey: otherQK.orderNumberForThreadByMarketingAndPartyUUID(
			partyUUID,
			marketingUUID,
			params
		),

		url: `/other/order-number-for-pi-thread/value/label/${partyUUID}/${marketingUUID}?${params}`,
		enabled: !!marketingUUID && !!partyUUID,
	});

// GET OTHER DEPARTMENT
export const useOtherDepartment = () =>
	createGlobalState({
		queryKey: otherQK.department(),
		url: `/other/department/value/label`,
	});

// GET OTHER SLIDER ITEM
export const useOtherSliderItem = () =>
	createGlobalState({
		queryKey: otherQK.sliderItem(),
		url: `/other/slider-item-name/value/label`,
	});

// GET OTHER SLIDER DIE-CASTING TYPE
export const useOtherSliderDieCastingType = (param) =>
	createGlobalState({
		queryKey: otherQK.sliderDieCastingType(param),
		url: `/other/slider/die-casting/by-type/${param}`,
	});

// GET OTHER SLIDER STOCK
export const useOtherSliderStockWithDescription = (query) =>
	createGlobalState({
		queryKey: otherQK.sliderStockWithDescription(query),
		url: query
			? `/other/slider/stock-with-order-description/value/label?${query}`
			: `/other/slider/stock-with-order-description/value/label`,
	});
// GET OTHER Packing List
export const useOtherPackingListByOrderInfoUUID = (uuid) =>
	createGlobalState({
		queryKey: otherQK.deliveryPackingListByOrderInfoUUID(uuid),
		url: `/other/delivery/packing-list-by-order-info/value/label/${uuid}?received=true`,
		enabled: !!uuid,
	});

export const useOtherPackingListByOrderInfoUUIDAndChallanUUID = (
	uuid,
	challan_uuid,
	item_for
) =>
	createGlobalState({
		queryKey: otherQK.deliveryPackingListByOrderInfoUUIDAndChallanUUID(
			uuid,
			challan_uuid,
			item_for
		),
		url: `/other/delivery/packing-list-by-order-info/value/label/${uuid}?challan_uuid=${challan_uuid}&item_for=${item_for}`,
		enabled: !!uuid,
	});

//* GET ORDER PROPERTIES BY ITEM
export const useOtherOrderPropertiesByItem = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByItem(),
		url: '/other/order-properties/by/item',
		refetchOnWindowFocus: false,
	});

//* GET ORDER PROPERTIES BY ZIPPER NUMBER
export const useOtherOrderPropertiesByZipperNumber = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByZipperNumber(),
		url: '/other/order-properties/by/zipper_number',
		refetchOnWindowFocus: false,
	});

//* GET ORDER PROPERTIES BY END TYPE
export const useOtherOrderPropertiesByEndType = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByEndType(),
		url: '/other/order-properties/by/end_type',
		refetchOnWindowFocus: false,
	});

//* GET ORDER PROPERTIES BY GARMENTS WASH
export const useOtherOrderPropertiesByGarmentsWash = ({
	enabled = true,
} = {}) =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByGarmentsWash(),
		url: '/other/order-properties/by/garments_wash',
		refetchOnWindowFocus: false,
		enabled,
	});

//* GET ORDER PROPERTIES BY LIGHT PREFERENCE
export const useOtherOrderPropertiesByLightPreference = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByLightPreference(),
		url: '/other/order-properties/by/light_preference',
		refetchOnWindowFocus: false,
	});

//* GET ORDER PROPERTIES BY END USER
export const useOtherOrderPropertiesByEndUser = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByEndUser(),
		url: '/other/order-properties/by/end_user',
		refetchOnWindowFocus: false,
	});

//* GET ORDER PROPERTIES BY SLIDER BODY SHAPE
export const useOtherOrderPropertiesBySliderBodyShape = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesBySliderBodyShape(),
		url: '/other/order-properties/by/slider_body_shape',
		refetchOnWindowFocus: false,
	});

//* GET ORDER PROPERTIES BY SLIDER LINK
export const useOtherOrderPropertiesBySliderLink = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesBySliderLink(),
		url: '/other/order-properties/by/slider_link',
		refetchOnWindowFocus: false,
	});

//* GET ORDER PROPERTIES BY LOCK TYPE
export const useOtherOrderPropertiesByLockType = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByLockType(),
		url: '/other/order-properties/by/lock_type',
		refetchOnWindowFocus: false,
	});

//* GET ORDER PROPERTIES BY PULLER TYPE
export const useOtherOrderPropertiesByPullerType = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByPullerType(),
		url: '/other/order-properties/by/puller_type',
		refetchOnWindowFocus: false,
	});

//* GET ORDER PROPERTIES BY PULLER LINK
export const useOtherOrderPropertiesByPullerLink = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByPullerLink(),
		url: '/other/order-properties/by/puller_link',
		refetchOnWindowFocus: false,
	});

//* GET ORDER PROPERTIES BY COLOR
export const useOtherOrderPropertiesByColor = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByColor(),
		url: '/other/order-properties/by/color',
		refetchOnWindowFocus: false,
	});

//* GET ORDER PROPERTIES BY HAND
export const useOtherOrderPropertiesByHand = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByHand(),
		url: '/other/order-properties/by/hand',
		refetchOnWindowFocus: false,
	});

//* GET ORDER PROPERTIES BY NYLON STOPPER
export const useOtherOrderPropertiesByNylonStopper = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByNylonStopper(),
		url: '/other/order-properties/by/nylon_stopper',
		refetchOnWindowFocus: false,
	});

//* GET ORDER PROPERTIES BY SPECIAL REQUIREMENT
export const useOtherOrderPropertiesBySpecialRequirement = ({
	enabled = true,
} = {}) =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesBySpecialRequirement(),
		url: '/other/order-properties/by/special_requirement',
		refetchOnWindowFocus: false,
		enabled,
	});

//* GET ORDER PROPERTIES BY COLORING TYPE
export const useOtherOrderPropertiesByColoringType = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByColoringType(),
		url: '/other/order-properties/by/coloring_type',
		refetchOnWindowFocus: false,
	});

//* GET ORDER PROPERTIES BY SLIDER
export const useOtherOrderPropertiesBySlider = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesBySlider(),
		url: '/other/order-properties/by/slider',
		refetchOnWindowFocus: false,
	});

//* GET ORDER PROPERTIES BY TOP STOPPER
export const useOtherOrderPropertiesByTopStopper = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByTopStopper(),
		url: '/other/order-properties/by/top_stopper',
		refetchOnWindowFocus: false,
	});

//* GET ORDER PROPERTIES BY BOTTOM STOPPER
export const useOtherOrderPropertiesByBottomStopper = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByBottomStopper(),
		url: '/other/order-properties/by/bottom_stopper',
		refetchOnWindowFocus: false,
	});

//* GET ORDER PROPERTIES BY LOGO TYPE
export const useOtherOrderPropertiesByLogoType = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByLogoType(),
		url: '/other/order-properties/by/logo_type',
		refetchOnWindowFocus: false,
	});

//* GET ORDER PROPERTIES BY TEETH TYPE
export const useOtherOrderPropertiesByTeethType = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByTeethType(),
		url: '/other/order-properties/by/teeth_type',
		refetchOnWindowFocus: false,
	});

//*GET Vehicle Values
export const useOtherVehicle = () =>
	createGlobalState({
		queryKey: otherQK.vehicle(),
		url: '/other/delivery/vehicle/value/label',
	});

//*GET Carton Values
export const useOtherCarton = () =>
	createGlobalState({
		queryKey: otherQK.carton(),
		url: '/other/delivery/carton/value/label',
	});

export const useOtherCountLength = () =>
	createGlobalState({
		queryKey: otherQK.countLength(),
		url: `/other/thread/count-length/value/label`,
		refetchOnWindowFocus: false,
	});

//*GET ALl Zipper-Thread Order List
export const useAllZipperThreadOrderList = (query) =>
	createGlobalState({
		queryKey: otherQK.allZipperThreadOrderList(query),
		url: query
			? `/other/order/zipper-thread/value/label?${query}`
			: `/other/order/zipper-thread/value/label`,
		refetchOnWindowFocus: false,
	});
//* GET SHADE RECIPE
export const useOtherShadeRecipe = () =>
	createGlobalState({
		queryKey: otherQK.shadeRecipe(),
		url: `/other/lab-dip/shade-recipe/value/label`,
	});

//* GET RECIPE
export const useOtherRecipe = (query) =>
	createGlobalState({
		queryKey: otherQK.recipe(query),
		url: query
			? `/other/lab-dip/recipe/value/label?${query}`
			: `/other/lab-dip/recipe/value/label`,
	});
//* GET CHALLAN
export const useOtherChallan = (query) =>
	createGlobalState({
		queryKey: otherQK.challan(query),
		url: query
			? `/other/delivery/challan/value/label?${query}`
			: `/other/delivery/challan/value/label`,
	});

// TAPE-COIL
export const useOtherTapeCoil = () =>
	createGlobalState({
		queryKey: otherQK.tapeCoil(),
		url: `/other/tape-coil/value/label`,
	});

// * GET GIVEN URL DATA
export const useGetURLData = (url, { enabled = true } = {}) =>
	createGlobalState({
		queryKey: otherQK.getURLData(url),
		url: url,
		enabled,
	});

// * GET ALL MACHINES
export const useOtherMachines = () =>
	createGlobalState({
		queryKey: otherQK.machines(),
		url: '/other/machine/value/label',
	});

// * GET ALL MACHINES WITH SLOT
export const useOtherMachinesWithSlot = (param) =>
	createGlobalState({
		queryKey: otherQK.machinesWithSlot(param),
		url: `/other/machine-with-slot/value/label?production_date=${param}`,
		enabled: param ? true : false,
	});

// * GET RM
export const useOtherRM = (field = 'single-field', param) =>
	createGlobalState({
		queryKey: otherQK.rm(field, param),
		url: `/material/stock/by/${field}/${param}`,
	});

// * GET Order Entry By
export const useOtherOrderEntryBy = (uuid, isZipper, challanUuid) =>
	createGlobalState({
		queryKey: otherQK.orderEntryBy(uuid, isZipper, challanUuid),
		url: isZipper
			? `/delivery/zipper-order-entry/by/${uuid}?challan_uuid=${challanUuid}`
			: `/delivery/thread-order-entry/by/${uuid}?challan_uuid=${challanUuid}`,
		enabled: !!uuid,
	});

export const useOtherSectionMachine = () =>
	createGlobalState({
		queryKey: otherQK.sectionMachine(),
		url: '/other/maintain/section-machine/value/label',
	});

export const useOtherIssue = () =>
	createGlobalState({
		queryKey: otherQK.otherIssue(),
		url: '/other/maintain/issue/value/label',
	});


export const useSubscribe = () =>
	createGlobalState({
		queryKey: otherQK.subscribe(),
		url: '/public/subscribe',
	});
