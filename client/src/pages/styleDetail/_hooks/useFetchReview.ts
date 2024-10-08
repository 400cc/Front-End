import useNetwork from '@/stores/networkStore';
import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router-dom';

export const useFetchReview = () => {
	const [searchParams] = useSearchParams();
	const { mallTypeId, styleId } = useParams<{ mallTypeId: string; styleId: string }>();

	const page = searchParams.get('page') || '1'; // 기본값 설정
	const startDate = searchParams.get('startDate') || ''; // 기본값 설정
	const rate = searchParams.getAll('rate');

	// console.log(`mallTypeId: ${mallTypeId}, styleId: ${styleId}, page: ${page}, startDate: ${startDate}, rate: ${rate}`);

	const httpInterface = useNetwork((state) => state.httpInterface);

	const { data, isLoading, isError } = useQuery({
		queryKey: ['styleReview', mallTypeId, styleId, page, startDate, rate],
		queryFn: () => {
			if (mallTypeId && styleId) {
				return httpInterface.getStyleReview(mallTypeId, styleId, page, startDate, rate);
			}
			return Promise.reject('Required parameters are missing');
		},
		enabled: !!mallTypeId && !!styleId, // mallType과 styleId가 존재할 때만 쿼리 실행
	});

	return { data, isLoading, isError };
};
