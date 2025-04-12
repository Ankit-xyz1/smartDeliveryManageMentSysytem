import DeliveryPartner from "@/models/DeliveryPartner";
import { connectToDatabase } from "@/utils/db";

export async function DELETE(request: Request) {
  await connectToDatabase();

  const { id } = await request.json(); 

  if (!id) {
    return Response.json({ success: false, message: "ID is required" });
  }

  try {
    const deletedPartner = await DeliveryPartner.findByIdAndDelete(id);
    
    if (!deletedPartner) {
      return Response.json({ success: false, message: "Partner not found" });
    }

    return Response.json({
      success: true,
      message: "Partner deleted successfully",
      deletedPartner,
    });
  } catch (error) {
    console.error("Error deleting partner:", error);
    return Response.json({ success: false, message: "Error deleting partner" });
  }
}
