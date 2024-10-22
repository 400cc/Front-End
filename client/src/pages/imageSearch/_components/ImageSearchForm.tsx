import { useEffect } from 'react';
import Card from '@/components/Card';
import ImageUpload from './ImageUpload';
import ImageFilters from '@/pages/imageSearch/_components/ImageFilters';
import ImageSearchResults from '@/pages/imageSearch/_components/ImageSearchResults';
import ErrorComponent from '@/components/ErrorComponent';
import ImageSearchResultsSkeleton from '@/components/skeleton/ImageSearchResultSkeleton';
import { useImageSearch } from '@/pages/imageSearch/_hooks/useImageSearch';

export default function ImageSearchForm() {
	const {
		preview,
		mallType,
		categoryList,
		offset,
		data,
		isLoading,
		isError,
		onDrop,
		handleMallTypeChange,
		handleCategoryChange,
		handleOffsetChange,
		handleSubmit,
		handleReset,
	} = useImageSearch();

	useEffect(() => {
		if (isLoading) {
			window.scrollTo({
				top: 800,
				behavior: 'smooth',
			});
		}
	}, [isLoading]);

	return (
		<>
			<Card>
				<h2 className="text-xl font-semibold mb-2">이미지 검색</h2>
				<p className="text-sm text-gray-600 mb-4">원하시는 스타일 이미지를 업로드 해주세요</p>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<ImageUpload onDrop={onDrop} preview={preview} />
					<ImageFilters
						mallType={mallType}
						categoryList={categoryList}
						offset={offset}
						handleMallTypeChange={handleMallTypeChange}
						handleCategoryChange={handleCategoryChange}
						handleOffsetChange={handleOffsetChange}
					/>
					<div></div>
					<div className="flex justify-end space-x-2">
						<button className="bg-gray-500 text-white px-4 py-2 rounded-lg" onClick={handleReset}>
							초기화
						</button>
						<button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={handleSubmit}>
							검색
						</button>
					</div>
				</div>
			</Card>
			{isLoading && <ImageSearchResultsSkeleton offset={offset} />}
			{isError && (
				<Card>
					<ErrorComponent />
				</Card>
			)}
			{!isLoading && data?.data && <ImageSearchResults data={data.data} />}
		</>
	);
}
