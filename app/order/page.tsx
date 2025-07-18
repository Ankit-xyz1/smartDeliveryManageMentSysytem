"use client"
import { Button } from '@/components/ui/button'
import { CalendarDays, History, Loader, Logs, Plus, Trash2, UserPen, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { setOrder } from '../redux/slice/allOrdersSlice';
import { OrderType } from '@/types';
import { Input } from '@/components/ui/input';

const page = () => {
  const dispatch = useDispatch()
  const orders = useSelector((state: RootState) => state.orders.value)
  interface partnerDetais {
    name: string,
    email: string,
    phone: string,
    shiftFrom: string,
    shiftTo: string,
  }
  const [CreateOrder, setCreateOrder] = useState<boolean>(false);
  const [loading, setloading] = useState<boolean>(false)

  const [quantity, setquantity] = useState<number>()
  const [price, setprice] = useState<number>()
  const [totalAmonut, settotalAmonut] = useState<number>()
  const [formData, setFormData] = useState({
    OrderNumber: '',
    name: '',
    phone: '',
    address: '',
    area: '',
    itemsname: '',
    scheduledFor: '',
  });

  useEffect(() => {
    FetchallOrders()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handletotalAmonutchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    settotalAmonut(Number(e.target.value))
  }
  const handlepricechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setprice(Number(e.target.value))
  }
  const handlequantitychange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setquantity(Number(e.target.value))
  }

  const FetchallOrders = async () => {

    try {
      const response = await fetch('/api/order/getOrder', {
        method: "GET"
      })
      const data = await response.json()
      console.log(data.allOrders)
      if (!data.sucess) toast.error(data.message)
      if (data.sucess) {
        dispatch(setOrder(data.allOrders))
      }

    } catch (error) {
      console.log(error);
      toast.error("error occured try later")
    }
  }

  function dateFormatter(createdAt: any): any {
    const date = new Date(createdAt);
    return date.toISOString().split("T")[0];
  }

  const AddOrder = async () => {
    setloading(true)
    const body = {
      orderNumber: formData.OrderNumber,
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      area: formData.area,
      itemsname: formData.itemsname,
      scheduledFor: formData.scheduledFor,
      quantity,
      price,
      totalAmonut
    }
    try {
      const response = await fetch("/api/order/assignOrder", {
        method: "POST",
        body: JSON.stringify(body)
      })
      const data = await response.json()
      if (!data.sucess) {
        setloading(false)
        return toast.error(data.message)
      }
      if (data.sucess) {
        toast.success("created an order sucessfully")
        FetchallOrders();
      }
      setloading(false)
    } catch (error) {
      console.log("f",error);
      toast.error("some error occured")
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
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Logs size={20} className="text-white" />
                </div>
                <div>
                  <h1 className='text-white text-2xl font-bold'>Order Management</h1>
                  <p className='text-gray-400 text-sm mt-1'>Track and manage delivery orders</p>
                </div>
              </div>
              <Button 
                variant={'default'} 
                className='bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200' 
                onClick={() => setCreateOrder(true)}
              >
                <Plus size={16} className="mr-2" />
                Create Order
              </Button>
            </div>
            
            {/* Metrics */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                <div className="flex items-center gap-2">
                  <div className="rounded-full h-3 w-3 bg-blue-500 animate-pulse shadow-lg shadow-blue-500/30"></div>
                  <span className="text-gray-300 text-sm font-medium">Total Orders</span>
                </div>
                <p className="text-white text-2xl font-bold mt-2">{orders.length}</p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                <div className="flex items-center gap-2">
                  <div className="rounded-full h-3 w-3 bg-green-500 animate-pulse shadow-lg shadow-green-500/30"></div>
                  <span className="text-gray-300 text-sm font-medium">Assigned</span>
                </div>
                <p className="text-white text-2xl font-bold mt-2">
                  {orders.filter(o => o.status === 'assigned').length}
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                <div className="flex items-center gap-2">
                  <div className="rounded-full h-3 w-3 bg-orange-500 animate-pulse shadow-lg shadow-orange-500/30"></div>
                  <span className="text-gray-300 text-sm font-medium">Pending</span>
                </div>
                <p className="text-white text-2xl font-bold mt-2">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 overflow-hidden">
            <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 px-6 py-4 border-b border-zinc-800">
              <h2 className="text-white text-lg font-semibold">Orders List</h2>
            </div>
            <div className='p-6'>
              <div className='grid gap-4'>
                {orders.length > 0 ? (
                  orders.map((item: OrderType, index) => (
                    <div key={index} className="bg-zinc-800 rounded-lg p-4 hover:bg-zinc-700 transition-all duration-200 border border-zinc-700 hover:border-zinc-600 shadow-lg">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-lg">
                              {item.orderNumber.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold text-lg truncate">{item.orderNumber}</h3>
                            <p className="text-gray-400 text-sm truncate">{item.customer?.name || 'N/A'}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className={`rounded-full h-2 w-2 ${item.status === "assigned" ? "bg-green-500" : "bg-red-500"} animate-pulse shadow-lg`}></div>
                              <span className={`text-sm font-medium ${item.status === "assigned" ? "text-green-400" : "text-red-400"}`}>
                                {item.status === "assigned" ? "Assigned" : "Pending"}
                              </span>
                              <span className="text-gray-400 text-sm">•</span>
                              <span className="text-gray-400 text-sm">{item.area}</span>
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center gap-3'>
                          <div className="bg-zinc-700 rounded-lg px-3 py-2 border border-zinc-600">
                            <div className="flex items-center gap-2">
                              <CalendarDays size={16} className="text-blue-400" />
                              <span className="text-white text-sm font-medium">
                                {dateFormatter(item.createdAt)}
                              </span>
                            </div>
                          </div>
                          {item.assignedTo && (
                            <div className="bg-zinc-700 rounded-lg px-3 py-2 border border-zinc-600">
                              <div className="flex items-center gap-2">
                                <History size={16} className="text-purple-400" />
                                <span className="text-white text-sm font-medium truncate max-w-20">
                                  {item.assignedTo.substring(0, 8)}...
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Logs size={64} className="mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
                    <p className="text-gray-500">Create your first order to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Create Order Modal */}
            {CreateOrder && <>
              <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
                <div className='bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
                  <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
                    <h2 className="text-white text-xl font-semibold">Create New Order</h2>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className='text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg' 
                      onClick={() => setCreateOrder(false)}
                    >
                      <X size={20} />
                    </Button>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Order Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-4">Order Details</h3>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Order Number</label>
                          <Input 
                            value={formData.OrderNumber} 
                            name='OrderNumber' 
                            onChange={handleChange} 
                            type='text' 
                            placeholder='Enter order number' 
                            className='w-full bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Area</label>
                          <Input 
                            value={formData.area} 
                            name='area' 
                            onChange={handleChange} 
                            type='text' 
                            placeholder='Enter delivery area' 
                            className='w-full bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Scheduled For</label>
                          <Input 
                            value={formData.scheduledFor} 
                            name='scheduledFor' 
                            onChange={handleChange} 
                            type='datetime-local' 
                            placeholder='Select schedule' 
                            className='w-full bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                          />
                        </div>
                      </div>

                      {/* Customer Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-4">Customer Details</h3>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Customer Name</label>
                          <Input 
                            value={formData.name} 
                            name='name' 
                            onChange={handleChange} 
                            type='text' 
                            placeholder='Enter customer name' 
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
                          <label className="block text-sm font-medium text-gray-300 mb-2">Delivery Address</label>
                          <Input 
                            value={formData.address} 
                            name='address' 
                            onChange={handleChange} 
                            type='text' 
                            placeholder='Enter delivery address' 
                            className='w-full bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Item Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Item Name</label>
                          <Input 
                            value={formData.itemsname} 
                            name='itemsname' 
                            onChange={handleChange} 
                            type='text' 
                            placeholder='Enter item name' 
                            className='w-full bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                          <Input 
                            value={quantity} 
                            name='quantity' 
                            onChange={handlequantitychange} 
                            type='number' 
                            placeholder='Enter quantity' 
                            className='w-full bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Price per Item</label>
                          <Input 
                            value={price} 
                            name='price' 
                            onChange={handlepricechange} 
                            type='number' 
                            placeholder='Enter price' 
                            className='w-full bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Total Amount</label>
                          <Input 
                            value={totalAmonut} 
                            name='totalAmount' 
                            onChange={handletotalAmonutchange} 
                            type='number' 
                            placeholder='Enter total amount' 
                            className='w-full bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                      <Button 
                        variant="outline" 
                        className='bg-zinc-800 border-zinc-700 text-gray-300 hover:bg-zinc-700 hover:text-white px-6 py-2 rounded-lg transition-all duration-200'
                        onClick={() => setCreateOrder(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className='bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50' 
                        onClick={() => AddOrder()}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader size={16} className='animate-spin mr-2' />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Plus size={16} className="mr-2" />
                            Create Order
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>}
        </div>
    </>
  )
}

export default page