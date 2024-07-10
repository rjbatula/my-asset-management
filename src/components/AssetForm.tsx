import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AssetModel, LineItem } from '../models/AssetModel'
import { Link, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import Spinner from './Spinner'

interface Props {
	isAdd: boolean // Indicates whether it's an add or edit operation
	onClose: () => void // Function to close the form
}

const AssetForm: React.FC<Props> = ({ isAdd, onClose }) => {
	const navigate = useNavigate()

	const [ticker, setTicker] = useState<string>('')
	const [notes, setNotes] = useState<string>('')
	const [loading, setLoading] = useState<boolean>(false)
	const { id: assetId } = useParams<{ id: string }>()
	let [asset, setAsset] = useState<AssetModel>({
		id: '',
		assetName: '',
		assetType: '',
		ticker: '',
		totalQuantity: 0,
		averageValue: 0,
		lineItems: [],
		notes: '',
		isDeleted: false,
		createdAt: new Date(),
		createdBy: '',
		modifiedAt: new Date(),
		modifiedBy: '',
	})

	useEffect(() => {
		const fetchAssetDetails = () => {
			try {
				if (!isAdd && assetId) {
					// Fetch asset details from localStorage based on id
					const localStorageAssets = localStorage.getItem('assets')
					if (localStorageAssets != null) {
						const myAssets: AssetModel[] = JSON.parse(localStorageAssets)
						const fetchedAsset = myAssets
							.filter((item) => !item.isDeleted)
							.find((a) => a.id === assetId)

						console.log(fetchedAsset)

						if (fetchedAsset) {
							const loadedAsset = {
								...fetchedAsset,
								id: fetchedAsset.id, // Generate UUID for id
								ticker: fetchedAsset.ticker,
								notes: fetchedAsset.notes,
							}
							const copiedLineItems = fetchedAsset.lineItems.map((li) => ({
								...li,
							}))
							console.log('loaded asset')
							console.log(loadedAsset)
							asset = loadedAsset

							console.log('new asset')
							console.log(asset)
							// // Deep copy lineItems to avoid mutation

							// // Update asset state immutably
							// setAsset({
							// 	...fetchedAsset,
							// 	assetName: fetchedAsset.assetName, // Update with fetched values
							// 	lineItems: copiedLineItems, // Use deep copied lineItems
							// })
							console.log(asset)
						} else {
							console.error(`Asset with ID ${assetId} not found.`)
						}
					} else {
						console.error('No assets found in localStorage.')
					}
				}
			} catch (error) {
				console.error(error)
			}
		}

		fetchAssetDetails()
	}, [isAdd, assetId]) // Include isAdd and assetId as dependencies

	// Function to handle form submission
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setLoading(true)
		// Example: Perform form submission logic (e.g., API call, update state)
		try {
			if (isAdd) {
				// Create a new asset form and add in values
				const newAsset = {
					...asset,
					id: uuidv4(), // Generate UUID for id
					modifiedBy: 'Admin',
					createdBy: 'Admin',
				}
				// Get the assets in local storage
				const existingAssets: AssetModel[] = JSON.parse(
					localStorage.getItem('assets') || '[]'
				)
				// Add and set the new assets array to local storage
				const updatedAssets = [...existingAssets, newAsset]
				localStorage.setItem('assets', JSON.stringify(updatedAssets))
				toast.success('Successfully added assets')

				// Reset fields
				setAsset({
					id: '',
					assetName: '',
					assetType: '',
					ticker: '',
					totalQuantity: 0,
					averageValue: 0,
					lineItems: [],
					notes: '',
					isDeleted: false,
					createdAt: new Date(),
					createdBy: '',
					modifiedAt: new Date(),
					modifiedBy: '',
				})

				// Navigate back to dashboard
				navigate('/')
			} else {
				console.log('This is for updating assets')
				setLoading(true)
				const assets: AssetModel[] = JSON.parse(localStorage.getItem('assets')!)
				// Implement update logic if needed

				// Update existing asset logic
				const updatedAssets = assets.map((a) =>
					a.id === asset.id ? { ...asset, modifiedAt: new Date() } : a
				)

				// Update localStorage with the modified array
				localStorage.setItem('assets', JSON.stringify(updatedAssets))
				toast.success('Successfully updated asset')

				// Log for confirmation (you may remove this)
				console.log('Updated assets:', updatedAssets)
				navigate('/')
			}
			console.log('Form submitted:', asset)
		} catch (error) {
			console.error('An error occurred ' + error)
		} finally {
			setLoading(false)
			onClose() // Close the form after submission
		}
	}

	// Function to handle line item addition
	const handleAddLineItem = () => {
		const newLineItem: LineItem = {
			id: uuidv4(),
			qty: 0,
			price: 0,
			dateAcquired: new Date(),
			status: 'Bought',
		}
		setAsset({ ...asset, lineItems: [...asset.lineItems, newLineItem] })
	}

	// Function to handle line item deletion
	const handleDeleteLineItem = (index: number) => {
		const updatedLineItems = [...asset.lineItems]
		updatedLineItems.splice(index, 1)
		setAsset({ ...asset, lineItems: updatedLineItems })
	}

	// Function to calculate total quantity and average value based on line items
	useEffect(() => {
		let totalQty = 0
		let totalValue = 0
		asset.lineItems.forEach((item) => {
			if (item.status === 'Bought') {
				totalQty += item.qty
				totalValue += item.qty * item.price
			} else {
				totalQty -= item.qty
				totalValue -= item.qty * item.price
			}
		})
		const averageValue = totalQty === 0 ? 0 : totalValue / totalQty
		setAsset({ ...asset, totalQuantity: totalQty, averageValue: averageValue })
	}, [asset.lineItems]) // Include asset.lineItems as a dependency

	return (
		<div className='bg-gray-900 text-white p-4 rounded-lg shadow-md my-4 mx-4'>
			<h2 className='text-lg font-bold mb-4'>
				{isAdd ? 'Add Asset' : 'Edit Asset'}
			</h2>
			{loading ? (
				<Spinner />
			) : (
				<form onSubmit={handleSubmit}>
					{/* Asset Name */}
					<div className='mb-4 '>
						<label className='block text-sm font-medium'>Asset Name</label>
						<input
							type='text'
							className='px-2 text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
							value={asset.assetName}
							onChange={(e) =>
								setAsset({ ...asset, assetName: e.target.value })
							}
							required
							placeholder='Enter Asset Name'
						/>
					</div>
					{/* Asset Type */}
					<div className='mb-4'>
						<label className='block text-sm font-medium'>Asset Type</label>
						<select
							className='px-2 text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
							value={asset.assetType}
							onChange={(e) =>
								setAsset({ ...asset, assetType: e.target.value })
							}
							required
						>
							<option value=''>Select Asset Type</option>
							<option value='Stock'>Stock</option>
							<option value='Crypto'>Crypto</option>
							<option value='Metals'>Metals</option>
							<option value='Real Estate'>Real Estate</option>
							{/* Add more options as needed */}
						</select>
					</div>
					{/* Ticker (conditional based on asset type) */}
					{['Stock', 'ETF', 'Crypto'].includes(asset.assetType) && (
						<div className='mb-4'>
							<label className='block text-sm font-medium '>Ticker</label>
							<input
								type='text'
								className='px-2 text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
								value={asset.ticker}
								onChange={(e) => setAsset({ ...asset, ticker: e.target.value })}
								required
							/>
						</div>
					)}
					{/* Total Quantity */}
					<div className='mb-4'>
						<label className='block text-sm font-medium'>Total Quantity</label>
						<input
							type='number'
							className='px-2 text-black bg-gray-300 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
							value={asset.totalQuantity}
							disabled
						/>
					</div>
					{/* Average Value */}
					<div className='mb-4'>
						<label className='block text-sm font-medium '>Average Value</label>
						<input
							type='number'
							className='px-2 text-black bg-gray-300  mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
							value={asset.averageValue}
							disabled
						/>
					</div>
					{/* Line Items */}
					<div className='mb-4'>
						<label className='block text-sm font-medium '>Line Items</label>
						<table className='w-full mt-2'>
							<thead>
								<tr>
									<th className='px-4 py-2'>Quantity</th>
									<th className='px-4 py-2'>Price</th>
									<th className='px-4 py-2'>Date Acquired</th>
									<th className='px-4 py-2'>Status</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{asset.lineItems.map((item, index) => (
									<tr key={index}>
										<td className='border px-4 py-2'>
											<input
												type='number'
												className='px-2  text-black w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
												value={item.qty}
												onChange={(e) =>
													setAsset({
														...asset,
														lineItems: asset.lineItems.map((li, idx) =>
															idx === index
																? { ...li, qty: parseInt(e.target.value, 10) }
																: li
														),
													})
												}
												required
											/>
										</td>
										<td className='border px-4 py-2'>
											<input
												type='number'
												className='px-2 text-black w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
												value={item.price}
												onChange={(e) =>
													setAsset({
														...asset,
														lineItems: asset.lineItems.map((li, idx) =>
															idx === index
																? {
																		...li,
																		price: parseFloat(e.target.value),
																  }
																: li
														),
													})
												}
												required
											/>
										</td>
										<td className='border px-4 py-2'>
											<input
												type='date'
												className='px-2 text-black w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
												value={
													new Date(item.dateAcquired)
														.toISOString()
														.split('T')[0]
												} // Format as yyyy-mm-dd
												onChange={(e) =>
													setAsset({
														...asset,
														lineItems: asset.lineItems.map((li, idx) =>
															idx === index
																? {
																		...li,
																		dateAcquired: new Date(e.target.value),
																  }
																: li
														),
													})
												}
												required
											/>
										</td>
										<td className='border px-4 py-2'>
											<select
												className=' px-2 text-black w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
												value={item.status}
												onChange={(e) =>
													setAsset({
														...asset,
														lineItems: asset.lineItems.map((li, idx) =>
															idx === index
																? { ...li, status: e.target.value }
																: li
														),
													})
												}
												required
											>
												<option value='Bought'>Bought</option>
												<option value='Sold'>Sold</option>
												{/* Add more status options as needed */}
											</select>
										</td>
										<td className='px-4 py-2'>
											<button
												type='button'
												className='text-red-600 hover:text-red-700'
												onClick={() => handleDeleteLineItem(index)}
											>
												Delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						<button
							type='button'
							className='mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md'
							onClick={handleAddLineItem}
						>
							Add Line Item
						</button>
					</div>
					{/* Notes */}
					<div className='mb-4'>
						<label className='block text-sm font-medium'>Notes</label>
						<textarea
							className='px-2 py-2 text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
							value={asset.notes}
							onChange={(e) => setAsset({ ...asset, notes: e.target.value })}
							placeholder='Enter notes e.g platform, location or whereabouts of the assets'
						/>
					</div>
					{/* Submit Button */}
					<div className='flex justify-end'>
						<button
							type='submit'
							className='bg-blue-500 hover:bg-blue-600 text-white mr-4 px-4 py-2 rounded-lg shadow-md'
						>
							{isAdd ? 'Add Asset' : 'Update Asset'}
						</button>
						<Link
							to={'/'}
							className='bg-gray-300 hover:bg-gray-400 text-gray-800  px-4 py-2 rounded-lg shadow-md'
						>
							Cancel
						</Link>
					</div>
				</form>
			)}
		</div>
	)
}

export default AssetForm
