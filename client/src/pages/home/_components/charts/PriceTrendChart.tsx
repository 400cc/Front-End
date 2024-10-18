import Chart from 'react-apexcharts';
import { formatPriceRange } from '@/pages/home/_utils/formatPriceRange.ts';
import { PriceTrendDataType } from '@/pages/home/_types/priceTrendData.type.ts';

interface PriceTrendChartProps {
	data: PriceTrendDataType;
}

export default function PriceTrendChart({ data }: PriceTrendChartProps) {
	const formattedCategories = Object.keys(data.data).map(formatPriceRange);
	const series = [
		{
			name: 'Style Count',
			data: Object.values(data.data),
			color: '#0694a2',
		},
	];

	const options = {
		chart: {
			type: 'bar' as const,
			fontFamily: 'Inter, sans-serif',
			foreColor: '#6B7280',
			toolbar: {
				show: false,
			},
		},
		grid: {
			// show: false,
		},
		plotOptions: {
			bar: {
				horizontal: false,
				dataLabels: {
					position: 'top', // 값을 막대 위에 표시
				},
			},
		},
		dataLabels: {
			enabled: true,
			formatter: (val: number) => `${val.toLocaleString()}개`,
			offsetY: -20, // 값의 y축 위치 조정
			style: {
				fontSize: '12px',
				colors: ['#6B7280'],
			},
		},

		tooltip: {
			style: {
				fontSize: '14px',
				fontFamily: 'Inter, sans-serif',
			},
		},
		xaxis: {
			categories: formattedCategories,
			labels: {
				rotate: -45,
				style: {
					colors: ['#6B7280'],
					fontSize: '14px',
					fontWeight: 500,
				},
				formatter: (value: string) => value + ' 원',
			},
			axisBorder: {
				color: '#F3F4F6',
			},
			axisTicks: {
				color: '#F3F4F6',
			},
		},
		yaxis: {
			labels: {
				style: {
					colors: '#6B7280',
					fontSize: '14px',
					fontWeight: 500,
				},
				formatter: (val: number) => `${val.toLocaleString()}`,
			},
		},
		responsive: [
			{
				breakpoint: 1024,
				options: {
					xaxis: {
						labels: {
							show: false,
						},
					},
				},
			},
		],
		// title: {
		// 	text: '가격대별 상품 수',
		// 	align: 'center' as const,
		// },
	};

	return (
		<div className="flex justify-center w-full">
			<div className="w-full">
				<Chart options={options} series={series} type="bar" height={570} width="100%" />
			</div>
		</div>
	);
}
