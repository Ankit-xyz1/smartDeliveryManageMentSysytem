'use client'
import React from 'react'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const [Navopen, setNavOpen] = useState(true)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <>
      <nav>
        <nav className="bg-zinc-900 text-white border-b border-zinc-800 shadow-lg sticky top-0 z-50">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-3">
            <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="self-center text-xl font-bold whitespace-nowrap text-white group-hover:text-blue-400 transition-colors">
                Delivery X
              </span>
            </Link>

            <button 
              data-collapse-toggle="navbar-default"
              onClick={() => { setNavOpen(!Navopen) }}
              type="button" 
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-colors" 
              aria-controls="navbar-default" 
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </button>

            {Navopen ?
              <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border text-white border-zinc-800 rounded-lg bg-zinc-900 md:flex-row md:space-x-2 rtl:space-x-reverse md:mt-0 md:border-0">
                  <li>
                    <Link 
                      href="/" 
                      className={`block py-2 px-4 rounded-lg transition-all duration-200 ${
                        isActive('/') 
                          ? 'text-white bg-blue-600 shadow-md' 
                          : 'text-gray-300 hover:text-white hover:bg-zinc-800'
                      }`}
                      aria-current={isActive('/') ? "page" : undefined}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/order" 
                      className={`block py-2 px-4 rounded-lg transition-all duration-200 ${
                        isActive('/order') 
                          ? 'text-white bg-blue-600 shadow-md' 
                          : 'text-gray-300 hover:text-white hover:bg-zinc-800'
                      }`}
                    >
                      Orders
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/partners" 
                      className={`block py-2 px-4 rounded-lg transition-all duration-200 ${
                        isActive('/partners') 
                          ? 'text-white bg-blue-600 shadow-md' 
                          : 'text-gray-300 hover:text-white hover:bg-zinc-800'
                      }`}
                    >
                      Partners
                    </Link>
                  </li>
                </ul>
              </div> : 
              <div className="w-full md:block md:w-auto" id="navbar-default">
                <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-zinc-800 rounded-lg bg-zinc-900 md:flex-row md:space-x-2 rtl:space-x-reverse md:mt-0 md:border-0 shadow-lg md:shadow-none">
                  <li>
                    <Link 
                      href="/" 
                      className={`block py-2 px-4 rounded-lg transition-all duration-200 ${
                        isActive('/') 
                          ? 'text-white bg-blue-600 shadow-md' 
                          : 'text-gray-300 hover:text-white hover:bg-zinc-800'
                      }`}
                      aria-current={isActive('/') ? "page" : undefined}
                      onClick={() => { setNavOpen(!Navopen) }}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/order" 
                      className={`block py-2 px-4 rounded-lg transition-all duration-200 ${
                        isActive('/order') 
                          ? 'text-white bg-blue-600 shadow-md' 
                          : 'text-gray-300 hover:text-white hover:bg-zinc-800'
                      }`}
                      onClick={() => { setNavOpen(!Navopen) }}
                    >
                      Orders
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/partners" 
                      className={`block py-2 px-4 rounded-lg transition-all duration-200 ${
                        isActive('/partners') 
                          ? 'text-white bg-blue-600 shadow-md' 
                          : 'text-gray-300 hover:text-white hover:bg-zinc-800'
                      }`}
                      onClick={() => { setNavOpen(!Navopen) }}
                    >
                      Partners
                    </Link>
                  </li>
                </ul>
              </div>}
          </div>
        </nav>
      </nav>
    </>
  )
}

export default Navbar