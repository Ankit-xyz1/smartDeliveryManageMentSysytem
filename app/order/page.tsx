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
      <div className='main1 h-screen md:w-[100%] w-full bg-zinc-950 flex items-center justify-center relative'>
        <div className='line animate-pulse duration-500 hidden md:flex h-screen w-[1px] bg-zinc-800'></div>
        <div className='main2 h-screen md:w-[60%] w-full bg-zinc-950 p-5'>
          <div className="Heading-section create flex h-fit w-full justify-between items-center">
            <div className='text-white text-xl rounded-2xl flex gap-1 justify-center items-center'><Logs />OrderList List</div>
            <Button variant={'outline'} className='cursor-pointer' onClick={() => setCreateOrder(true)}><Plus />Create an Order</Button>
            {CreateOrder && <>
              <div className='h-screen w-full bg-zinc-950 absolute left-0 bottom-0 flex items-center justify-center z-10 '>
                <div className='lines animate-pulse duration-500  hidden md:flex h-screen w-[1px] bg-zinc-800'></div>
                <div className='h-screen md:w-[60%] w-full bg-zinc-950 p-5 relative  flex flex-col'>
                  <div className="absolute right-2 top-2 h-fit w-fit text-xl text-white"><Button className='cursor-pointer' onClick={() => setCreateOrder(false)}><X /></Button></div>
                  <div className="input  w-full h-[80vh] p-4 flex flex-col items-center gap-2 justify-center">
                    <Input value={formData.OrderNumber} name='OrderNumber' onChange={handleChange} type='text' placeholder='OrderNumber' className=' w-[90%] md:w-[200px] text-white' />
                    <Input value={formData.name} name='name' onChange={handleChange} type='text' placeholder='name' className=' w-[90%] md:w-[200px] text-white' />
                    <Input value={formData.phone} name='phone' onChange={handleChange} type='text' placeholder='enter phone' className=' w-[90%] md:w-[200px] text-white' />
                    <Input value={formData.address} name='address' onChange={handleChange} type='text' placeholder='Enter adress' className=' w-[90%] md:w-[200px] text-white' />
                    <Input value={formData.area} name='area' onChange={handleChange} type='text' placeholder='Enter area' className=' w-[90%] md:w-[200px] text-white' />
                    <Input value={formData.scheduledFor} name='scheduledFor' onChange={handleChange} type='text' placeholder='Enter Schdule' className=' w-[90%] md:w-[200px] text-white' />
                    <Input value={formData.itemsname} name='itemsname' onChange={handleChange} type='text' placeholder='Enter items' className=' w-[90%] md:w-[200px] text-white' />
                    <Input value={quantity} name='quantity' onChange={handlequantitychange} type='number' placeholder='Enter quantity' className=' w-[90%] md:w-[200px] text-white' />
                    <Input value={price} name='price' onChange={handlepricechange} type='number' placeholder='Enter price' className=' w-[90%] md:w-[200px] text-white' />
                    <Input value={totalAmonut} name='prtotalAmonutice' onChange={handletotalAmonutchange} type='number' placeholder='Enter totalAmonut' className=' w-[90%] md:w-[200px] text-white' />


                    <Button className='cursor-pointer text-xs' onClick={() => AddOrder()} >
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
                <div className="stat-written text-white text-sm h-full w-fit flex">{orders.length} orders</div>
              </div>
            </div>
          </div>
          <div className='partners-list-box h-[90vh] w-full p-4 overflow-auto flex flex-col gap-2'>
            {orders && <>
              {orders.map((item: OrderType, index) => (
                <span key={index}>
                  <div className="IndiVidualorder w-[100%] h-[6vh] bg-zinc-900 rounded-sm flex p-2">
                    <div className="individualname w-[50%] md:w-[30%] text-white h-full flex items-center justify-start px-1 md:text-sm text-[12px] overflow-hidden">{item.orderNumber}</div>
                    <div className="status w-[10%] md:w-[20%] flex gap-1 justify-start items-center">
                      <div className={`blinker animate-pulse duration-1000 h-[7px] w-[7px] ${item.status === "assigned" ? " bg-green-500" : "bg-red-500"} rounded-full shadow-2xl`}></div>
                      <div className="stat-written hidden md:flex text-white text-sm">{item.status === "assigned" ? "Assigned" : "Pending"}</div>
                    </div>
                    <div className='edit-delete md:w-[47%] w-[35%] flex items-center justify-end gap-2 text-black'>
                      <div><Button variant={'outline'} className='cursor-pointer'><CalendarDays /><span className='md:inline hidden'>{dateFormatter(item.createdAt)}</span></Button></div>
                      <div className="delete"><Button variant={'outline'} className='cursor-pointer'><History /><span className='md:inline hidden'>{item.assignedTo}</span></Button></div>
                    </div>
                  </div>
                </span>
              ))}

            </>}
          </div>
        </div>
        <div className='line animate-pulse duration-500 hidden md:flex h-screen w-[1px] bg-zinc-800'></div>
      </div>
    </>
  )
}

export default page