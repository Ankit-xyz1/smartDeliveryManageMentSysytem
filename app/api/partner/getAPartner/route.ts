import DeliveryPartner from "@/models/DeliveryPartner";
import { connectToDatabase } from "@/utils/db";

export async function POST(request:Request) {
  await connectToDatabase();
  const {id} = await request.json();
  try {
      const DP= await DeliveryPartner.findOne({_id:id})
      return Response.json({ sucess:true , message:"fetched all Parrtners" ,DP});
  } catch (error) {
    return Response.json({ sucess:false , message:"error at backend"});
  }
}
