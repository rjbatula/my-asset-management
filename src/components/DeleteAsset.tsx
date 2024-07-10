import React from 'react'
import { AssetModel } from '../models/AssetModel'

interface Props {
	showDeleteModal: boolean
	onClose: () => void
	asset: AssetModel
	onDelete: (id: string) => void // Function to delete asset
}

const DeleteAsset: React.FC<Props> = ({
	showDeleteModal,
	onClose,
	asset,
	onDelete,
}) => {
	const handleConfirmDelete = () => {
		// Call onDelete function with asset id to mark as deleted
		onDelete(asset.id)
		onClose() // Close the modal after deletion
	}

	if (!showDeleteModal) return null

	return (
		<div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-95 z-10'>
			<div className='bg-gray-900 text-white p-6 rounded-lg shadow-md '>
				<p className='mb-4 py-4 px-4'>
					Do you really want to delete '{asset.assetName}' asset?
				</p>
				<div className='flex justify-end'>
					<button
						className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mr-2'
						onClick={handleConfirmDelete}
					>
						Delete
					</button>
					<button
						className='bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md'
						onClick={onClose}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	)
}

export default DeleteAsset
