export const formatPriceRange = (range: string) => {
	// 범위를 '-'로 구분하여 나누고, max 값이 없는 경우 처리
	const [min, max] = range.split('-').map((num) => parseInt(num, 10).toLocaleString());

	// max 값이 없는 경우(즉, 10000000+)
	if (!max) {
		return `${min}원 +`; // min 값 뒤에 '원 +' 붙여서 출력
	}

	return `${min}~${max}원`;
};