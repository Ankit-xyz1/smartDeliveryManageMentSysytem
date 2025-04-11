import Navbar from "@/components/navbar/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className='main h-screen md:w-[100%] w-full bg-zinc-950 flex items-center justify-center'>
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
