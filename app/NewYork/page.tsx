import Layout from "@/src/components/layout/layout";
import { CITY_CONFIG } from "@/src/config/cities.config";

export default function NewYorkPage() {
  return <Layout config={CITY_CONFIG.NewYork} />;
}