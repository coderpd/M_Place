"use client";

import ProductCards from "./productcards/page";
import ChunkErrorHandler from "../Components/ChunkErrorHandler";

export default function VendorDashboardPage() {
  return (
    <div>
      <ChunkErrorHandler/>
   <ProductCards/>
    </div>
  );
}
