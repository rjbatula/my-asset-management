import { ClipLoader } from 'react-spinners'

const override = {
	display: 'block',
	margin: '100px auto',
}

export interface ClipLoaderProps {
	loading: boolean
	size?: number
	color?: string
	// Add other props as needed
}

const Spinner = () => {
	return (
		<ClipLoader
			color='#3b82f6'
			loading={true}
			cssOverride={override}
			size={150}
			aria-label='Loading Spinner'
		/>
	)
}
export default Spinner
