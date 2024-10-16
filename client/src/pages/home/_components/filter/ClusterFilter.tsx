import React, { useEffect, useState } from 'react';
import { MALL_TYPE_ID } from '@/constants/mallTypeId';
import useNetwork from '@/stores/networkStore';
import { CategoryType } from '@/pages/styles/_types/sidebarFilter.type';

interface ClusterFilterProps {
	mallType: string;
	categoryList: CategoryType[];
	offset: string;
	handleMallTypeChange: (mallType: string) => void;
	handleCategoryChange: (categoryId: string, name: string) => void;
	handleOffsetChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface Category {
	categoryId: string;
	name: string;
	children: Category[];
}

export default function ClusterFilter({
	mallType,
	categoryList,
	offset,
	handleMallTypeChange,
	handleCategoryChange,
	handleOffsetChange,
}: ClusterFilterProps) {
	const [activeFilter, setActiveFilter] = useState<string | null>(null);
	const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
	const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});

	const httpInterface = useNetwork((state) => state.httpInterface);

	const handleFilterButton = (e: React.MouseEvent<HTMLButtonElement>) => {
		const button = e.target as HTMLButtonElement;
		console.log('button.name', button.name);
		setActiveFilter((prev) => (prev === button.name ? null : button.name));
	};

	useEffect(() => {
		handleCategoryChange('', '');
		setActiveFilter(null);

		if (!mallType) return;
		httpInterface
			.getCategory(mallType)
			.then((res) => {
				setCategoryOptions(res.data);
				console.log('res.data', res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [mallType]);

	const toggleCategory = (categoryId: string) => {
		setExpandedCategories((prev) => ({
			...prev,
			[categoryId]: !prev[categoryId],
		}));
	};

	useEffect(() => {
		console.log('categoryList.length', categoryList);
	}, [categoryList]);

	const CategoryTreeView = (categoryOptions: Category[]) => {
		return (
			<ul className="pl-4">
				{categoryOptions.map((cat) => (
					<li key={cat.categoryId}>
						<div className="flex items-center">
							{cat.children.length === 0 && (
								<input
									type="checkbox"
									checked={
										cat.categoryId ===
										categoryList.find((category) => category.categoryId === cat.categoryId)?.categoryId
									}
									onChange={() => {
										handleCategoryChange(cat.categoryId, cat.name);
										setActiveFilter(null);
									}}
								/>
							)}
							<span className="ml-2 cursor-pointer" onClick={() => toggleCategory(cat.categoryId)}>
								{cat.name}
							</span>
							{cat.children.length > 0 && (
								<button
									className="ml-2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
									onClick={() => toggleCategory(cat.categoryId)}>
									{expandedCategories[cat.categoryId] ? '-' : '+'}
								</button>
							)}
						</div>
						{expandedCategories[cat.categoryId] && cat.children.length > 0 && CategoryTreeView(cat.children)}
					</li>
				))}
			</ul>
		);
	};

	return (
		<div className="p-6">
			<div className="mt-4">
				<label className="block text-lg font-medium text-gray-700 mb-2">쇼핑몰</label>
				<div className="relative">
					<button
						className={`${activeFilter === 'mallType' ? 'bg-[#0694a2] text-white' : 'bg-gray-100 text-gray-700'} rounded-full px-4 py-2 text-sm focus:outline-none hover:bg-[#057b85] hover:text-white flex items-center`}
						name="mallType"
						onClick={(e) => {
							handleFilterButton(e);
						}}>
						{mallType ? Object.keys(MALL_TYPE_ID).find((key) => MALL_TYPE_ID[key] === mallType) : '전체'}
						<svg
							className={`ml-2 w-5 h-5 pointer-events-none transition-transform ${activeFilter === 'mallType' ? 'transform rotate-180' : ''}`}
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
					{activeFilter === 'mallType' && (
						<div className="absolute left-0 mt-2 w-48 max-h-96 overflow-y-scroll bg-white shadow-lg rounded-lg p-4 z-10 transition-opacity duration-300 opacity-100">
							<p
								className={`text-gray-700 cursor-pointer hover:bg-gray-200 p-2 rounded`}
								onClick={() => {
									handleMallTypeChange('');
									setActiveFilter(null);
								}}>
								전체
							</p>
							{Object.keys(MALL_TYPE_ID).map((key) => (
								<p
									key={MALL_TYPE_ID[key]}
									className={`text-gray-700 cursor-pointer hover:bg-gray-200 p-2 rounded`}
									onClick={() => {
										handleMallTypeChange(MALL_TYPE_ID[key]);
										setActiveFilter(null);
									}}>
									{key}
								</p>
							))}
						</div>
					)}
				</div>
			</div>
			<div className="mt-4">
				<label className="block text-lg font-medium text-gray-700">카테고리</label>
				{!mallType && <span className="text-sm text-gray-500">쇼핑몰을 선택한 후 카테고리를 선택해주세요</span>}
				<div className="relative mt-3">
					<button
						className={`${activeFilter === 'category' ? 'bg-[#0694a2] text-white' : 'bg-gray-100 text-gray-700'} ${mallType === '' && 'cursor-not-allowed'} rounded-full px-4 py-2 text-sm focus:outline-none hover:bg-[#057b85] hover:text-white flex items-center`}
						name="category"
						onClick={(e) => {
							if (mallType === '') return;
							handleFilterButton(e);
						}}>
						{categoryList.length > 0 ? categoryList.map((category) => category.name).join(', ') : '전체'}

						<svg
							className={`ml-2 w-5 h-5 transition-transform pointer-events-none ${activeFilter === 'category' ? 'transform rotate-180' : ''}`}
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

					{mallType !== '' && activeFilter === 'category' && (
						<div className="absolute left-0 mt-2 w-48 max-h-96 overflow-y-scroll bg-white shadow-lg rounded-lg p-4 z-10 transition-opacity duration-300 opacity-100">
							{CategoryTreeView(categoryOptions)}
						</div>
					)}
				</div>
			</div>
			<div className="mt-5">
				<label className="block mb-2 text-md font-medium text-gray-700">클러스터링 군집 수</label>
				<input
					type="number"
					min="1"
					placeholder="분류할 군집의 개수를 선택해주세요."
					className="mt-1 block pl-3 py-2 text-base bg-gray-100 border-gray-300  focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl"
					value={offset}
					onChange={handleOffsetChange}
				/>
			</div>
		</div>
	);
}
