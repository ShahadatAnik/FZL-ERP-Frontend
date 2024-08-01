import ReactTable from "@/components/Table";
import { useAccess, useFetchFunc } from "@/hooks";

import { Suspense } from "@/components/Feedback";
import { DeleteModal } from "@/components/Modal";
import { DateTime, EditDelete } from "@/ui";
import PageInfo from "@/util/PageInfo";
import { useEffect, useMemo, useState } from "react";
import RMAddOrUpdate from "./RMAddOrUpdate";

export default function Index() {
	const info = new PageInfo(
		"RM Assembly Log",
		"material/used/by/slider_assembly"
	);
	const [assembly, setAssembly] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const haveAccess = useAccess("slider__assembly_log");

	const columns = useMemo(
		() => [
			{
				accessorKey: "material_name",
				header: "Material Name",
				enableColumnFilter: false,
				cell: (info) => (
					<span className="capitalize">{info.getValue()}</span>
				),
			},
			{
				accessorKey: "section",
				header: "Section",
				enableColumnFilter: false,
				cell: (info) => {
					return (
						<span className="capitalize">
							{info.getValue()?.replace(/_|n_/g, " ")}
						</span>
					);
				},
			},
			{
				accessorKey: "used_quantity",
				header: "Used QTY",
				enableColumnFilter: false,
				cell: (info) => (
					<span className="capitalize">{info.getValue()}</span>
				),
			},
			{
				accessorKey: "wastage",
				header: "Wastage",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "unit",
				header: "Unit",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "issued_by_name",
				header: "Issued By",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "remarks",
				header: "Remarks",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "created_at",
				header: "Created",
				filterFn: "isWithinRange",
				enableColumnFilter: false,
				width: "w-24",
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: "updated_at",
				header: "Updated",
				enableColumnFilter: false,
				width: "w-24",
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: "actions",
				header: "Actions",
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes("click_update_rm"),
				width: "w-24",
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showDelete={haveAccess.includes("click_delete_rm")}
						/>
					);
				},
			},
		],
		[assembly]
	);

	// Update
	const [updateAssembly, setUpdateAssembly] = useState({
		id: null,
		section: null,
		material_name: null,
		slider_assembly: null,
		used_quantity: null,
		unit: null,
	});

	const handelUpdate = (idx) => {
		const selected = assembly[idx];
		setUpdateAssembly((prev) => ({
			...prev,
			...selected,
		}));
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Delete
	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});
	const handelDelete = (idx) => {
		setDeleteItem((prev) => ({
			...prev,
			itemId: assembly[idx].id,
			itemName: assembly[idx].material_name
				.replace(/#/g, "")
				.replace(/\//g, "-"),
		}));

		window[info.getDeleteModalId()].showModal();
	};

	// Fetching data from server
	useEffect(() => {
		useFetchFunc(info.getFetchUrl(), setAssembly, setLoading, setError);
	}, []);

	if (loading)
		return <span className="loading loading-dots loading-lg z-50" />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className="container mx-auto px-2 md:px-4">
			<ReactTable
				title={info.getTitle()}
				data={assembly}
				columns={columns}
				extraClass="py-2"
			/>
			<Suspense>
				<RMAddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setAssembly,
						updateAssembly,
						setUpdateAssembly,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={setAssembly}
					uri={`/material/used`}
				/>
			</Suspense>
		</div>
	);
}
