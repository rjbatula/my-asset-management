import React, { useEffect, useState } from 'react'
import { AssetModel } from '../models/AssetModel'
import { Link } from 'react-router-dom'
import axios from 'axios'

interface Props {
	asset: AssetModel
	onClose: () => void
}

const ViewAsset: React.FC<Props> = ({ asset, onClose }) => {
	const [price, setPrice] = useState(0)

	const changePercent = (
		((price - asset.averageValue) / asset.averageValue) *
		100
	).toFixed(2)

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (asset.assetType === 'Stock') {
					const response = await axios.get(
						`http://localhost:5100/api/stock-price/${asset.ticker}`
					)
					const currentPrice =
						response.data.chart.result[0].meta.regularMarketPrice
					setPrice(currentPrice)
				} else if (asset.assetType === 'Crypto') {
					const response = await axios.get(
						`http://localhost:5100/api/crypto-price/${asset.ticker}`
					)
					setPrice(response.data.price)
				} else {
					setPrice(0)
				}
			} catch (error) {
				console.error('Error fetching data:', error)
			}
		}

		fetchData()
	}, [asset.ticker])

	return (
		<div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-95'>
			<div className='bg-gray-900 text-white p-4 rounded-lg shadow-lg w-3/4'>
				<div className='flex items-center mb-4 justify-center'>
					<h2 className='text-xl font-bold mr-2 '>
						{asset.assetName.toUpperCase()}
					</h2>
					<span
						className={`px-2 py-1 text-xs font-semibold text-white ${
							asset.assetType === 'Stock' ? 'bg-blue-500' : 'bg-green-500'
						} rounded-md`}
					>
						{asset.assetType}
					</span>
				</div>
				<hr className='my-4' />
				<div className='mb-4 text-center'>
					<p className='mb-1'>
						<strong>Total Quantity:</strong>
						<br /> {asset.totalQuantity}
					</p>
					<p className='mb-1'>
						<strong>Average Value:</strong>
						<br /> ${asset.averageValue.toFixed(2)}
					</p>
					{(asset.assetType === 'Stock' || asset.assetType === 'Crypto') &&
					(asset.ticker !== null || asset.ticker !== '') ? (
						<>
							<p className='mb-1'>
								<strong>{asset.assetType} Ticker:</strong>
								<br /> {asset.ticker?.toUpperCase()}
							</p>
							<p className='mb-1'>
								<strong>{asset.assetType} Current Price:</strong>{' '}
								{price !== null ? <p>${price}</p> : <p>Loading...</p>}
							</p>
							<p className='mb-1'>
								<strong>Percentage Change (Profit/Loss):</strong> <br />
								<span
									className={
										parseFloat(changePercent) > 0
											? 'text-green-500'
											: 'text-red-500'
									}
								>
									{changePercent}%
								</span>
							</p>
						</>
					) : (
						''
					)}
					<p className='mb-1'>
						<strong>Notes:</strong>
						<br /> {asset.notes}
					</p>
				</div>
				<hr className='my-4' />
				<div className='mb-4'>
					<h3 className='text-lg font-semibold mb-2'>Line Items</h3>
					<div className='overflow-x-auto'>
						<table className='min-w-full bg-white'>
							<thead className='bg-gray-800'>
								<tr>
									<th className='px-4 py-2'>Quantity</th>
									<th className='px-4 py-2 text-right'>Price</th>
									<th className='px-4 py-2 text-right'>Date Acquired</th>
									<th className='px-4 py-2 text-right'>Status</th>
								</tr>
							</thead>
							<tbody className='text-black'>
								{asset.lineItems.map((item, index) => (
									<tr key={index}>
										<td className='border px-4 py-2'>{item.qty}</td>
										<td className='border px-4 py-2 text-right'>
											${item.price.toFixed(2)}
										</td>
										<td className='border px-4 py-2 text-right'>
											{new Date(item.dateAcquired).toISOString().split('T')[0]}
										</td>
										<td className='border px-4 py-2 text-right'>
											{item.status}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
				<div className='flex justify-end'>
					<Link
						to={`/edit-asset/${asset.id}`}
						className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md mr-2'
					>
						Edit
					</Link>
					<button
						className='bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg shadow-md'
						onClick={onClose}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	)
}

export default ViewAsset
