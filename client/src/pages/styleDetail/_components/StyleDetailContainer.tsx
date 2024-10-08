export default function StyleDetailContainer({ children }: { children: React.ReactNode }) {
	return (
		<div className="p-4 shadow-lg bg-white block sm:flex items-center justify-between rounded-lg border-b border-gray-200 lg:mt-1.5 sm:p-6 xl:p-8 ">
			<div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-4">{children}</div>
		</div>
	);
}
