"use client"
import Navbar from "@/components/navbar/Navbar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store/store";
import toast, { Toaster } from "react-hot-toast";
import { setassigment } from "./redux/slice/allAssignmentSlice";

export default function Home() {
  const dispatch = useDispatch()
  const assignments = useSelector((state: RootState) => state.assigments.value)
  const partners = useSelector((state: RootState) => state.partners.value)
  const orders = useSelector((state: RootState) => state.orders.value)

  const [activeOrder, setactiveOrder] = useState<any[]>([])
  const [activepartners, setactivepartners] = useState<any[]>([])

  const [loading, setloading] = useState<boolean>(false)
  useEffect(() => {
    fetchAllAssignments();
    activerOrderMap();
    activerpartnersMap();
  }, [])

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
          <div className="w-[100%] h-full md:w-[50%] bg-red-600 p-2 flex flex-col">
            <div className="metricsCar w-full h-[46%] bg-emerald-300"></div>
            <div className="activeOrders metricsCar w-full h-[46%] bg-emerald-500"></div>
          </div>
          <div className="w-[100%] h-full md:w-[50%] bg-blue-600 p-2">
            <div className="recentAssignments bg-green-600 h-full w-full"></div>
          </div>
        </div>
        <div className='hidden md:flex h-full w-[1px] bg-zinc-800'></div>
      </div>
    </>
  );
}
