import React, { useState } from 'react'
import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
} from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

interface NavigationItem {
	name: string
	href: string
	current: boolean
}

const Header = () => {
	const [navigation, setNavigation] = useState<NavigationItem[]>([
		{ name: 'Assets', href: '/', current: true },
		{ name: 'Dashboard', href: '/dashboard', current: true },
	])

	const handleItemClick = (name: string) => {
		const updatedNavigation = navigation.map((item) => ({
			...item,
			current: item.name === name,
		}))
		setNavigation(updatedNavigation)
	}

	return (
		<Disclosure as='nav' className='bg-gray-800 h-full'>
			{({ open }) => (
				<>
					<div className='max-w-7xl px-4 sm:px-6 lg:px-8'>
						<div className='flex h-16 items-center justify-between'>
							<div className='flex items-center'>
								<div className='hidden md:block'>
									<div className='flex items-baseline space-x-4'>
										{navigation.map((item) => (
											<a
												key={item.name}
												href={item.href}
												onClick={() => handleItemClick(item.name)}
												className={`
                          ${
														item.current
															? 'bg-gray-800 hover:bg-gray-900 text-white'
															: 'text-gray-300 hover:bg-gray-700 hover:text-white'
													}
                          rounded-md px-3 py-2 text-sm font-medium
                        `}
												aria-current={item.current ? 'page' : undefined}
											>
												{item.name}
											</a>
										))}
									</div>
								</div>
							</div>
							<div className='-mr-2 flex md:hidden'>
								{/* Mobile menu button */}
								<DisclosureButton className='relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
									<span className='absolute -inset-0.5' />
									<span className='sr-only'>Open main menu</span>
									{open ? (
										<XMarkIcon className='block h-6 w-6' aria-hidden='true' />
									) : (
										<Bars3Icon className='block h-6 w-6' aria-hidden='true' />
									)}
								</DisclosureButton>
							</div>
						</div>
					</div>

					<DisclosurePanel className='md:hidden'>
						<div className='space-y-1 px-2 pb-3 pt-2 sm:px-3'>
							{navigation.map((item) => (
								<DisclosureButton
									key={item.name}
									as='a'
									href={item.href}
									className={`
                    ${
											item.current
												? 'bg-gray-800 hover:bg-gray-900 text-white'
												: 'text-gray-300 hover:bg-gray-700 hover:text-white'
										}
                    block rounded-md px-3 py-2 text-base font-medium
                  `}
									aria-current={item.current ? 'page' : undefined}
									onClick={() => handleItemClick(item.name)}
								>
									{item.name}
								</DisclosureButton>
							))}
						</div>
					</DisclosurePanel>
				</>
			)}
		</Disclosure>
	)
}

export default Header
