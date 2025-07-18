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
      <div className='min-h-screen w-full bg-zinc-950 relative'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          {/* Header Section */}
          <div className="bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className='flex items-center gap-3'>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Logs size={20} className="text-white" />
                </div>
                <div>
                  <h1 className='text-white text-2xl font-bold'>Partner Management</h1>
                  <p className='text-gray-400 text-sm mt-1'>Manage delivery partners and their assignments</p>
                </div>
              </div>
              <Button 
                variant={'default'} 
                className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200' 
                onClick={() => setpartnerRegistrationPage(true)}
              >
                <Plus size={16} className="mr-2" />
                Add Partner
              </Button>
            </div>
            
            {/* Metrics */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                <div className="flex items-center gap-2">
                  <div className="rounded-full h-3 w-3 bg-green-500 animate-pulse shadow-lg shadow-green-500/30"></div>
                  <span className="text-gray-300 text-sm font-medium">Total Partners</span>
                </div>
                <p className="text-white text-2xl font-bold mt-2">{partner.length}</p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                <div className="flex items-center gap-2">
                  <div className="rounded-full h-3 w-3 bg-blue-500 animate-pulse shadow-lg shadow-blue-500/30"></div>
                  <span className="text-gray-300 text-sm font-medium">Active Partners</span>
                </div>
                <p className="text-white text-2xl font-bold mt-2">
                  {partner.filter(p => p.status === 'active').length}
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                <div className="flex items-center gap-2">
                  <div className="rounded-full h-3 w-3 bg-orange-500 animate-pulse shadow-lg shadow-orange-500/30"></div>
                  <span className="text-gray-300 text-sm font-medium">Available Now</span>
                </div>
                <p className="text-white text-2xl font-bold mt-2">
                  {partner.filter(p => p.status === 'active' && p.currentLoad < 3).length}
                </p>
              </div>
            </div>
          </div>

          {/* Partners List */}
          <div className="bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 overflow-hidden">
            <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 px-6 py-4 border-b border-zinc-800">
              <h2 className="text-white text-lg font-semibold">Partners List</h2>
            </div>
            <div className='p-6'>
              <div className='grid gap-4'>
                {partner.length > 0 ? (
                  partner.map((item: DeliveryPartnerTypeFromDb, index) => (
                    <div key={index} className="bg-zinc-800 rounded-lg p-4 hover:bg-zinc-700 transition-all duration-200 border border-zinc-700 hover:border-zinc-600 shadow-lg">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-lg">
                              {item.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold text-lg truncate">{item.name}</h3>
                            <p className="text-gray-400 text-sm truncate">{item.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className={`rounded-full h-2 w-2 ${item.status === 'active' ? "bg-green-500" : "bg-red-500"} animate-pulse shadow-lg`}></div>
                              <span className={`text-sm font-medium ${item.status === 'active' ? "text-green-400" : "text-red-400"}`}>
                                {item.status === 'active' ? "Active" : "Inactive"}
                              </span>
                              <span className="text-gray-400 text-sm">•</span>
                              <span className="text-gray-400 text-sm">Load: {item.currentLoad || 0}/3</span>
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center gap-3'>
                          <Link href={`/partners/${item._id}`}>
                            <Button 
                              variant={'outline'} 
                              className='bg-zinc-700 hover:bg-zinc-600 border-zinc-600 text-white px-4 py-2 rounded-lg transition-all duration-200'
                            >
                              <UserPen size={16} className="mr-2" />
                              <span className='hidden sm:inline'>Edit</span>
                            </Button>
                          </Link>
                          <Button 
                            variant={'outline'} 
                            className='bg-red-600/20 hover:bg-red-600/30 border-red-600/50 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg transition-all duration-200' 
                            onClick={() => DeletePartner(item._id)}
                          >
                            <Trash2 size={16} className="mr-2" />
                            <span className='hidden sm:inline'>Delete</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Logs size={64} className="mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">No Partners Found</h3>
                    <p className="text-gray-500">Get started by adding your first delivery partner</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Registration Modal */}
            {partnerRegistrationPage && <>
              <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
                <div className='bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
                  <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
                    <h2 className="text-white text-xl font-semibold">Add New Partner</h2>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className='text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg' 
                      onClick={() => setpartnerRegistrationPage(false)}
                    >
                      <X size={20} />
                    </Button>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                          name='email' 
                          onChange={handleChange} 
                          type='email' 
                          placeholder='Enter email address' 
                          className='w-full bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                        />
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
                      <div className="md:col-span-2">
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

                    <div className="flex justify-end gap-3">
                      <Button 
                        variant="outline" 
                        className='bg-zinc-800 border-zinc-700 text-gray-300 hover:bg-zinc-700 hover:text-white px-6 py-2 rounded-lg transition-all duration-200'
                        onClick={() => setpartnerRegistrationPage(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50' 
                        onClick={registerPartner}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader size={16} className='animate-spin mr-2' />
                            Adding...
                          </>
                        ) : (
                          <>
                            <Plus size={16} className="mr-2" />
                            Add Partner
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>}
        </div>
      </div>
    </>
  )
}

export default page