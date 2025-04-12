import Assignment from "@/models/Assignment";
import DeliveryPartner from "@/models/DeliveryPartner";
import orderModel from "@/models/orderModel";
import { connectToDatabase } from "@/utils/db";
import mongoose from "mongoose";

export async function GET() {
  await connectToDatabase();
  try {
    const allAssignMents = await Assignment.find({});
    return Response.json({
      sucess: true,
      message: "fetched all Parrtners",
      allAssignMents,
    });
  } catch (error) {
    return Response.json({ sucess: false, message: "error at backend" });
  }
}

export async function POST() {
  await connectToDatabase();
  try {
    const allpendingOrders: any[] = await orderModel.find({
      status: "pending",
    });
    console.log(allpendingOrders);
    for (let i = 0; i < allpendingOrders.length; i++) {
      const item = allpendingOrders[i];
      const partnerID = await calculate_Metrics(item.area);
      let pid: string | null = null;
      if (!partnerID.success) {
        continue;
      }
      if (partnerID.success) {
        updatePartnerLoad(partnerID.id);
        pid = partnerID.id;
      }
      const findOrderAndUpdateStatus = await orderModel.findOne({
        _id: item._id,
      });
      if (findOrderAndUpdateStatus) {
        findOrderAndUpdateStatus.status = "assigned";
        findOrderAndUpdateStatus.assignedTo = pid;
        await findOrderAndUpdateStatus.save();
      }
      updateAssignment(
        findOrderAndUpdateStatus._id,
        findOrderAndUpdateStatus.assignedTo
      );
    }
    return Response.json({
      sucess: true,
      message: "assigned orders to free partners in the area",
    });
  } catch (error) {
    console.log(error);
    return Response.json({ sucess: false, message: "error at backend" });
  }
}

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

//update assignment

const updateAssignment = async (orderId: string, partnerId: string) => {
  try {
    // Validate ObjectId before using it
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      console.error("Invalid orderId:", orderId);
      return;
    }

    const assignmentToBeUpdated = await Assignment.findOne({
      orderId: new mongoose.Types.ObjectId(orderId),
    });

    if (!assignmentToBeUpdated) {
      console.log("Assignment not found for orderId:", orderId);
      return;
    }

    assignmentToBeUpdated.partnerId = new mongoose.Types.ObjectId(partnerId);
    assignmentToBeUpdated.status = "assigned";

    await assignmentToBeUpdated.save();
    console.log("Assignment updated successfully!");
  } catch (error) {
    console.error("Error updating assignment:", error);
  }
};
