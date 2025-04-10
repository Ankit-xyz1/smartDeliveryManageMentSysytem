import DeliveryPartner from "@/models/DeliveryPartner";
import { connectToDatabase } from "@/utils/db";

export async function POST(request: Request) {
  await connectToDatabase();
  const { name, email,phone,areas,shift } = await request.json();
  const ifAlreadyExistDP= await DeliveryPartner.findOne({email})
  if(ifAlreadyExistDP) return Response.json({ sucess:false , message:"partner is already there"});
  try {
      const newPartner = await  DeliveryPartner.create({
        name,
        email,
        phone,
        areas,
        shift
      })
      return Response.json({ sucess:true , message:"partner added sucessfully" ,newPartner});
  } catch (error) {
    return Response.json({ sucess:false , message:"error at backend"});
  }
}
