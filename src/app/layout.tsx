// import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
// import { ThemeProvider } from "@mui/material/styles";
// import theme from "../theme";
// import localFont from "next/font/local";
// import { Metadata } from "next";
// import Sidebar from "@/components/Sidebar/Sidebar";
// import s from './page.module.scss'
// import 'normalize.css';
// import Header from "@/components/Header/Header";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={`${geistSans.variable} ${geistMono.variable}`}>
//         <AppRouterCacheProvider>
//           <ThemeProvider theme={theme}>
//             <div className={s.body}>
//               <Sidebar />
              
//               <div className={s.main_container}>
//               <Header />
//               {children}
//               </div>
//             </div>
//           </ThemeProvider>
//         </AppRouterCacheProvider>
//       </body>
//     </html>
//   );
// }


// src/app/layout.jsx or src/app/layout.tsx

import 'normalize.css'; // If you're still using Normalize.css
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import localFont from "next/font/local";
import { Metadata } from "next";
import ResponsiveDrawer from "@/components/Sidebar/Sidebar"; // Use ResponsiveDrawer instead of Sidebar
import s from './page.module.scss'; // Your CSS Module

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <ResponsiveDrawer>
              <div className={s.main_container}>
                {children}
              </div>
            </ResponsiveDrawer>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
