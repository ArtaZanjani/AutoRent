import React from "react";

const Home = React.lazy(() => import("@/pages/Home"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));
const FetchError = React.lazy(() => import("@/pages/FetchError"));
const ProductList = React.lazy(() => import("@/pages/ProductList"));
const ProductDetail = React.lazy(() => import("@/pages/ProductDetail"));
const Payment = React.lazy(() => import("@/pages/Payment"));
const Blog = React.lazy(() => import("@/pages/Blog"));
const BlogDetails = React.lazy(() => import("@/pages/BlogDetails"));
const ContactUs = React.lazy(() => import("@/pages/ContactUs"));
const Dashboard = React.lazy(() => import("@/pages/Dashboard"));

export const getAppRoutes = (setIsAuthOpen) => [
  { title: "صفحه اصلی", path: "/", component: <Home /> },
  { title: "لیست خودرو", path: "/product-list", component: <ProductList /> },
  { title: "جزئیات محصول", path: "/product-detail/:id", component: <ProductDetail setAuthOpen={() => setIsAuthOpen(true)} /> },
  { title: "ثبت درخواست رزرو", path: "/payment/:step", component: <Payment /> },
  { title: "مقالات", path: "/blog/", component: <Blog /> },
  { title: "مقالات", path: "/blog/:id", component: <BlogDetails /> },
  { title: "تماس با ما", path: "/contact-us", component: <ContactUs /> },
  { title: "پنل کاربری", path: "/dashboard/:id", component: <Dashboard /> },
  { title: "خطا در ارتباط با سرور", path: "/fetcherror", component: <FetchError /> },
  { title: "صفحه پیدا نشد", path: "*", component: <NotFound /> },
];

// const AboutUs = React.lazy(() => import("../page/AboutUs"));
// const Blog = React.lazy(() => import("../page/Blog"));
// const BlogDetail = React.lazy(() => import("../page/BlogDetail"));
// const ContactUs = React.lazy(() => import("../page/ContactUs"));
// const Delivery = React.lazy(() => import("../page/Delivery"));
// const Faq = React.lazy(() => import("../page/Faq"));
// const Legal = React.lazy(() => import("../page/Legal"));
// const Pay = React.lazy(() => import("../page/Pay"));
// const Pdp = React.lazy(() => import("../page/Pdp"));

// const Specifications = React.lazy(() => import("../page/Specifications"));
// { title: "درباره ما", path: "/about-us", component: AboutUs },
// { title: "بلاگ", path: "/blog", component: Blog },
// { title: "جزئیات بلاگ", path: "/blog-detail", component: BlogDetail },
// { title: "تماس با ما", path: "/contact-us", component: ContactUs },
// { title: "تحویل", path: "/delivery", component: Delivery },
// { title: "سوالات متداول", path: "/faq", component: Faq },
// { title: "مدارک لازم", path: "/legal", component: Legal },
// { title: "پرداخت", path: "/pay", component: Pay },
// { title: "جزئیات محصول", path: "/product-detail", component: Pdp },
// { title: "لیست محصولات", path: "/product-list", component: Plp },
// { title: "مشخصات", path: "/specifications", component: Specifications },
