import useNetwork from '@/stores/networkStore';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';

export const useFetchPriceTrend = () => {
	const [searchParams] = useSearchParams();

	const httpInterface = useNetwork((state) => state.httpInterface);

	const mallTypeId = searchParams.get('mallTypeId');

	const fetchQuery = () => {
		const params = new URLSearchParams(searchParams);

		return params;
	};

	const { data, isLoading, isError } = useQuery({
		queryKey: ['priceTrend', fetchQuery().toString()],
		queryFn: () => {
			return httpInterface.getPriceTrend(fetchQuery());
		},
		enabled: !!mallTypeId,
	});

	return { data, isLoading, isError };
};
