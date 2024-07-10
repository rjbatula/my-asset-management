import React, { useState } from 'react'
import { XMarkIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline' // Assuming this is the correct icon for X
import { AssetModel } from '../models/AssetModel'
import DeleteAsset from './DeleteAsset'

interface Props {
	asset: AssetModel
	onClick: () => void
}

const AssetCard: React.FC<Props> = ({ asset, onClick }) => {
	const [showDeleteModal, setShowDeleteModal] = useState(false)

	const handleDeleteClick = () => {
		setShowDeleteModal(true)
	}

	const closeModal = () => {
		setShowDeleteModal(false)
	}

	const handleDeleteAsset = (id: string) => {
		try {
			// Get the assets from localStorage
			const localStorageAssets = localStorage.getItem('assets')
			if (localStorageAssets) {
				// Parse the JSON string to get the array of assets
				const assets: AssetModel[] = JSON.parse(localStorageAssets)

				// Find the asset by its id
				const assetToDelete = assets.find((asset) => asset.id === id)

				if (assetToDelete) {
					// Update the isDeleted property of the asset
					assetToDelete.isDeleted = true

					// Update the assets array
					const updatedAssets = assets.map((asset) =>
						asset.id === assetToDelete.id ? assetToDelete : asset
					)

					// Update localStorage with the updated assets array
					localStorage.setItem('assets', JSON.stringify(updatedAssets))

					// Optionally, perform additional actions like notifying the user
					console.log(
						`Asset '${assetToDelete.assetName}' deleted successfully.`
					)
				} else {
					console.error(`Asset with ID '${id}' not found.`)
				}
			} else {
				console.error('No assets found in localStorage.')
			}
		} catch (error) {
			console.error('An error occurred while deleting asset:', error)
		} finally {
			window.location.reload()
		}
	}

	// Determine background color for asset type chip based on asset type
	const getChipColor = () => {
		switch (asset.assetType) {
			case 'Stock':
				return 'bg-blue-500'
			case 'Real Estate':
				return 'bg-red-500'
			case 'Crypto':
				return 'bg-green-500'
			case 'Metals':
				return 'bg-yellow-500'
			default:
				return 'bg-gray-500'
		}
	}

	return (
		<div className='bg-gray-800 text-white p-4 rounded-lg shadow-md relative py-5'>
			<button
				className='absolute top-2 right-2 text-gray-600 hover:text-white'
				onClick={handleDeleteClick}
			>
				<XMarkIcon className='h-5 w-5' />
			</button>
			<h2 className='text-lg font-bold mb-2'>{asset.assetName}</h2>
			{/* Asset Type Chip */}
			<div
				className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${getChipColor()} text-white mb-2`}
			>
				{asset.assetType}
			</div>
			{/* <p>
				<strong>Total Quantity:</strong> {asset.totalQuantity}
			</p> */}
			{/* Divider */}
			<div className='border-t border-gray-200 my-4'></div>
			{/* View Details Button */}
			<button
				className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md'
				onClick={onClick}
			>
				Details <ChevronDoubleRightIcon className='h-5 w-5 inline-block' />
			</button>

			{/* Delete Asset Modal */}
			<DeleteAsset
				showDeleteModal={showDeleteModal}
				onClose={closeModal}
				asset={asset}
				onDelete={() => handleDeleteAsset(asset.id)} // Pass onDelete function
			/>
		</div>
	)
}

export default AssetCard
