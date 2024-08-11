import { AdminRoutes } from "./Admin";
import { CommercialRoutes } from "./Commercial";
import { CommonRoutes } from "./Common";
import { DashboardRoutes } from "./Dashboard";
import { DeliveryRoutes } from "./Delivery";
import { DyeingAndIronRoutes } from "./DyeingAndIron";
import { IssueRoutes } from "./Issue";
import { LibraryRoutes } from "./Library";
import { MetalRoutes } from "./Metal";
import { NylonRoutes } from "./Nylon";
import { OrderRoutes } from "./Order";
import { ReportRoutes } from "./Report";
import { SliderRoutes } from "./Slider";
import { StoreRoutes } from "./Store";
import { ThreadRoutes } from "./Thread";
import { VislonRoutes } from "./Vislon";

const PRIVATE_ROUTES = [
	...DashboardRoutes,
	...AdminRoutes,
	...StoreRoutes,
	...IssueRoutes,
	...ReportRoutes,
	...CommonRoutes,
	...OrderRoutes,
	...MetalRoutes,
	...NylonRoutes,
	...VislonRoutes,
	...SliderRoutes,
	...DyeingAndIronRoutes,
	...LibraryRoutes,
	...DeliveryRoutes,
	...CommercialRoutes,
	...ThreadRoutes,
];

function FilteredRoutes() {
	const can_access = localStorage.getItem("can_access");

	if (String(can_access).length < 3) return [];

	const user_access = JSON.parse(JSON.parse(can_access)) || {};

	const filteredRoutes = PRIVATE_ROUTES.filter(
		({ page_name }) =>
			page_name === "admin__public" ||
			(page_name !== undefined &&
				user_access[page_name]?.includes("read"))
	);

	

	// return filteredRoutes;
	return PRIVATE_ROUTES;
}

export { FilteredRoutes, PRIVATE_ROUTES };
