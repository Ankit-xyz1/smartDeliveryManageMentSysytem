import { Button } from '@/components/ui/button'
import React from 'react'

const page = () => {
  return (
    <>
      <div className='main1 h-screen md:w-[100%] w-full bg-zinc-950 flex items-center justify-center'>
        <div className='hidden md:flex h-screen w-[1px] bg-zinc-800'></div>
        <div className='main2 h-screen md:w-[60%] w-full bg-zinc-950 p-5'>
          <div className="create flex h-fit w-full justify-between items-center">
            <div className='text-white text-xl'>Partner List</div>
            <Button variant={'outline'} className='cursor-pointer'>Create an partner</Button>
          </div>
        </div>
        <div className='hidden md:flex h-screen w-[1px] bg-zinc-800'></div>
      </div>
    </>
  )
}

export default page