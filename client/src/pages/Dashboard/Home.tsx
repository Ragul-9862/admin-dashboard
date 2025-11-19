import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
    api.get("/category").then((res) => setCategories(res.data));
  }, []);

  return (
    <>
      <PageMeta
        title="ADMIN DASHBOARD"
        description=""
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          {/* PASS BOTH COUNTS */}
          <EcommerceMetrics
            productsCount={products.length}
            categoryCount={categories.length}
          />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget
            productsCount={products.length}
            categoryCount={categories.length}
          />
        </div>
      </div>
    </>
  );
}
