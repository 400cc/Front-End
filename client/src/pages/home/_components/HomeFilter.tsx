import React, { useEffect, useState } from 'react';
import useNetwork from '@/stores/networkStore';
import { MALL_TYPE_ID } from '@/constants/mallTypeId';
import { CategoryType } from '@/pages/styles/_types/sidebarFilter.type';

import Card from '@/components/Card';
import FilterButton from '@/pages/home/_components/filter/FilterButton';

import { useSetSearchParams } from '@/pages/home/_hooks/useSetSearchParams';
import { useSyncQueryParams } from '../_hooks/useSyncQueryParams';
import '@/styles/custom.css';

interface SelectedFilters {
	mallTypeId: string;
	category: CategoryType[];
	startDate: string;
	endDate: string;
	[key: string]: string | CategoryType[] | null;
}

export default function HomeFilter() {
	const [activeFilter, setActiveFilter] = useState<string | null>(null);
	const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
		mallTypeId: null,
		category: [],
		startDate: null,
		endDate: null,
	});
	const [categoryOptions, setCategoryOptions] = useState<string[]>([]);

	const httpInterface = useNetwork((state) => state.httpInterface);

	useSyncQueryParams(setSelectedFilters);
	useSetSearchParams(selectedFilters);

	const toggleDropdown = (filterName: string) => {
		setActiveFilter((prev) => (prev === filterName ? null : filterName));
	};

	const applyFilter = (filterKey: string, value: any) => {
		if (filterKey === 'category') {
			setSelectedFilters((prev) => {
				const isSelected = (prev.category ?? []).some((category: any) => category.categoryId === value.categoryId);
				const newCategories = isSelected
					? (prev.category as any[]).filter((category) => category.categoryId !== value.categoryId)
					: [...(prev.category ?? []), value];
				return { ...prev, category: newCategories };
			});
		} else if (filterKey === 'mallTypeId') {
			setSelectedFilters((prev) => ({ ...prev, [filterKey]: value, category: [] }));
		} else {
			setSelectedFilters((prev) => ({ ...prev, [filterKey]: value }));
		}
		setActiveFilter(null); // Close the dropdown after applying filter
	};

	// const removeFilter = (filterKey: string, value?: string) => {
	// 	if (filterKey === 'category' && value) {
	// 		setSelectedFilters((prev) => ({
	// 			...prev,
	// 			category: (prev.category ?? []).filter((category) => category !== value),
	// 		}));
	// 	} else {
	// 		setSelectedFilters((prev) => ({ ...prev, [filterKey]: null }));
	// 	}
	// };

	useEffect(() => {
		if (!selectedFilters.mallTypeId) return;

		httpInterface
			.getCategory(selectedFilters.mallTypeId)
			.then((res) => {
				setCategoryOptions(res.data);
				selectedFilters.category = [];
				console.log(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [selectedFilters.mallTypeId]);

	return (
		<Card className="bg-white col-span-2 xl:col-span-2 2xl:col-span-3  p-4 flex items-center justify-between space-y-2 md:space-y-0">
			<div className="w-full md:w-auto flex items-center space-x-4">
				<FilterButton
					filterName="Mall"
					filterKey="mallTypeId"
					activeFilter={activeFilter}
					toggleDropdown={toggleDropdown}
					applyFilter={applyFilter}
					options={Object.keys(MALL_TYPE_ID)}
					isMultiSelect={false}
					selectedFilters={selectedFilters}
				/>
				<FilterButton
					filterName="Category"
					filterKey="category"
					activeFilter={activeFilter}
					toggleDropdown={toggleDropdown}
					applyFilter={applyFilter}
					options={categoryOptions}
					isMultiSelect={true}
					selectedFilters={selectedFilters}
				/>
				<FilterButton
					filterName="Start Date"
					filterKey="startDate"
					activeFilter={activeFilter}
					toggleDropdown={toggleDropdown}
					applyFilter={applyFilter}
					options={[]}
					isMultiSelect={false}
					selectedFilters={selectedFilters}
				/>
				<FilterButton
					filterName="End Date"
					filterKey="endDate"
					activeFilter={activeFilter}
					toggleDropdown={toggleDropdown}
					applyFilter={applyFilter}
					options={[]}
					isMultiSelect={false}
					selectedFilters={selectedFilters}
				/>
			</div>
			{/* <FilterTags selectedFilters={selectedFilters} removeFilter={removeFilter} /> */}
		</Card>
	);
}
