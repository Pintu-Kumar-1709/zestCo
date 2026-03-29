import connectDB from "@/lib/db";
import AdminDashboardClient from "./AdminDashboardClient";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import Grocery from "@/models/grocery.model";

const AdminDashboard = async () => {
  await connectDB();
  const orders = await Order.find({});
  const users = await User.find({});
  const groceries = await Grocery.find({});

  const totalOrders = orders.length;
  const totalUsers = users.length;
  const pendingDeliveries = orders.filter(
    (or) => or.status !== "delivered",
  ).length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const today = new Date();
  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);

  const todaysOrders = orders.filter(
    (o) => new Date(o.createdAt) >= startOfToday,
  );
  const todaysRevenue = todaysOrders.reduce(
    (sum, o) => sum + (o.totalAmount || 0),
    0,
  );

  const sevenDaysOrders = orders.filter(
    (o) => new Date(o.createdAt) >= sevenDaysAgo,
  );
  const sevenDaysRevenue = sevenDaysOrders.reduce(
    (sum, o) => sum + (o.totalAmount || 0),
    0,
  );

  const stats = [
    { title: "Total Orders", value: totalOrders },
    { title: "Total Users", value: totalUsers },
    { title: "Pending Deliveries", value: pendingDeliveries },
    { title: "Total Revenue", value: totalRevenue },
  ];

  const chartData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const orderCount = orders.filter(
      (o) => new Date(o.createdAt) >= date && new Date(o.createdAt) < nextDay,
    ).length;
    chartData.push({
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      orders: orderCount,
    });
  }

  return (
    <>
      <AdminDashboardClient
        earning={{
          today: todaysRevenue,
          sevenDaysAgo: sevenDaysRevenue,
          total: totalRevenue,
        }}
        stats={stats}
        chartData={chartData}
      />
    </>
  );
};

export default AdminDashboard;
