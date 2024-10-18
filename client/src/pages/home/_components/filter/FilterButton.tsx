import React, { useState } from 'react';
import { MALL_TYPE_ID } from '@/constants/mallTypeId';
import { CategoryType } from '@/pages/styles/_types/sidebarFilter.type';

interface FilterButtonProps {
	filterName: string;
	filterKey: string;
	activeFilter: string | null;
	toggleDropdown: (filterName: string) => void;
	applyFilter: (filterKey: string, value: any) => void;
	options: any[];
	isMultiSelect: boolean;
	selectedFilters: { [key: string]: string | CategoryType[] | null };
}

const FilterButton: React.FC<FilterButtonProps> = ({
	filterName,
	filterKey,
	activeFilter,
	toggleDropdown,
	applyFilter,
	options,
	isMultiSelect,
	selectedFilters,
}) => {
	const selectedFilter = selectedFilters[filterKey];
	const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

	const toggleCategory = (categoryId: number) => {
		setExpandedCategories((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(categoryId)) {
				newSet.delete(categoryId);
			} else {
				newSet.add(categoryId);
			}
			return newSet;
		});
	};

	const handleCategoryChange = (category: any) => {
		const idValue = category.categoryId.toString();
		applyFilter(filterKey, { categoryId: idValue, name: category.name });
	};

	const renderCategories = (categories: any[]) => {
		console.log(categories);

		return (
			<ul className="pl-4">
				{categories.map((category) => (
					<li key={category.categoryId}>
						<div className="flex items-center">
							<input
								type="checkbox"
								checked={(selectedFilter as any[]).some((cat) => cat.categoryId == category.categoryId)}
								onChange={() => handleCategoryChange(category)} // 전체 category 객체 전달
							/>
							<span className="ml-2 cursor-pointer" onClick={() => toggleCategory(category.categoryId)}>
								{category.name}
							</span>
							{category.children.length > 0 && (
								<button
									className="ml-2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
									onClick={() => toggleCategory(category.categoryId)}>
									{expandedCategories.has(category.categoryId) ? '-' : '+'}
								</button>
							)}
						</div>
						{expandedCategories.has(category.categoryId) && renderCategories(category.children)}
					</li>
				))}
			</ul>
		);
	};

	const displayText = () => {
		if (isMultiSelect && Array.isArray(selectedFilter) && selectedFilter.length > 0) {
			// 카테고리의 경우 name 필드를 보여줌
			if (filterKey === 'category') {
				return selectedFilter.map((cat: any) => cat.name).join(', ');
			}
			return selectedFilter.join(', ');
		}
		if (!isMultiSelect && selectedFilter) {
			if (filterKey === 'startDate' || filterKey === 'endDate') {
				return (selectedFilter as string).split('T')[0]; // Display date in YYYY-MM-DD format
			}
			return (
				options.find((option) => MALL_TYPE_ID[option as keyof typeof MALL_TYPE_ID] === selectedFilter) || filterName
			);
		}
		return filterName;
	};

	const handleApplyFilter = (filterKey: string, value: string) => {
		const idValue = MALL_TYPE_ID[value as keyof typeof MALL_TYPE_ID] || value;
		applyFilter(filterKey, idValue);
	};

	return (
		<div className="relative">
			<button
				className={`${
					activeFilter === filterName ? 'bg-[#0694a2] text-white' : 'bg-gray-100 text-gray-700'
				} rounded-full px-4 py-2 text-sm focus:outline-none hover:bg-[#057b85] hover:text-white flex items-center`}
				onClick={() => toggleDropdown(filterName)}>
				{displayText()}
				<svg
					className={`ml-2 w-5 h-5 transition-transform ${activeFilter === filterName ? 'transform rotate-180' : ''}`}
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor">
					<path
						fillRule="evenodd"
						d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
						clipRule="evenodd"
					/>
				</svg>
			</button>
			{activeFilter === filterName && (
				<div className="absolute left-0 mt-2 w-48 max-h-96 overflow-y-scroll bg-white shadow-lg rounded-lg p-4 z-10 transition-opacity duration-300 opacity-100">
					{filterName === 'Category' ? (
						renderCategories(options)
					) : filterKey === 'startDate' || filterKey === 'endDate' ? (
						<input
							type="date"
							className="w-full border rounded p-2"
							value={selectedFilter as string}
							onChange={(e) => handleApplyFilter(filterKey, e.target.value)}
						/>
					) : (
						options.map((option) => (
							<p
								key={option}
								className={`text-gray-700 cursor-pointer hover:bg-gray-200 p-2 rounded ${isMultiSelect && 'hover:bg-gray-300'}`}
								onClick={() => handleApplyFilter(filterKey, option)}>
								{option}
							</p>
						))
					)}
				</div>
			)}
		</div>
	);
};

export default FilterButton;
