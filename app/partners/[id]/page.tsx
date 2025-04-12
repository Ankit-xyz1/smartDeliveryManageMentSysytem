"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CircleChevronLeft, CircleFadingArrowUp, Loader, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';

const page = () => {
  const params = useParams(); // Gets dynamic params from the URL

  interface partnerDetais {
    name: string,
    email: string,
    phone: string,
    shiftFrom: string,
    shiftTo: string,

  }

  const [formData, setFormData] = useState<partnerDetais>({
    name: '',
    email: '',
    phone: '',
    shiftFrom: '',
    shiftTo: '',

  });
  const [areaValue, setareaValue] = useState<string>("")
  const [areaArr, setareaArr] = useState<any[]>([])
  const [loading, setloading] = useState<boolean>(false)
  const [status, setstatus] = useState("")

  useEffect(() => {
    getAPartner();
  }, [])



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handlAreaChnage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setareaValue(e.target.value)
  }

  const addArea = () => {
    setareaArr([...areaArr, areaValue])
    setareaValue("")
  }
  const removeAreaFromArr = (index: number) => {
    const updatedArray: any[] = areaArr.filter((_, i) => i !== index);
    setareaArr(updatedArray)
  }
  
  const getAPartner = async () => {
    const response = await fetch("/api/partner/getAPartner", {
      method: "POST",
      body: JSON.stringify({ id: params.id })
    })
    const data1 = await response.json()
    const data = data1.DP
    console.log(data)
    setFormData({
      name: data.name,
      email: data.email,
      phone: data.phone,
      shiftFrom: data.shift.start,
      shiftTo: data.shift.end,
    })
    setstatus(data.status)
    setareaArr(data.areas)
  }
  const updatePartner = async () => {
    setloading(true)
    const Body = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      areas: areaArr,
      shift: {
        start: formData.shiftFrom,
        end: formData.shiftTo,
      },
      status:status
    }

    const response = await fetch("/api/partner/editPartner",{
      method:"PUT",
      body:JSON.stringify(Body)
    })
    const data = await response.json()

    if(data.sucess){
      toast.success("updated sucessfukky")
    }
    if(!data.sucess){
      toast.error(data.message)
    }
    setloading(false)
  }
  return (
    <>
      <div className='h-screen w-full bg-zinc-950 relative left-0 bottom-0 flex items-center justify-center z-10 '>
        <div className='absolute h-fit w-fit p-2 top-1.5 left-1 text-white'><Link href={'/partner'}><CircleChevronLeft className='cursor-pointer' /></Link></div>
        <Toaster/>
        <div className='lines animate-pulse duration-500  hidden md:flex h-screen w-[1px] bg-zinc-800'></div>
        <div className='h-screen md:w-[60%] w-full bg-zinc-950 p-5 relative  flex flex-col'>
          <div className="input  w-full h-[80vh] p-4 flex flex-col items-center gap-2 justify-center">
            <Input value={formData.name} name='name' onChange={handleChange} type='text' placeholder='Deivery partner name' className=' w-[90%] md:w-[200px] text-white' />
            <Input value={formData.email} readOnly name='email'  type='text' placeholder='Deivery partner email' className=' w-[90%] md:w-[200px] bg-zinc-700 text-white' />
            <Input value={formData.phone} name='phone' onChange={handleChange} type='text' placeholder='Deivery partner phone' className=' w-[90%] md:w-[200px] text-white' />
            <Input value={formData.shiftFrom} name='shiftFrom' onChange={handleChange} type='text' placeholder='Enter shift from time' className=' w-[90%] md:w-[200px] text-white' />
            <Input value={formData.shiftTo} name='shiftTo' onChange={handleChange} type='text' placeholder='Enter shift to time' className=' w-[90%] md:w-[200px] text-white' />
            {status === 'active' ? <><Button className='cursor-pointer' onClick={() => setstatus('unActive')}>De activate</Button></> : <><Button className='cursor-pointer' onClick={() => setstatus('active')}>Activate</Button></>}
            <div className='h-fit w-full flex gap-2 items-center justify-center ml:[10px] md:ml-[88px]'>
              <Input value={areaValue} onChange={handlAreaChnage} type='text' placeholder='Deivery partner area' className=' w-[90%] md:w-[200px] text-white' />
              <Button className='cursor-pointer' onClick={() => addArea()}><Plus /> Add area</Button>
            </div>
            {areaArr.length > 0 && <>
              <div className="arealist w-fit h-[15vh] md:w-[400px] rounded text-white bg-zinc-800 overflow-auto p-4">
                <h1 className='text-sm text-purple-500 p-1'>area List</h1>
                {areaArr.map((item, index) => (<span key={index}>
                  <Button className='cursor-pointer text-xs' onClick={() => removeAreaFromArr(index)}> {item} <Minus size={10} /></Button>
                </span>))}
              </div>
            </>}

            <Button className='cursor-pointer text-xs' onClick={updatePartner}>
              {loading ? <span><Loader size={20} className='animate-spin' /></span> : <CircleFadingArrowUp />}
              Update partner Details
            </Button>
          </div>
        </div>
        <div className='lines animate-pulse duration-500 hidden md:flex h-screen w-[1px] bg-zinc-800'></div>

      </div>
    </>
  )
}

export default page