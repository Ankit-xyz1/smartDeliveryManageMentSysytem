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
      <div className='min-h-screen w-full bg-zinc-950 relative'>
        <Toaster/>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href={'/partners'}>
              <Button variant="outline" size="icon" className='bg-zinc-800 border-zinc-700 text-gray-300 hover:bg-zinc-700 hover:text-white rounded-lg'>
                <CircleChevronLeft size={20} />
              </Button>
            </Link>
            <div>
              <h1 className="text-white text-2xl font-bold">Edit Partner</h1>
              <p className="text-gray-400 text-sm">Update partner information and settings</p>
            </div>
          </div>

          {/* Edit Form */}
          <div className='bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 overflow-hidden'>
            <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 px-6 py-4 border-b border-zinc-800">
              <h2 className="text-white text-lg font-semibold">Partner Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Partner Name</label>
                  <Input 
                    value={formData.name} 
                    name='name' 
                    onChange={handleChange} 
                    type='text' 
                    placeholder='Enter partner name' 
                    className='w-full bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <Input 
                    value={formData.email} 
                    readOnly 
                    name='email'  
                    type='text' 
                    placeholder='Email address' 
                    className='w-full bg-zinc-700 border-zinc-600 text-gray-300 cursor-not-allowed' 
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                  <Input 
                    value={formData.phone} 
                    name='phone' 
                    onChange={handleChange} 
                    type='tel' 
                    placeholder='Enter phone number' 
                    className='w-full bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                      status === 'active' 
                        ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                        : 'bg-red-500/20 border-red-500/30 text-red-400'
                    }`}>
                      <div className={`rounded-full h-2 w-2 ${status === 'active' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                      <span className="text-sm font-medium">{status === 'active' ? 'Active' : 'Inactive'}</span>
                    </div>
                    <Button 
                      variant="outline"
                      className={`${
                        status === 'active' 
                          ? 'bg-red-600/20 hover:bg-red-600/30 border-red-600/50 text-red-400 hover:text-red-300' 
                          : 'bg-green-600/20 hover:bg-green-600/30 border-green-600/50 text-green-400 hover:text-green-300'
                      } transition-all duration-200`}
                      onClick={() => setstatus(status === 'active' ? 'unActive' : 'active')}
                    >
                      {status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Shift Start</label>
                  <Input 
                    value={formData.shiftFrom} 
                    name='shiftFrom' 
                    onChange={handleChange} 
                    type='time' 
                    placeholder='09:00' 
                    className='w-full bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Shift End</label>
                  <Input 
                    value={formData.shiftTo} 
                    name='shiftTo' 
                    onChange={handleChange} 
                    type='time' 
                    placeholder='17:00' 
                    className='w-full bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                  />
                </div>
              </div>

              {/* Service Areas */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Service Areas</label>
                <div className='flex gap-2 mb-3'>
                  <Input 
                    value={areaValue} 
                    onChange={handlAreaChnage} 
                    type='text' 
                    placeholder='Enter service area' 
                    className='flex-1 bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                  />
                  <Button 
                    type="button"
                    className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200' 
                    onClick={() => addArea()}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                {areaArr.length > 0 && (
                  <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                    <h3 className='text-sm font-medium text-purple-400 mb-3'>Service Areas ({areaArr.length})</h3>
                    <div className="flex flex-wrap gap-2">
                      {areaArr.map((item, index) => (
                        <span key={index} className="inline-flex items-center gap-2 bg-zinc-700 text-white px-3 py-1 rounded-full text-sm border border-zinc-600">
                          {item}
                          <button 
                            type="button"
                            onClick={() => removeAreaFromArr(index)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <Link href="/partners">
                  <Button 
                    variant="outline" 
                    className='bg-zinc-800 border-zinc-700 text-gray-300 hover:bg-zinc-700 hover:text-white px-6 py-2 rounded-lg transition-all duration-200'
                  >
                    Cancel
                  </Button>
                </Link>
                <Button 
                  className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50' 
                  onClick={updatePartner}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader size={16} className='animate-spin mr-2' />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CircleFadingArrowUp size={16} className="mr-2" />
                      Update Partner
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default page