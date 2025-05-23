import {Image} from "./Image";

export interface CakeDesigner {
  id: number;
  name: string;
  description: string;
  weight: number | null;
  total_cost: number | null;
  id_coverage: number;
  id_cake_form: number;
  id_product: number;
  images: Image[];
}
