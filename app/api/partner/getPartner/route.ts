import DeliveryPartner from "@/models/DeliveryPartner";
import { connectToDatabase } from "@/utils/db";

export async function GET() {
  await connectToDatabase();
  try {
      const allDP= await DeliveryPartner.find({})
      return Response.json({ sucess:true , message:"fetched all Parrtners" ,allDP});
  } catch (error) {
    return Response.json({ sucess:false , message:"error at backend"});
  }
}
