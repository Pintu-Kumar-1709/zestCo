import { auth } from "@/auth";
import DeliveryBoyDashboard from "./DeliveryBoyDashboard";
import connectDB from "@/lib/db";
import Order from "@/models/order.model";

export const revalidate = 0;

const DeliveryBoy = async () => {
  await connectDB();
  const session = await auth();
  const deliveryBoyId = session?.user?.id;

  const orders = await Order.find({
    assignedDeliveryBoy: deliveryBoyId,
    status: "delivered",
    deliveryOtpVerification: true,
  });

  const today = new Date().toDateString();

  const todayOrders = orders.filter((or) => {
    if (!or.deliveredAt) return false;
    return new Date(or.deliveredAt).toDateString() === today;
  });

  const todaysTotalEarning = todayOrders.reduce((acc, order) => {
    return acc + (order.totalAmount || 0);
  }, 0);

  return (
    <>
      <DeliveryBoyDashboard
        earning={todaysTotalEarning}
        orderCount={todayOrders.length}
      />
    </>
  );
};

export default DeliveryBoy;
