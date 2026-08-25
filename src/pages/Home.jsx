import { Helmet } from "react-helmet-async";
import { useFetch } from "../hooks/useFetch";
import { categoryApi } from "../services/categoryApi";
import { productApi } from "../services/productApi";
import { reviewApi } from "../services/miscApi";
import { Hero, QuickCategories } from "../components/home/Hero";
import { ProductRow, WhyChooseUs, ReviewsSection } from "../components/home/HomeSections";
import { OpeningHoursSection, FinalCTA } from "../components/home/FinalSections";
import { SITE_NAME, DEFAULT_DESCRIPTION, SITE_URL } from "../constants/seo";

export default function Home() {
  const { data: categories } = useFetch(() => categoryApi.getAll(), []);
  const { data: bestsellersData, loading: bestsellersLoading } = useFetch(
    () => productApi.getAll({ isBestseller: "true", limit: 8 }),
    []
  );
  const { data: sweetsData, loading: sweetsLoading } = useFetch(
    () => productApi.getAll({ category: "sweets", limit: 8 }),
    []
  );
  const { data: reviews, loading: reviewsLoading } = useFetch(() => reviewApi.getApproved(), []);

  return (
    <>
      <Helmet>
        <title>{SITE_NAME} — Sahaswan</title>
        <meta name="description" content={DEFAULT_DESCRIPTION} />
        <link rel="canonical" href={SITE_URL} />
        <meta property="og:title" content={SITE_NAME} />
        <meta property="og:description" content={DEFAULT_DESCRIPTION} />
        <meta property="og:type" content="restaurant.restaurant" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FoodEstablishment",
            name: SITE_NAME,
            servesCuisine: "Indian",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Near Bank of Baroda, Jahangirabad Chawraha",
              addressLocality: "Sahaswan",
              addressRegion: "Uttar Pradesh",
              postalCode: "243638",
              addressCountry: "IN",
            },
          })}
        </script>
      </Helmet>

      <Hero />
      <QuickCategories categories={categories} />
      <ProductRow title="Best Sellers" products={bestsellersData?.data?.products} loading={bestsellersLoading} viewAllHref="/menu" />
      <ProductRow title="Traditional Sweets" products={sweetsData?.data?.products} loading={sweetsLoading} viewAllHref="/menu/sweets" />
      <WhyChooseUs />
      <ReviewsSection reviews={reviews} loading={reviewsLoading} />
      <OpeningHoursSection />
      <FinalCTA />
    </>
  );
}
