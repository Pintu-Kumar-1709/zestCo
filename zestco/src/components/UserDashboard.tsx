import connectDB from "@/lib/db";
import CategorySlider from "./CategorySlider";
import HeroSection from "./HeroSection";
import { IGrocery } from "@/models/grocery.model";
import GroceryItemsCards from "./GroceryItemsCards";

const UserDashboard = async ({ groceryList }: { groceryList: IGrocery[] }) => {
  await connectDB();

  const plainGrocery = JSON.parse(JSON.stringify(groceryList));
  return (
    <>
      <HeroSection />
      <CategorySlider />
      <div className="w-[90%] md:w-[80%] mx-auto mt-10">
        <h2 className="text-2xl md:text-3xl font-bold text-amber-700 mb-6 text-center">
          Super Grocery Items
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {plainGrocery.map((item: any, index: number) => (
            <GroceryItemsCards key={index} item={item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
