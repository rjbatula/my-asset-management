import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import AssetList from './components/AssetList'
import AssetForm from './components/AssetForm'
//import { BrowserRouter as Router, Routes, Route } from 'react-router'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Footer from './components/Footer'
import Dashboard from './components/Dashboard'

const App: React.FC = () => {
	return (
		<div className='App'>
			<Header />
			<ToastContainer />
			<div className='h-full min-h-screen flex-col flex-grow'>
				<Router>
					<Routes>
						<Route path='/' element={<AssetList />} />
						<Route
							path='/add-asset'
							element={<AssetForm isAdd={true} onClose={() => {}} />} // Example props
						/>
						<Route
							path='/edit-asset/:id'
							element={<AssetForm isAdd={false} onClose={() => {}} />} // Example props
						/>
						<Route path='/dashboard' element={<Dashboard />} />
					</Routes>
				</Router>
			</div>
			<Footer />
		</div>
	)
}

export default App
