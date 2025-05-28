'use client';
import 'reset-css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { Roboto } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import ResponsiveDrawer from '@/components/Sidebar/Sidebar';
import { SessionWrapper } from '@/components/SessionWrapper/SessionWrapper';
import { ToastProvider } from '@/components/UI/ToastNotification';
import s from './page.module.scss';
import { usePathname } from 'next/navigation';
import { theme } from '@/theme';

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Не відображати сайдбар на сторінках входу та відмови в доступі
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/unauthorized' ||
    pathname === '/forgot-password';

  return (
    <html lang="en">
      <body className={roboto.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <AuthProvider>
              <ToastProvider>
                {/* Apply session management with 30-minute timeout (1800000ms) */}
                <SessionWrapper timeout={1800000}>
                  {isAuthPage ? (
                    children
                  ) : (
                    <ResponsiveDrawer>
                      <div className={s.main_container}>{children}</div>
                    </ResponsiveDrawer>
                  )}
                </SessionWrapper>
              </ToastProvider>
            </AuthProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
