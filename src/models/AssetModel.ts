export interface LineItem {
	id: string
	qty: number
	price: number
	dateAcquired: Date
	status: string
}

export interface AssetModel {
	id: string
	assetName: string
	assetType: string
	ticker?: string
	totalQuantity: number
	averageValue: number
	lineItems: LineItem[]
	notes: string
	isDeleted: boolean
	createdAt: Date
	createdBy: string
	modifiedAt: Date
	modifiedBy: string
}
