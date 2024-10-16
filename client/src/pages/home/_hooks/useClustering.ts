import { useEffect, useState } from 'react';

import { useClusterFilter } from './useClusterFilter';
import { useFetchClustering } from './useFetchClustering';

export const useClustering = () => {
	const { mallType, categoryList, offset, handleMallTypeChange, handleCategoryChange, handleOffsetChange } =
		useClusterFilter();
	const [shouldFetch, setShouldFetch] = useState(false);

	const { data, isLoading, isError } = useFetchClustering(
		mallType,
		categoryList,
		Number(offset),
		shouldFetch,
		setShouldFetch,
	);

	const handleSubmit = () => {
		// 검색 파라미터가 모두 선택되었는지 확인
		const offsetInt = parseInt(offset);
		if (!mallType || !categoryList.length) {
			return alert('Mall 타입과 카테고리를 선택해주세요.');
		}
		if (offsetInt < 3 || offsetInt % 2 !== 0) {
			return alert('군집의 수는 3 이상의 홀수로 입력해주세요.');
		}

		// 검색 API 호출 (여기서는 useFetchClustering 내부에서 이미 data를 가져오고 있으니 단순 상태 변경으로 충분)
		console.log(`검색 요청 중: MallType - ${mallType}, CategoryList - ${categoryList}, Offset - ${offset}`);

		setShouldFetch(true);
		// 필요하다면 추가적인 API 호출을 여기서 처리할 수 있습니다.
		// 예시로는 검색 조건을 다시 세팅하는 로직을 넣을 수도 있습니다.
	};

	const handleReset = () => {
		handleMallTypeChange('');
		handleCategoryChange('', '');
		handleOffsetChange({ target: { value: '3' } } as React.ChangeEvent<HTMLInputElement>);
	};

	return {
		mallType,
		categoryList,
		offset,
		data,
		isLoading,
		isError,
		handleMallTypeChange,
		handleCategoryChange,
		handleOffsetChange,
		handleSubmit,
		handleReset,
	};
};
