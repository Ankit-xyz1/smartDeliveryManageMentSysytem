import DeliveryPartner from "@/models/DeliveryPartner";
import { connectToDatabase } from "@/utils/db";

export async function PUT(request: Request) {
  await connectToDatabase();
  const { name, email, status, phone, areas, shift } = await request.json();
  const ifAlreadyExistDP = await DeliveryPartner.findOne({ email });
  if (ifAlreadyExistDP) {
    try {
      const updatedPartner = await DeliveryPartner.updateOne(
        {email},
        {
            $set: { name, phone, areas, shift, status }
        }
      );
      return Response.json({
        sucess: true,
        message: "partner added sucessfully",
        updatedPartner,
      });
    } catch (error) {
      return Response.json({ sucess: false, message: "error at backend" });
    }
  }else{
    return Response.json({ sucess: false, message: "partner not found" })
  }
}
