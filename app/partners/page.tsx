"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Loader, Logs, Minus, Plus, Trash2, UserPen, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { partnersSlice, setPartner } from '../redux/slice/allPartnersSLice';
import { RootState } from '@/app/redux/store/store';
import { DeliveryPartnerTypeFromDb } from '@/types';
import Link from 'next/link';

const page = () => {
  //global states
  const dispatch = useDispatch();
  const partner = useSelector((state: RootState) => state.partners.value)

  //all interfaces used
  interface partnerDetais {
    name: string,
    email: string,
    phone: string,
    shiftFrom: string,
    shiftTo: string,
  }
  interface DeliveryPartnerType {
    name: string;
    email: string;
    phone: string;
    areas: string[];
    shift: {
      start: string; // HH:mm
      end: string;   // HH:mm
    };
  };

  //all local states used 
  const [loading, setloading] = useState<boolean>(false)
  const [partnerRegistrationPage, setpartnerRegistrationPage] = useState<boolean>(false);
  const [formData, setFormData] = useState<partnerDetais>({
    name: '',
    email: '',
    phone: '',
    shiftFrom: '',
    shiftTo: ''
  });
  const [areaValue, setareaValue] = useState<string>("")
  const [areaArr, setareaArr] = useState<any[]>([])

  //all use effect hooks
  useEffect(() => {
    console.log("usseffect is runing")
    fetchAllPartner()

  }, [])

  //handling function for inputs
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


  //all called backend functions

  //register an partner
  const registerPartner = async () => {
    setloading(true)
    const PartnerDetails: DeliveryPartnerType = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      areas: areaArr,
      shift: {
        start: formData.shiftFrom,
        end: formData.shiftTo,
      }
    }

    const response = await fetch("/api/partner/addPartner", {
      method: "POST",
      body: JSON.stringify(PartnerDetails)
    })

    const data = await response.json()
    console.log(data);
    if (data.sucess) {
      toast.success("partner added sucessfully")
      setpartnerRegistrationPage(false)
      setloading(false)
      fetchAllPartner()
    }
    if (!data.sucess) {
      toast.error(data.message)
      setloading(false)
    }
  }

  //fetch all partners
  const fetchAllPartner = async () => {
    const response = await fetch("/api/partner/getPartner", {
      method: "GET"
    })
    const data = await response.json()
    console.log(data)
    if (data.sucess) {
      const arrayDPALL: any[] = data.allDP
      console.log(arrayDPALL)
      dispatch(setPartner(arrayDPALL))
      console.log(partner)
    }
    if (!data.sucess) return toast.error(data.message)
  }

  //delete an partner 
  const DeletePartner = async (id: string | undefined) => {
    if (!id) return toast.error("id is not available");
    const response = await fetch("/api/partner/deletePartner", {
      method: "DELETE",
      body: JSON.stringify({ id })
    })
    const data = await response.json();
    if (data.success) {
      fetchAllPartner()
      toast.success(data.message)

    }
    if (!data.success) {
      toast.error(data.message)
    }
  }
  return (
    <>
      <Toaster />
      <div className='main1 h-screen md:w-[100%] w-full bg-zinc-950 flex items-center justify-center relative'>
        <div className='line animate-pulse duration-500 hidden md:flex h-screen w-[1px] bg-zinc-800'></div>
        <div className='main2 h-screen md:w-[60%] w-full bg-zinc-950 p-5'>
          <div className="Heading-section create flex h-fit w-full justify-between items-center">
            <div className='text-white text-xl rounded-2xl flex gap-1 justify-center items-center'><Logs />Partner List</div>
            <Button variant={'outline'} className='cursor-pointer' onClick={() => setpartnerRegistrationPage(true)}><Plus />Create an partner</Button>
            {partnerRegistrationPage && <>
              <div className='h-screen w-full bg-zinc-950 absolute left-0 bottom-0 flex items-center justify-center z-10 '>
                <div className='lines animate-pulse duration-500  hidden md:flex h-screen w-[1px] bg-zinc-800'></div>
                <div className='h-screen md:w-[60%] w-full bg-zinc-950 p-5 relative  flex flex-col'>
                  <div className="absolute right-2 top-2 h-fit w-fit text-xl text-white"><Button className='cursor-pointer' onClick={() => setpartnerRegistrationPage(false)}><X /></Button></div>
                  <div className="input  w-full h-[80vh] p-4 flex flex-col items-center gap-2 justify-center">
                    <Input value={formData.name} name='name' onChange={handleChange} type='text' placeholder='Deivery partner name' className=' w-[90%] md:w-[200px] text-white' />
                    <Input value={formData.email} name='email' onChange={handleChange} type='text' placeholder='Deivery partner email' className=' w-[90%] md:w-[200px] text-white' />
                    <Input value={formData.phone} name='phone' onChange={handleChange} type='text' placeholder='Deivery partner phone' className=' w-[90%] md:w-[200px] text-white' />
                    <Input value={formData.shiftFrom} name='shiftFrom' onChange={handleChange} type='text' placeholder='Enter shift from time' className=' w-[90%] md:w-[200px] text-white' />
                    <Input value={formData.shiftTo} name='shiftTo' onChange={handleChange} type='text' placeholder='Enter shift to time' className=' w-[90%] md:w-[200px] text-white' />
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

                    <Button className='cursor-pointer text-xs' onClick={registerPartner}>
                      {loading ? <span><Loader size={20} className='animate-spin' /></span> : <Plus />}
                      Add partner
                    </Button>
                  </div>
                </div>
                <div className='lines animate-pulse duration-500 hidden md:flex h-screen w-[1px] bg-zinc-800'></div>

              </div>
            </>}
          </div>
          <div className="metrics w-full h-[5vh] flex gap-2 items-center justify-start ">
            <div className="active1 h-full w-[40%] flex items-center justify-center ">
              <div className="status w-full flex gap-1 justify-start items-center">
                <div className="blinker animate-pulse duration-1000 h-[7px] w-[7px] bg-green-500 rounded-full"></div>
                <div className="stat-written text-white text-sm h-full w-fit flex">{partner.length} availabe partners</div>
              </div>
            </div>
          </div>
          <div className='partners-list-box h-[90vh] w-full p-4 overflow-auto flex flex-col gap-2'>
            {partner.length > 0 && <>
              {partner.map((item: DeliveryPartnerTypeFromDb, index) => (
                <div key={index} className="IndiVidualPartner w-[100%] h-[6vh] bg-zinc-900 rounded-sm flex p-2">
                  <div className="individualname w-[50%] md:w-[30%] text-white h-full flex items-center justify-start px-1 md:text-sm text-[12px] overflow-hidden">{item.name}</div>
                  <div className="status w-[10%] md:w-[20%] flex gap-1 justify-start items-center">
                    <div className={`blinker animate-pulse duration-1000 h-[7px] w-[7px] ${item.status === 'active' ? "bg-green-500" : "bg-red-500"}  rounded-full shadow-2xl`}></div>
                    <div className="stat-written hidden md:flex text-white text-sm">{item.status === 'active' ? "Active" : "Un Active"}</div>
                  </div>
                  <div className='edit-delete md:w-[47%] w-[35%] flex items-center justify-end gap-2 text-black'>
                    <div><Link href={`/partners/${item._id}`}>
                      <Button variant={'outline'} className='cursor-pointer'><UserPen /><span className='md:inline hidden'>edit</span></Button>
                    </Link>
                    </div>
                    <div className="delete"><Button variant={'outline'} className='cursor-pointer' onClick={() => DeletePartner(item._id)}><Trash2 /><span className='md:inline hidden'>Delete</span></Button></div>
                  </div>
                </div>
              ))}
            </>}
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