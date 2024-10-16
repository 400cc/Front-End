import { CategoryType } from '@/pages/styles/_types/sidebarFilter.type';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useSetSearchParams = (selectedFilters: { [key: string]: string | CategoryType[] }) => {
	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		const newSearchParams = new URLSearchParams();

		// 카테고리 필드 삭제
		newSearchParams.delete('category');

		Object.keys(selectedFilters).forEach((key) => {
			const value = selectedFilters[key];

			if (Array.isArray(value)) {
				// CategoryType[] 처리
				if (key === 'category' && value.length > 0 && typeof value[0] === 'object') {
					(value as CategoryType[]).forEach((category) => {
						newSearchParams.append('category', String(category.categoryId)); // categoryId로 URL 파라미터 설정
					});
				}
			} else if (value !== null && value !== undefined) {
				newSearchParams.set(key, value as string); // value가 string일 때만 설정
			} else {
				newSearchParams.delete(key); // null or undefined 일 경우 필터 삭제
			}
		});

		setSearchParams(newSearchParams);
	}, [selectedFilters, setSearchParams]);
};
