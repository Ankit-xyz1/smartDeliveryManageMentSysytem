"use client"
import { Button } from '@/components/ui/button'
import { Logs, Plus, Trash2, UserPen, X } from 'lucide-react';
import React, { useState } from 'react'

const page = () => {
  const [partnerRegistrationPage, setpartnerRegistrationPage] = useState<boolean>(false);
  return (
    <>
      <div className='main1 h-screen md:w-[100%] w-full bg-zinc-950 flex items-center justify-center relative'>
        <div className='line animate-pulse duration-500 hidden md:flex h-screen w-[1px] bg-zinc-800'></div>
        <div className='main2 h-screen md:w-[60%] w-full bg-zinc-950 p-5'>
          <div className="Heading-section create flex h-fit w-full justify-between items-center">
            <div className='text-white text-xl rounded-2xl flex gap-1 justify-center items-center'><Logs />Partner List</div>
            <Button variant={'outline'} className='cursor-pointer' onClick={() => setpartnerRegistrationPage(true)}><Plus />Create an partner</Button>
            {partnerRegistrationPage && <>
              <div className='h-screen w-full bg-zinc-950 absolute left-0 bottom-0 flex items-center justify-center z-10 '>
                <div className='lines animate-pulse duration-500  hidden md:flex h-screen w-[1px] bg-zinc-800'></div>
                <div className='h-screen md:w-[60%] w-full bg-zinc-950 p-5 relative'>
                  <div className="absolute right-2 top-2 h-fit w-fit text-xl text-white"><Button className='cursor-pointer' onClick={() => setpartnerRegistrationPage(false)}><X /></Button></div>
                </div>
                <div className='lines animate-pulse duration-500 hidden md:flex h-screen w-[1px] bg-zinc-800'></div>

              </div>
            </>}
          </div>
          <div className="metrics w-full h-[5vh] flex gap-2 items-center justify-start ">
            <div className="active1 h-full w-[40%] flex items-center justify-center ">
              <div className="status w-full flex gap-1 justify-start items-center">
                <div className="blinker animate-pulse duration-1000 h-[7px] w-[7px] bg-green-500 rounded-full"></div>
                <div className="stat-written text-white text-sm h-full w-fit flex">100 Active</div>
              </div>
            </div>
          </div>
          <div className='partners-list-box h-[90vh] w-full p-4 overflow-auto flex flex-col gap-2'>
            <div className="IndiVidualPartner w-[100%] h-[6vh] bg-zinc-900 rounded-sm flex p-2">
              <div className="individualname w-[50%] md:w-[30%] text-white h-full flex items-center justify-start px-1 md:text-sm text-[12px] overflow-hidden">Partner Name</div>
              <div className="status w-[10%] md:w-[20%] flex gap-1 justify-start items-center">
                <div className="blinker animate-pulse duration-1000 h-[7px] w-[7px] bg-green-500 rounded-full shadow-2xl"></div>
                <div className="stat-written hidden md:flex text-white text-sm"> Active</div>
              </div>
              <div className='edit-delete md:w-[47%] w-[35%] flex items-center justify-end gap-2 text-black'>
                <div><Button variant={'outline'} className='cursor-pointer'><UserPen /><span className='md:inline hidden'>edit</span></Button></div>
                <div className="delete"><Button variant={'outline'} className='cursor-pointer'><Trash2 /><span className='md:inline hidden'>Delete</span></Button></div>
              </div>
            </div>
            <div className="IndiVidualPartner w-[100%] h-[6vh] bg-zinc-900 rounded-sm flex p-2">
              <div className="individualname w-[50%] md:w-[30%] text-white h-full flex items-center justify-start px-1 md:text-sm text-[12px] overflow-hidden">Partner Name</div>
              <div className="status w-[10%] md:w-[20%] flex gap-1 justify-start items-center">
                <div className="blinker animate-pulse duration-1000 h-[7px] w-[7px] bg-red-500 rounded-full shadow-2xl"></div>
                <div className="stat-written hidden md:flex text-white text-sm"> unActive</div>
              </div>
              <div className='edit-delete md:w-[47%] w-[35%] flex items-center justify-end gap-2 text-black'>
                <div><Button variant={'outline'} className='cursor-pointer'><UserPen /><span className='md:inline hidden'>edit</span></Button></div>
                <div className="delete"><Button variant={'outline'} className='cursor-pointer'><Trash2 /><span className='md:inline hidden'>Delete</span></Button></div>
              </div>
            </div>
          </div>
        </div>
        <div className='line animate-pulse duration-500 hidden md:flex h-screen w-[1px] bg-zinc-800'></div>
      </div>
    </>
  )
}

export default page