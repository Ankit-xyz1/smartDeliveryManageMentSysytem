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
      <div className='main min-h-screen w-full bg-zinc-950 pt-4'>
        <Toaster />
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
            {/* Free Partners Section */}
            <div className="bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 overflow-hidden">
              <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 px-6 py-4 border-b border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full h-3 w-3 bg-green-500 animate-pulse shadow-lg shadow-green-500/30"></div>
                      <User size={20} className="text-green-400" />
                      <span className="text-white font-semibold">Free Partners</span>
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        {activepartners.length}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-orange-400">
                    <div className="rounded-full h-3 w-3 bg-orange-500 animate-pulse shadow-lg shadow-orange-500/30"></div>
                    <span className="text-sm font-medium">Busy: {partners.length - activepartners.length}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 max-h-80 overflow-y-auto">
                {activepartners && <>
                  {activepartners.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg mb-2 hover:bg-zinc-700 transition-colors border border-zinc-700">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User size={14} className="text-white" />
                        </div>
                        <span className="text-white font-medium truncate">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-zinc-700 text-gray-300 px-3 py-1 rounded-full text-xs font-medium">
                          Load: {item.currentLoad}/3
                        </span>
                      </div>
                    </div>
                  ))}
                </>}
                {activepartners.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <User size={48} className="mx-auto mb-3 opacity-50" />
                    <p>No free partners available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Active Orders Section */}
            <div className="bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 overflow-hidden">
              <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 px-6 py-4 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="rounded-full h-3 w-3 bg-green-500 animate-pulse shadow-lg shadow-green-500/30"></div>
                  <Box size={20} className="text-green-400" />
                  <span className="text-white font-semibold">Active Orders</span>
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {activeOrder.length}
                  </span>
                </div>
              </div>
              <div className="p-4 max-h-80 overflow-y-auto">
                {activeOrder && <>
                  {activeOrder.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg mb-2 hover:bg-zinc-700 transition-colors border border-zinc-700">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                          <Box size={14} className="text-white" />
                        </div>
                        <span className="text-white font-medium truncate">{item.orderNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-zinc-700 text-gray-300 px-3 py-1 rounded-full text-xs font-medium">
                          {item.area}
                        </span>
                      </div>
                    </div>
                  ))}
                </>}
                {activeOrder.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Box size={48} className="mx-auto mb-3 opacity-50" />
                    <p>No active orders</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Assignments Section */}
          <div className="bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 overflow-hidden">
            <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 px-6 py-4 border-b border-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full h-3 w-3 bg-blue-500 animate-pulse shadow-lg shadow-blue-500/30"></div>
                  <FileClock size={20} className="text-blue-400" />
                  <span className="text-white font-semibold">Recent Assignments</span>
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {assignments.length}
                  </span>
                </div>
                <Button 
                  onClick={RunAssignMents} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50" 
                  disabled={loading}
                >
                  {loading && <Loader className="animate-spin mr-2" size={16} />}
                  {loading ? 'Running...' : 'Run Assignment'}
                </Button>
              </div>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {assignments && <>
                  {assignments.map((item, index) => (
                    <div key={index} className="p-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors border border-zinc-700">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                          <Blocks size={14} className="text-white" />
                        </div>
                        <span className="text-white font-mono text-sm truncate">
                          {(item._id).substr(0, 8)}...
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'assigned' 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </>}
              </div>
              {assignments.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <FileClock size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No recent assignments</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
