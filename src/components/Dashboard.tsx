import React, { useState, useEffect } from 'react'
import { AssetModel } from '../models/AssetModel'

const user = {
	name: 'John Doe',
}

const Dashboard = () => {
	const [totalAssetsValue, setTotalAssetsValue] = useState<number>(0)
	const [liquidatedAssetsValue, setLiquidatedAssetsValue] = useState<number>(0)
	const [assetTypesData, setAssetTypesData] = useState<
		{ type: string; count: number }[]
	>([])
	const [hoveredAssetType, setHoveredAssetType] = useState<{
		type: string
		count: number
	} | null>(null)
	const [investedAssetsTimeline, setInvestedAssetsTimeline] = useState<
		{ year: number; total: number }[]
	>([])

	useEffect(() => {
		const assets: AssetModel[] =
			JSON.parse(localStorage.getItem('assets')!) || []

		// Calculate total assets value and liquidated assets value
		let totalValue = 0
		let liquidatedValue = 0

		// Aggregate asset types count
		const assetTypesMap = new Map<string, number>()
		assets.forEach((asset) => {
			asset.lineItems.forEach((lineItem) => {
				if (lineItem.status === 'Bought') {
					totalValue += lineItem.price * lineItem.qty
				} else if (lineItem.status === 'Sold') {
					liquidatedValue += lineItem.price * lineItem.qty
				}

				// Count asset types
				const currentCount = assetTypesMap.get(asset.assetType) || 0
				assetTypesMap.set(asset.assetType, currentCount + 1)
			})
		})

		// Convert map to array for easier rendering
		const assetTypesArray = Array.from(assetTypesMap.entries()).map(
			([type, count]) => ({
				type,
				count,
			})
		)

		setTotalAssetsValue(totalValue)
		setLiquidatedAssetsValue(liquidatedValue)
		setAssetTypesData(assetTypesArray)

		// Calculate invested assets timeline
		const timelineMap = new Map<number, number>()
		assets.forEach((asset) => {
			asset.lineItems.forEach((lineItem) => {
				if (lineItem.status === 'Bought') {
					const year = new Date(lineItem.dateAcquired).getFullYear()
					const currentValue = timelineMap.get(year) || 0
					timelineMap.set(year, currentValue + lineItem.price * lineItem.qty)
				}
			})
		})

		// Convert map to array for easier rendering
		const timelineArray = Array.from(timelineMap.entries()).map(
			([year, total]) => ({
				year,
				total,
			})
		)

		setInvestedAssetsTimeline(timelineArray)
	}, [])

	// Function to calculate total count of asset types
	const totalAssetTypesCount = assetTypesData.reduce(
		(acc, curr) => acc + curr.count,
		0
	)

	const formatNumberWithCommas = (value: number) => {
		const parts = value.toFixed(2).toString().split('.')
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
		return parts.join('.')
	}

	return (
		<>
			<h2 className='text-white text-2xl p-4 font-bold mx-4'>
				Portfolio Dashboard
			</h2>
			<div className='grid grid-cols-1 p-4 md:grid-cols-2 gap-4 mx-4'>
				<div className='bg-gray-900 text-white p-4 rounded-md '>
					<h2 className='text-lg font-semibold mb-2'>Total Assets Value</h2>
					<div className='flex justify-between'>
						<span className='font-bold text-4xl'>
							${formatNumberWithCommas(totalAssetsValue)}
						</span>
					</div>
				</div>
				<div className='bg-gray-900 text-white p-4 rounded-md'>
					<h2 className='text-lg font-semibold mb-2'>
						Liquidated Assets Value:
					</h2>
					<div className='flex justify-between'>
						<span className='font-bold text-4xl'>
							${formatNumberWithCommas(liquidatedAssetsValue)}
						</span>
					</div>
				</div>
				<div className='bg-gray-900 text-white p-4 rounded-md flex'>
					
					{/* Pie chart for asset types */}
					<div className='relative' style={{ width: '200px', height: '200px' }}>
						<svg viewBox='0 0 100 100' style={{ transform: 'rotate(-90deg)' }}>
							{/* Background circle */}
							<circle
								cx='50'
								cy='50'
								r='40'
								fill='transparent'
								stroke='transparent'
								strokeWidth='20'
							/>
							{/* Pie slices */}
							{assetTypesData.map((data, index) => {
								const percentage = (data.count / totalAssetTypesCount) * 100
								const startAngle =
									index === 0
										? 0
										: assetTypesData
												.slice(0, index)
												.reduce(
													(acc, curr) =>
														acc + (curr.count / totalAssetTypesCount) * 360,
													0
												)
								const endAngle = startAngle + percentage * 3.6
								const largeArcFlag = percentage > 50 ? 1 : 0

								const startX = 50 + 40 * Math.cos((startAngle * Math.PI) / 180)
								const startY = 50 + 40 * Math.sin((startAngle * Math.PI) / 180)
								const endX = 50 + 40 * Math.cos((endAngle * Math.PI) / 180)
								const endY = 50 + 40 * Math.sin((endAngle * Math.PI) / 180)

								// Calculate path d attribute
								const pathData = [
									`M 50,50`, // Move to center
									`L ${startX},${startY}`, // Line to starting point of arc
									`A 40,40 0 ${largeArcFlag},1 ${endX},${endY}`, // Arc
									`Z`, // Close path
								].join(' ')

								// Hover event handlers
								const handleMouseEnter = () => {
									setHoveredAssetType(data)
								}
								const handleMouseLeave = () => {
									setHoveredAssetType(null)
								}

								return (
									<g key={index}>
										<path
											d={pathData}
											fill={`hsl(${
												(index * 360) / assetTypesData.length
											}, 70%, 50%)`}
											onMouseEnter={handleMouseEnter}
											onMouseLeave={handleMouseLeave}
											style={{ transition: 'fill 0.3s ease' }}
										/>
									</g>
								)
							})}
						</svg>
						{/* Hover helper */}
						{hoveredAssetType && (
							<div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center'>
								<div className='bg-white text-black rounded-md p-2 shadow-lg'>
									<p className='text-sm font-medium'>{hoveredAssetType.type}</p>
									<p className='text-xs text-gray-500'>
										{hoveredAssetType.count} items
									</p>
								</div>
							</div>
						)}
					</div>

					{/* Legends */}
					<div className='ml-4'>
						<h2 className='text-lg font-semibold mb-2'>Asset Type Legends:</h2>
						{assetTypesData.map((data, index) => (
							<div key={index} className='flex items-center mb-2'>
								<span
									className='inline-block w-3 h-3 mr-2'
									style={{
										backgroundColor: `hsl(${
											(index * 360) / assetTypesData.length
										}, 70%, 50%)`,
										borderRadius: '50%',
									}}
								/>
								<p className='text-sm'>{data.type}</p>
							</div>
						))}
					</div>
				</div>
				<div className='bg-gray-900 text-white p-4 rounded-md'>
					<h2 className='text-lg font-semibold mb-2'>
						Invested Assets Timeline:
					</h2>
					{/* Bar graph of invested assets timeline */}
					<div className='flex flex-col p-4 mr-48'>
						{investedAssetsTimeline.map((item) => (
							<div key={item.year} className='flex items-center mb-2'>
								<div className='w-20 mr-2 text-left font-bold'>{item.year}</div>
								<div
									className='h-6 bg-blue-500 mr'
									style={{ width: `${item.total}px` }}
								></div>
								<div className='ml-2'>{`$${formatNumberWithCommas(
									item.total
								)}`}</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	)
}

export default Dashboard
