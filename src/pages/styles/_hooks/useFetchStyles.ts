import useNetwork from '@/stores/networkStore';
import { StyleType } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useFetchStyles = () => {
	const [searchParams] = useSearchParams();

	// const [styles, setStyles] = useState<StyleType[]>([]);
	const httpInterface = useNetwork((state) => state.httpInterface);

	const fetchQuery = () => {
		const params = new URLSearchParams(searchParams);

		// page 파라미터를 1 빼서 설정
		const page = params.get('page');
		if (page) {
			const adjustedPage = (parseInt(page, 10) - 1).toString();
			params.set('page', adjustedPage);
		}

		console.log(params);

		return params;
	};

	const { data, isLoading, isError } = useQuery({
		queryKey: ['styles', searchParams.toString()],
		queryFn: () => httpInterface.getStyles(fetchQuery()),
	});

	// useEffect(() => {
	// 	if (data?.data && Array.isArray(data.data.content)) {
	// 		setStyles(data.data.content);
	// 	}
	// 	console.log(data?.data.content);
	// }, [data]);

	return { data, isLoading, isError };
};
