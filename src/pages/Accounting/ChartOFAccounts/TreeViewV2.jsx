import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

// Utility function to flatten tree data for Tree display
const flattenTreeData = (
	data,
	level = 0,
	parentPath = '',
	expandedItems = new Set()
) => {
	if (!data) return [];

	const flattened = [];

	data.forEach((node, index) => {
		const currentPath = parentPath
			? `${parentPath}.${index}`
			: String(index);

		const flatNode = {
			id: node.id || currentPath,
			name: node.name || '',
			account_type: node.account_type || '',
			account_tag: node.account_tag || '',
			level,
			path: currentPath,
			hasChildren: Boolean(node.children && node.children.length > 0),
			isExpanded: expandedItems.has(currentPath),
			parentPath,
			originalNode: node,
		};

		flattened.push(flatNode);

		// Add children if this node is expanded
		if (node.children && expandedItems.has(currentPath)) {
			const childrenFlattened = flattenTreeData(
				node.children,
				level + 1,
				currentPath,
				expandedItems
			);
			flattened.push(...childrenFlattened);
		}
	});

	return flattened;
};

// Tree Row Component
const TreeRow = ({ item, onToggleExpand }) => {
	const handleToggle = () => {
		if (item.hasChildren) {
			onToggleExpand(item.path);
		}
	};

	return (
		<tr className='border border-base-300 transition-colors'>
			<td className='px-1 py-2'>
				<div
					className='flex items-center gap-2'
					style={{ paddingLeft: `${item.level * 24}px` }}
				>
					<div className='flex h-4 w-4 flex-shrink-0 items-center justify-center'>
						{item.hasChildren ? (
							<button
								onClick={handleToggle}
								className='rounded p-0.5 transition-colors hover:bg-base-300'
								aria-label={
									item.isExpanded ? 'Collapse' : 'Expand'
								}
							>
								{item.isExpanded ? (
									<ChevronDown className='h-3 w-3 text-primary' />
								) : (
									<ChevronRight className='h-3 w-3 text-primary' />
								)}
							</button>
						) : (
							<div className='h-1 w-1 rounded-full bg-accent'></div>
						)}
					</div>
					<span
						className={`text-sm font-medium capitalize text-base-content ${
							item.hasChildren ? 'cursor-pointer' : ''
						}`}
						onClick={handleToggle}
					>
						{item.name}
					</span>
				</div>
			</td>
			<td className='px-4 py-3 capitalize'>
				{item.account_type && item.account_type}
			</td>
			<td className='px-4 py-3'>
				{item.account_tag && item.account_tag}
			</td>
		</tr>
	);
};

// Main Tree Component - Updated to accept accountData prop for search
const TreeViewV2 = ({ expandAll, accountData }) => {
	const [expandedItems, setExpandedItems] = useState(new Set());

	// Memoized flattened data - now uses prop accountData instead of query
	const flattenedData = useMemo(() => {
		if (!accountData) return [];
		return flattenTreeData(accountData, 0, '', expandedItems);
	}, [accountData, expandedItems]);

	// Get all expandable paths - now uses prop accountData
	const getAllExpandablePaths = useMemo(() => {
		if (!accountData) return new Set();

		const allPaths = new Set();
		const collectPaths = (data, parentPath = '') => {
			data.forEach((node, index) => {
				const currentPath = parentPath
					? `${parentPath}.${index}`
					: String(index);
				if (node.children && node.children.length > 0) {
					allPaths.add(currentPath);
					collectPaths(node.children, currentPath);
				}
			});
		};
		collectPaths(accountData);
		return allPaths;
	}, [accountData]);

	// Handle individual item toggle
	const handleToggleExpand = (path) => {
		setExpandedItems((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(path)) {
				newSet.delete(path);
			} else {
				newSet.add(path);
			}
			return newSet;
		});
	};

	// ONLY handle expandAll prop changes - no feedback to parent
	useEffect(() => {
		if (expandAll) {
			setExpandedItems(new Set(getAllExpandablePaths));
		} else {
			setExpandedItems(new Set());
		}
	}, [expandAll, getAllExpandablePaths]);

	// Show loading only if no accountData is provided (fallback)
	if (!accountData) {
		return (
			<div className='flex w-full justify-center p-4'>
				<span className='loading loading-spinner loading-lg'></span>
			</div>
		);
	}

	return (
		<div className='w-full'>
			<div className='overflow-x-auto'>
				<table className='Tree w-full'>
					<thead>
						<tr className='border-2 border-base-300'>
							<th className='px-4 py-3 text-left text-sm font-semibold text-base-content'>
								Account Name
							</th>
							<th className='px-4 py-3 text-left text-sm font-semibold text-base-content'>
								Type
							</th>
							<th className='px-4 py-3 text-left text-sm font-semibold text-base-content'>
								Tag
							</th>
						</tr>
					</thead>
					<tbody>
						{flattenedData.map((item) => (
							<TreeRow
								key={item.path}
								item={item}
								onToggleExpand={handleToggleExpand}
							/>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default TreeViewV2;
