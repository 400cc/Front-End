import { useFileUpload } from '@/pages/imageSearch/_hooks/useFileUpload';
import { useFilters } from '@/pages/imageSearch/_hooks/useFilters';
import { useEffect, useState } from 'react';
import { useFetchSimilarImage } from './useFetchSimilarImage';

export const useImageSearch = () => {
	const { formData, preview, setPreview, setFormData, onDrop } = useFileUpload();
	const { mallType, category, offset, handleMallTypeChange, handleCategoryChange, handleOffsetChange } = useFilters();
	const [shouldFetch, setShouldFetch] = useState(false);
	const { data, isLoading, isError } = useFetchSimilarImage(formData, shouldFetch, setShouldFetch);

	useEffect(() => {
		if (formData) {
			formData.set('category', category.categoryId.toString());
			formData.set('offset', offset);
		}
	}, [category, offset, formData]);

	const handleSubmit = () => {
		if (formData) {
			window.scrollTo({
				top: 800,
				behavior: 'smooth',
			});
			setShouldFetch(true);
		} else {
			alert('이미지를 업로드 해주세요');
		}
	};

	const handleReset = () => {
		setFormData(null);
		setShouldFetch(false);
		setPreview(null);
		handleMallTypeChange('');
		handleCategoryChange('', '');
		handleOffsetChange({ target: { value: '5' } } as React.ChangeEvent<HTMLInputElement>);
	};

	return {
		preview,
		mallType,
		category,
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
	};
};