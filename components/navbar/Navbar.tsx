'use client'
import React from 'react'
import Link from 'next/link'
import { useState } from 'react'

const Navbar = () => {
  const [Navopen, setNavOpen] = useState(true)
  return (
    <>
      <nav>


        <nav className="bg-zinc-900 text-white border-gray-200 dark:bg-gray-900">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Delivery x</span>
            </Link>

            <button data-collapse-toggle="navbar-default"
              onClick={() => { setNavOpen(!Navopen) }}
              type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 " aria-controls="navbar-default" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </button>
            {Navopen ?
              <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border text-white border-gray-100 rounded-lg bg-zinc-900-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 ">
                  <li>
                    <Link href="/" className="block py-2 px-3 text-white bg-green-700 rounded md:bg-transparent " aria-current="page">Dashboard</Link>
                  </li>
                  <li>
                    <Link href="/order" className="block py-2 px-3  rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0">orders</Link>
                  </li>
                  <li>
                    <Link href="/partners" className="block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 ">partners</Link>
                  </li>
                </ul>
              </div> : <div className="w-full md:block md:w-auto" id="navbar-default">
                <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-zinc-900 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0  ">
                  <li>
                    <Link href="/" className="block py-2 px-3   rounded md:bg-transparent md:p-0 text-white " aria-current="page" onClick={() => { setNavOpen(!Navopen) }}>Dashboard</Link>
                  </li>
                  <li>
                    <Link href="/order" className="block py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 " onClick={() => { setNavOpen(!Navopen) }}
                    >orders</Link>
                  </li>
                  <li>
                    <Link href="/partners" className="block py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 " onClick={() => { setNavOpen(!Navopen) }}
                    >partners</Link>
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