# Running Frontend React Server

- Run the backend node server

```bash
cd my-assets-backend
npm start
```

- Go to the project directory

```bash
cd my-asset-management
```

- Install all required node modules

```bash
npm install
```

- Run the backend server

```bash
npm start
```

# Storage of Data

`Since the purpose of this application is to showcase the front end functionality, i have decided that storing data in the local storage is much suitable for the demo. `

### How does it work?

`Once the app server is running, it will check whether there is 'assets' key in the local storage. If there is not, it will first fetch a pre-defined data from my file - assets.ts and set it as a starting data source in the local storage. Subsequently, the fetching of data will then be from the local storage unless the key is deleted.`

# Main Functionality

The application that i have created have these functionalities:

### Dashboard View

`The dashboard view displays a grid system that shows a cummulative total assets value that the user has registered, the liquidated assets total value where the user have sold these assets, a pie chart that shows the asset types and their number represented in different colors as well as an graph timeline that shows the amount of money invested throughout the years.`

### Asset List View

`The asset list view displays the current assets that the user has registered in the system. These are shown in an AssetCard component which indicates the name and the type of asset each card represents.`

### Pagination, Sorting and Search of Assets

`From the asset list view, the pagination shows a maximum of 8 cards per page. If there are more active records, it will be reflected in the following pages. The page number will increase and the user is able to click on the page number or the  left/right arrow to traverse and navigate through pages.`

`The sorting mechanism of the Asset List view are based on the modfied date where the latest will be placed infront of the stack and only those isDeleted=false will be shown.`

`The search functionality enables user to filter through assets using incomplete words or letters via the asset name or asset type.`

### Asset Details View

`The asset details showcase quite a number of complex and dynamic rendering. For the start, it will display the asset name and type, the total quantity and average value of the asset based on the line item values, the notes where the user can specify the location or whereabouts of the asset as well as the ticker, ticker price and percentage change based on your profit or loss if the asset type is either 'Stock' or 'Crypto'. The line items are displayed below which i thought very helpful when the user wanted to track multiple times that they have bought and sold the same asset reflecting the changes to the total quantity and average value.`

### Add New Asset

`Adding a new asset can be done by clicking on the 'Add Asset' button from the Asset List view. The user is then able to type in values for the asset name and notes, select asset type from a dropdown list and if the asset type is 'Stock' or 'Crypto' then the user will then be able to enter the ticker code. Below, the user is able to click on the 'Add Line Item' button to dynamically add line item records where the user is able to specify the quantity, price, date of when the asset is acquired and set the status whether the asset is 'Bought' or 'Sold'. If the user accidentally added more line items, they can remove them by click on the 'Delete' link beside the line item.`

### Edit Existing Asset

`For editing of assets, it pre filled the form with the asset information and the user is able to make changes, add or remove line items as they need. This would let the user to have flexible approach to their own assets and this would be a great tool to help them manage it.`

### Delete Asset

`On the Asset List cards within the Asset List view, the user will be able to find an 'X' button at the top right of each card. The user will then able to click on this and a prompt modal will appear to confirm the users decision to remove the asset from his/her portfolio. In the data layer, this information are still kept as deleting an asset will only update its isDeleted attribute to true. Thus, this would be a helpful option in terms of auditing.`
