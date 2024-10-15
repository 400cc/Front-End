import { useEffect, useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import Loading from '@/components/Loading';
import React from 'react';
import { ClusterNodeType } from '@/pages/home/_types/clusterData.type';
import { useFetchClusterDetail } from '../../_hooks/useFetchClusterDetail';
import ApexCharts from 'apexcharts';

interface ClusteringChartProps {
	data: ClusterNodeType[];
	isLoading: boolean;
	isError: boolean;
}

function DefaultView() {
	return (
		<div className="flex flex-col justify-center items-center h-96">
			<h2 className="text-lg font-bold mb-4">클러스터링 데이터를 검색해 주세요</h2>
			<p className="text-gray-600">데이터를 선택하여 클러스터링 분석을 시작할 수 있습니다.</p>
		</div>
	);
}

const skeletonStyle = `
	display: block;
	width: 96px;
	height: 144px;
	background-color: #e0e0e0;
	border-radius: 8px;
`;

const ClusteringChart = React.memo(function ClusteringChart({ data, isLoading, isError }: ClusteringChartProps) {
	const [hoveredStyleId, setHoveredStyleId] = useState<string | null>(null);
	const [hoveredMallTypeId, setHoveredMallTypeId] = useState<string | null>(null);

	const { DetailData, DetailIsLoading } = useFetchClusterDetail(hoveredMallTypeId || '', hoveredStyleId || '');

	// 차트 ID 설정
	const chartId = 'clustering-chart';

	// 툴팁 내용을 업데이트하는 useEffect
	useEffect(() => {
		console.log(DetailData);
		if (DetailData && hoveredStyleId && hoveredMallTypeId) {
			// ApexCharts.exec를 사용해 차트 옵션 업데이트
			ApexCharts.exec(
				chartId,
				'updateOptions',
				{
					tooltip: {
						custom: function ({ series, seriesIndex, dataPointIndex, w }) {
							const data = w.config.series[seriesIndex].data[dataPointIndex];
							return `
							<div class="tooltip-box p-10">
								<div class="image-wrapper" style="position: relative; width: 96px; height: 144px;">
									<!-- 스켈레톤 UI -->
									<div class="skeleton" style="${skeletonStyle}"></div>
									<!-- 실제 이미지 -->
									<img class="lazy-image w-24 h-[144px] object-cover" 
										src="${data.imageURL}" 
										alt="style Image" 
										style="position: absolute; top: 0; left: 0; display: none;" 
										onload="this.style.display='block'; this.previousElementSibling.style.display='none';" />
								</div>
								<strong>상품 이름:</strong> ${DetailData?.styleName} <br/>
								<strong>브랜드:</strong> ${DetailData?.brand || '브랜드 정보 없음'} <br/>
								<strong>고정가:</strong> ${DetailData?.fixedPrice || '고정가 정보 없음'} <br/>
								<strong>할인가:</strong> ${DetailData?.discountedPrice || '할인가 정보 없음'} <br/>
							</div>
						`;
						},
					},
				},
				false,
				false,
			);
		}
	}, [DetailData]);

	const handleHoverDebounced = useMemo(
		() => (mallTypeId: string, styleId: string) => {
			setHoveredMallTypeId(mallTypeId);
			setHoveredStyleId(styleId);
		},
		[],
	);

	const series = useMemo(() => {
		return data?.reduce(
			(acc, curr) => {
				const point = {
					styleId: curr.styleId,
					cluster: curr.cluster,
					imageURL: curr.imageURL,
					mallTypeId: curr.mallTypeId,
					x: curr.x,
					y: curr.y,
				};

				if (acc[curr.cluster]) {
					acc[curr.cluster].data.push(point);
				} else {
					acc[curr.cluster] = {
						name: `Cluster ${curr.cluster}`,
						data: [point],
					};
				}

				return acc;
			},
			[] as { name: string; data: any[] }[],
		);
	}, [data]);

	const options = useMemo(() => {
		return {
			chart: {
				id: chartId,
				height: 350,
				type: 'scatter' as const,
				zoom: {
					enabled: true,
					type: 'xy' as const,
				},
				events: {
					dataPointSelection: function (event, chartContext, config) {
						const data = config.w.config.series[config.seriesIndex].data[config.dataPointIndex];
						window.open(`/style/detail/${data.mallTypeId}/${data.styleId}`);
					},
					dataPointMouseEnter: function (event, chartContext, config) {
						const data = config.w.config.series[config.seriesIndex].data[config.dataPointIndex];
						handleHoverDebounced(data.mallTypeId, data.styleId);
					},
					dataPointMouseLeave: function () {
						setHoveredStyleId(null);
						setHoveredMallTypeId(null);
					},
				},
			},
			tooltip: {
				custom: function ({ series, seriesIndex, dataPointIndex, w }) {
					const data = w.config.series[seriesIndex].data[dataPointIndex];
					return `
						<div class="tooltip-box p-10">
							<div class="image-wrapper" style="position: relative; width: 96px; height: 144px;">
								<div class="skeleton" style="${skeletonStyle}"></div>
								<img class="lazy-image w-24 h-[144px] object-cover" 
									src="${data.imageURL}" 
									alt="style Image" 
									style="position: absolute; top: 0; left: 0; display: none;" 
									onload="this.style.display='block'; this.previousElementSibling.style.display='none';" />
							</div>
							<strong>상품 이름:</strong> 로딩 중... <br/>
						</div>
					`;
				},
			},
			xaxis: {
				tickAmount: 10,
				labels: {
					formatter: function (val) {
						return parseFloat(val).toFixed(1);
					},
				},
			},
			yaxis: {
				tickAmount: 7,
			},
		};
	}, []);

	// 에러, 로딩, 데이터가 없을 때 처리
	if (isLoading) {
		return <Loading />;
	}

	if (!data || data.length === 0) {
		return <DefaultView />;
	}

	if (isError) {
		return (
			<div className="flex justify-center items-center h-96">
				<p className="text-red-500">데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요.</p>
			</div>
		);
	}

	// 차트 렌더링
	return (
		<div className="flex justify-center w-full mt-6">
			<div className="w-full">
				<Chart options={options} series={series} type="scatter" height={570} width="100%" />
			</div>
		</div>
	);
});

export default ClusteringChart;
