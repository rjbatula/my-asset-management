import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AssetModel } from '../models/AssetModel'
import AssetCard from './AssetCard'
import assets from '../public/assets' // Import the assets data directly
import { toast } from 'react-toastify'
import Spinner from './Spinner'
import ViewAsset from './ViewAsset'
import {
	PlusIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from '@heroicons/react/24/outline'

const AssetList = () => {
	const [loading, setLoading] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [assetsPerPage] = useState(8) // Number of assets per page
	const [assetsList, setAssetsList] = useState<AssetModel[]>([])
	const [selectedAsset, setSelectedAsset] = useState<AssetModel | null>(null)
	const [searchTerm, setSearchTerm] = useState<string>('')

	// Function to handle opening modal
	const openModal = (asset: AssetModel) => {
		setSelectedAsset(asset)
	}

	// Function to handle closing modal
	const closeModal = () => {
		setSelectedAsset(null)
	}

	// Function to delete asset
	const deleteAsset = (id: string) => {
		const updatedAssets = assetsList.filter((asset) => asset.id !== id)
		setAssetsList(updatedAssets)
		toast.success('Asset deleted successfully')
	}

	// Apply search filter and pagination
	const filteredAssets = assetsList.filter(
		(asset) =>
			asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			asset.assetType.toLowerCase().includes(searchTerm.toLowerCase())
	)

	// Pagination
	// Calculate pagination
	const indexOfLastAsset = currentPage * assetsPerPage
	const indexOfFirstAsset = indexOfLastAsset - assetsPerPage
	const currentAssets = filteredAssets.slice(
		indexOfFirstAsset,
		indexOfLastAsset
	)

	// Determine total number of pages based on filtered assets
	const totalPages = Math.ceil(filteredAssets.length / assetsPerPage)

	const paginate = (pageNumber: number) => {
		setCurrentPage(pageNumber)
	}

	useEffect(() => {
		// Simulating fetching data (can replace with actual fetch if using API)
		const fetchData = async () => {
			try {
				setLoading(true)
				// Simulate API call or any async operation
				// const data = await getAssets();
				// setAssets(data);

				// For demo, use assets from imported data
				// Check if localStorage has assets loaded
				const localStorageAssets = localStorage.getItem('assets')

				// If local storage is empty
				if (!localStorageAssets) {
					setAssetsList(assets.filter((asset) => asset.isDeleted === false))
					localStorage.setItem('assets', JSON.stringify(assets))
					console.log('loaded assets from assets file')
				} else {
					const parsedAssets = JSON.parse(localStorageAssets)

					// Check if parsed assets is an array and not empty
					if (Array.isArray(parsedAssets) && parsedAssets.length > 0) {
						setAssetsList(
							parsedAssets
								.sort(
									(a, b) =>
										new Date(b.modifiedAt).getTime() -
										new Date(a.modifiedAt).getTime()
								)
								.filter((asset) => asset.isDeleted === false)
						)
						localStorage.setItem('assets', JSON.stringify(parsedAssets))
						console.log('loaded assets from local storage')
					} else {
						// If parsed assets is empty or not an array, use default assets
						setAssetsList(assets.filter((asset) => asset.isDeleted === false))
						localStorage.setItem('assets', JSON.stringify(assets))
						console.log('loaded assets from assets file')
					}
				}
			} catch (error) {
				console.error('Error fetching assets:', error)
				toast.error('Failed to load assets')
				console.log(error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
		console.log(assets)
	}, [])

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value)
		setCurrentPage(1) // Reset pagination to first page when search term changes
	}

	return (
		<div className='bg-gray-700 h-full text-center py-4 w-80vw mx-auto flex-col'>
			<div className='flex flex-col sm:flex-row justify-between items-center mb-4 mx-4'>
				<h2 className='text-2xl font-bold text-white mx-4 mb-2 sm:mb-0'>
					Portfolio Assets
				</h2>
				<div className='flex items-center sm:mt-2'>
					<input
						type='text'
						placeholder='Search by asset name or type'
						className='rounded-md px-3 py-2 text-gray-900 mr-2'
						value={searchTerm}
						onChange={handleSearchChange}
					/>
					<Link
						to='/add-asset'
						className='flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md mr-4'
					>
						<PlusIcon className='h-5 w-5 mr-1' /> Add Asset
					</Link>
				</div>
			</div>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-8 md:my-8 lg:my-8'>
				{loading ? (
					<Spinner />
				) : currentAssets.length === 0 ? (
					<p className='text-white text-lg'>No assets found.</p>
				) : (
					currentAssets.map((asset) => (
						<AssetCard
							key={asset.id}
							asset={asset}
							onClick={() => openModal(asset)}
						/>
					))
				)}
			</div>
			{/* Modal */}
			{selectedAsset && (
				<ViewAsset asset={selectedAsset} onClose={closeModal} />
			)}
			{/* Pagination */}
			<div className='flex justify-center mt-4'>
				{/* Left arrow */}
				{currentPage > 1 && (
					<button
						className='mx-1 px-3 py-1 rounded-md bg-gray-500 text-gray-200'
						onClick={() => paginate(currentPage - 1)}
					>
						<ChevronLeftIcon className='h-5 w-5' />
					</button>
				)}
				{/* Page numbers */}
				{Array.from({ length: totalPages }, (_, index) => (
					<button
						key={index}
						className={`mx-1 px-3 py-1 rounded-md ${
							currentPage === index + 1
								? 'bg-blue-500 text-white font-bold'
								: 'bg-gray-500 text-gray-200'
						}`}
						onClick={() => paginate(index + 1)}
					>
						{index + 1}
					</button>
				))}
				{/* Right arrow */}
				{currentPage < totalPages && (
					<button
						className='mx-1 px-3 py-1 rounded-md bg-gray-500 text-gray-200'
						onClick={() => paginate(currentPage + 1)}
					>
						<ChevronRightIcon className='h-5 w-5' />
					</button>
				)}
			</div>
		</div>
	)
}

export default AssetList
