import orderModel from "@/models/orderModel";
import { connectToDatabase } from "@/utils/db";

export async function GET() {
  await connectToDatabase();
  try {
    const allOrders = await orderModel.find({});
    return Response.json({
      sucess: true,
      message: "fetched all orders",
      allOrders,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ sucess: false, message: "error at backend" });
  }
}
