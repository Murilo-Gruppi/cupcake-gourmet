import { NextRequest } from "next/server";
import { productService } from "@/modules/products/product.service";
import { successResponse, handleRouteError } from "@/lib/utils/http";

// GET /api/categories
export async function GET(_req: NextRequest) {
  try {
    const categories = await productService.listCategories();
    return successResponse(categories);
  } catch (error) {
    return handleRouteError(error);
  }
}
