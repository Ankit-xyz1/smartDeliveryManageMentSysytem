import Assignment from "@/models/Assignment";
import DeliveryPartner from "@/models/DeliveryPartner";
import orderModel from "@/models/orderModel";
import { connectToDatabase } from "@/utils/db";

export async function POST(request: Request) {
  //coneccting to db
  await connectToDatabase();
  //parsing body
  const { orderNumber, customer, area, items, scheduledFor, totalAmount } =
    await request.json();
  //checks
  const ifAlreadyExistOrder = await orderModel.findOne({ orderNumber });
  if (ifAlreadyExistOrder) {
    return Response.json({
      sucess: false,
      message: "order Already exisit",
    });
  }

  //calculating the best partner in the area
  const partnerID = await calculate_Metrics(area);
  console.log(partnerID);

  //increasing the partner load
  let pid:string|null = null;
  if (partnerID.success) {
    updatePartnerLoad(partnerID.id);
    pid = partnerID.id
  }
  //saving the assigned oder
  //if no partnerr found the order will be saved in the DB wating for rescheduling
  try {
    const newOrder = await orderModel.create({
      orderNumber,
      customer,
      area,
      items,
      status: `${partnerID.success ? "assigned" : "pending"}`,
      scheduledFor,
      totalAmount,
      assignedTo: pid,
    });
    OrderAssignmentMap(newOrder._id, partnerID.id, newOrder.status);
    return Response.json({
      sucess: true,
      message: "order assigned sucessfully",
      newOrder,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ sucess: false, message: "error at backend" });
  }
}

//for calculating best metrices we can select firstly all the delivery partners that are currently active and availabe for that area
//after filtering out all the partners for that area we can calculate their rating , completedOrders ,cancelledOrders
//who ever has most rating and completed orders will get the order for delivery but if the dp has a x number of cancelled order the second best candidate will get the order

const calculate_Metrics = async (area: string) => {
  //find the partners for same area
  const AP: any[] = await findDPinArea(area);
  if (AP.length < 0) return { success: false, message: "No  partners in area" };
  const activePartners = AP.filter(
    (partner) => partner.status === "active" && partner.currentLoad < 3
  );

  if (activePartners.length === 0) {
    return {
      success: false,
      message: "No active partners available",
      id: null,
    };
  }
  const sortedPartners = activePartners.sort((a, b) => {
    //  sorting  by rating
    if (b.metrics.rating !== a.metrics.rating) {
      return b.metrics.rating - a.metrics.rating;
    }
    // If ratings are the same, sorting  by completedOrders
    return b.metrics.completedOrders - a.metrics.completedOrders;
  });

  // Check if the best partner has too many cancelled orders
  const bestPartner = sortedPartners[0];
  if (bestPartner.metrics.cancelledOrders > 5) {
    // If best partner has more than 3 cancelled orders, pick the second-best
    const secondBestPartner = sortedPartners[1];
    return {
      success: true,
      message: "second best parrtnerr",
      id: secondBestPartner._id,
    };
  }

  return {
    success: true,
    message: "first best partner",
    id: bestPartner._id,
  };
};

//finding the dp in area
const findDPinArea = async (area: string) => {
  try {
    // Find all DeliveryPartners where the 'areas' array contains the specified 'area'
    const matchingPartners = await DeliveryPartner.find({
      areas: { $in: [area] }, // Use $in to find if the area is in the 'areas' array
    });

    if (matchingPartners.length === 0) {
      return [];
    }

    return matchingPartners;
  } catch (error) {
    console.log(error);
    return [];
  }
};

//if oder is assigned updating the partner load
const updatePartnerLoad = async (id: string) => {
  try {
    const partner = await DeliveryPartner.findOne({ _id: id });
    if (!partner) {
      console.error(`Partner with ID ${id} not found.`);
      return;
    }
    partner.currentLoad = (partner.currentLoad ?? 0) + 1;
    await partner.save();
  } catch (error) {
    console.error("Error updating partner load:", error);
  }
};

//updating order map
type Assignment = {
  orderId: string;
  partnerId: string;
  timestamp: Date;
  status: "success" | "failed";
  reason?: string;
};

const OrderAssignmentMap = async (
  orderId: string,
  partnerId: string | null,
  status: string
) => {
  try {
    const assignmentMap = await Assignment.create({
      orderId,
      partnerId,
      status,
      reason: partnerId ? "assigned" : "no partner found",
    });
  } catch (error) {
    console.log(error);
  }
};
