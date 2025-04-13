"use client"
import Navbar from "@/components/navbar/Navbar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store/store";
import toast, { Toaster } from "react-hot-toast";
import { setassigment } from "./redux/slice/allAssignmentSlice";
import { setPartner } from "./redux/slice/allPartnersSLice";
import { setOrder } from "./redux/slice/allOrdersSlice";
import { Blocks, Box, FileClock, Loader, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const dispatch = useDispatch()
  const assignments = useSelector((state: RootState) => state.assigments.value)
  const partners = useSelector((state: RootState) => state.partners.value)
  const orders = useSelector((state: RootState) => state.orders.value)

  const [activeOrder, setactiveOrder] = useState<any[]>([])
  const [activepartners, setactivepartners] = useState<any[]>([])

  const [loading, setloading] = useState<boolean>(false)
  useEffect(() => {
    //fethcing all orders assignments and parers
    fetchAllAssignments();
    fetchAllPartner();
    FetchallOrders();

  }, [])

  useEffect(() => {
    //filtering active orders and partner 
    //criteria orders which are assigned are active
    //and partners who have currentoad less than 3 an are active are free
    activerOrderMap();
    activerpartnersMap();
    console.log(activeOrder)
    console.log(activepartners)
  }, [partners, orders])


  const fetchAllPartner = async () => {
    const response = await fetch("/api/partner/getPartner", {
      method: "GET"
    })
    const data = await response.json()
    console.log(data)
    if (data.sucess) {
      const arrayDPALL: any[] = data.allDP
      dispatch(setPartner(arrayDPALL))
    }
    if (!data.sucess) return toast.error(data.message)
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
  const fetchAllAssignments = async () => {
    try {
      const response = await fetch('/api/assignments', {
        method: "GET"
      })
      const data = await response.json()
      console.log(data)
      dispatch(setassigment(data.allAssignMents))
    } catch (error) {
      console.log(error)
      toast.error("some error occured")
    }
  }

  const RunAssignMents = async () => {
    setloading(true)
    try {
      const response = await fetch('/api/assignments', {
        method: "POST"
      })
      const data = await response.json()
      if (data.sucess) {
        toast.success("assigned deliveries to availabe partners")
      }
    } catch (error) {
      console.log(error)
      toast.error("some error occured")
    }
    setloading(false)
  }
  const activerOrderMap = () => {
    const assignedOnly: any[] = orders.filter(item => item.status === "assigned");
    setactiveOrder(assignedOnly)
  }
  const activerpartnersMap = () => {
    const availablePartners: any[] = partners.filter(
      partner => partner.status === "active" && partner.currentLoad < 3
    );
    setactivepartners(availablePartners)
  }
  return (
    <>
      <div className='main h-screen md:w-[100%] w-full bg-zinc-950 flex items-center justify-center'>
        <Toaster />
        <div className='hidden md:flex h-screen w-[1px] bg-zinc-800'></div>
        <div className='main h-screen md:w-[60%] w-full bg-zinc-950 flex flex-wrap p-4'>
          <div className="w-[100%] h-full md:w-[50%]  p-2 flex flex-col">
            <div className="metricsCar w-full h-[46%]  flex flex-col gap-2">
              <div className="heading w-full h-[5vh] text-white p-2 flex gap-1 items-center justify-around bg-zinc-900 rounded-sm">
                <div className="flex items-center gap-1">
                  <div className="rounded-full h-[6px] w-[6px] bg-green-500 animate-pulse duration-500">
                  </div><User size={20} />Free partners {activepartners.length}
                </div>
                <div className="busy ml-1.5 flex items-center gap-1">
                  <div className="rounded-full h-[6px] w-[6px] bg-orange-500 animate-pulse duration-500"></div>
                  Busy Partners {partners.length - activepartners.length}
                </div>

              </div>
              <div className="h-[80%] w-full  overflow-auto p-2 flex flex-col gap-0.5">
                {activepartners && <>
                  {activepartners.map((item, index) => (
                    <div key={index} className="indi bg-zinc-800 p-1 rounded text-white flex gap-0.5"><span className="flex w-[50%] overflow-hidden"><User size={20} /> {item.name}</span> <span className="ml-4 bg-zinc-700 px-2 rounded-xl">currentLoad:{item.currentLoad}</span></div>
                  ))}
                </>}
              </div>
            </div>
            <div className="w-full h-[1px] bg-zinc-600 mb-2"></div>
            <div className="activeOrders metricsCar w-full h-[46%]  ">
              <div className="heading w-full h-[5vh] text-white p-2 flex gap-1 items-center justify-around bg-zinc-900 rounded-sm">
                <div className="flex items-center gap-1">
                  <div className="rounded-full h-[6px] w-[6px] bg-green-500 animate-pulse duration-500">
                  </div><Box size={20} /> active Orders {activeOrder.length}
                </div>


              </div>
              <div className="h-[80%] w-full  overflow-auto p-2 flex flex-col gap-0.5">
                {activeOrder && <>
                  {activeOrder.map((item, index) => (
                    <div key={index} className="indi bg-zinc-800 p-1 rounded text-white flex gap-0.5"><span className="w-[50%] flex gap-1 overflow-hidden"><Box size={20} /> {item.orderNumber} </span> <span className="ml-4 bg-zinc-700 px-2 rounded-xl">Area :{item.area}</span></div>
                  ))}
                </>}
              </div>
            </div>
          </div>
          {/* recent assignments */}
          <div className="w-[100%] h-full md:w-[50%] p-3">
            <div className="recentAssignments  h-full w-full">
              <div className="heading w-full h-[5vh] text-white p-2 flex gap-1 items-center justify-around bg-zinc-900 rounded-sm">
                <div className="flex items-center gap-1">
                  <div className="rounded-full h-[6px] w-[6px] bg-green-500 animate-pulse duration-500">
                  </div> <FileClock size={20} />Recent assignments
                </div>

              </div>
              <div className="h-[80%]  w-full  overflow-auto p-2 flex flex-col gap-0.5">
                {assignments && <>
                  {assignments.map((item, index) => (
                    <div key={index} className="indi bg-zinc-800 p-1 rounded text-white flex gap-0.5"><span className="w-[50%] overflow-hidden flex gap-2"><Blocks size={20} /> {(item._id).substr(7, 5)}....</span> <span className="ml-4 bg-zinc-700 px-2 rounded-xl">Status:{" "+item.status}</span></div>
                  ))}
                </>}
              </div>
              <div className="w-full h-[8vh]  flex items-center justify-center">
                <Button onClick={RunAssignMents} className="cursor-pointer" variant={"outline"}>{loading && <Loader className="animate-spin" size={20} />}Run AssignMent</Button>
              </div>
            </div>
          </div>
        </div>
        <div className='hidden md:flex h-full w-[1px] bg-zinc-800'></div>
      </div>
    </>
  );
}
