/**
 *? Effective React Query Keys
 ** https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
 ** https://tkdodo.eu/blog/leveraging-the-query-function-context#query-key-factories
 **/

export const orderQK = {
	all: () => ['order'],

	// details
	details: () => [...orderQK.all(), 'details'],
	detail: (id) => [...orderQK.details(), id],

	// info
	infos: () => [...orderQK.all(), 'info'],
	info: (id) => [...orderQK.infos(), id],

	// buyers
	buyers: () => [...orderQK.all(), 'buyer'], // [order, buyer]
	buyer: (uuid) => [...orderQK.buyers(), uuid], // [order, buyer, uuid]

	// marketing
	marketings: () => [...orderQK.all(), 'marketing'],
	marketing: (uuid) => [...orderQK.marketings(), uuid],

	// marketing
	factories: () => [...orderQK.all(), 'factory'],
	factory: (uuid) => [...orderQK.factories(), uuid],

	// merchandisers
	merchandisers: () => [...orderQK.all(), 'merchandisers'],
	merchandiser: (uuid) => [...orderQK.merchandisers(), uuid],
	//Party
	party: () => [...orderQK.all(), 'party'],
	partyByUUID: (uuid) => [...orderQK.party(), uuid],
	//properties
	properties: () => [...orderQK.all(), 'properties'],
	propertiesByUUID: (uuid) => [...orderQK.party(), uuid],

	// info
	info: () => [...orderQK.all(), 'info'],
	infoByUUID: (uuid) => [...orderQK.info(), uuid],
};

export const adminQK = {
	all: () => ['admin'],

	// departments
	departments: () => [...adminQK.all(), 'departments'],
	department: (uuid) => [...adminQK.departments(), uuid],

	// designation
	designations: () => [...adminQK.all(), 'designations'],
	designation: (uuid) => [...adminQK.designations(), uuid],

	// users
	users: () => [...adminQK.all(), 'users'],
	user: (uuid) => [...adminQK.users(), uuid],
};

export const commercialQK = {
	all: () => ['commercial'],

	// bank
	banks: () => [...commercialQK.all(), 'bank'],
	bank: (uuid) => [...commercialQK.banks(), uuid],
};

export const materialQK = {
	all: () => ['material'],

	// section
	sections: () => [...materialQK.all(), 'sections'],
	section: (uuid) => [...materialQK.sections(), uuid],

	// types
	types: () => [...materialQK.all(), 'types'],
	type: (uuid) => [...materialQK.types(), uuid],
};

export const purchaseQK = {
	all: () => ['purchase'],

	// vendor
	vendors: () => [...purchaseQK.all(), 'vendors'],
	vendor: (uuid) => [...purchaseQK.vendors(), uuid],
};

//Library
export const libraryQK = {
	all: () => ['library'],
	// users
	users: () => [...libraryQK.all(), 'users'],
	userByUUID: (uuid) => [...libraryQK.users(), uuid],
	// policies
	policies: () => [...libraryQK.all(), 'policies'],
	policyByUUID: (uuid) => [...libraryQK.policies(), uuid],
};
