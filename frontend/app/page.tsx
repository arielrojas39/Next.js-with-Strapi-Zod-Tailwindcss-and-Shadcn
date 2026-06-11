import HeroSection from "../components/ui/HeroSection";
import { getHomePage } from "../lib/strapi";

export async function generateMetadata() {
  const strapiData = await getHomePage(); 
  return {
    title: strapiData?.title,
    description: strapiData?.description
  }
}

export default async function Home() {
  const strapiData = await getHomePage();
  // console.log(strapiData);

  const {title, description} = strapiData; 
  const [heroSection] = strapiData?.sections || [];
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-6xl font-bold"> {title} </h1>
      <p className="text-3xl"> {description} </p>
      <HeroSection data={{...heroSection, title, description}} />
    </main>
  );
}
