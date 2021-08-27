import type { AppProps } from 'next/app'
import MainLayout from 'layouts/MainLayout'
import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import 'react-notifications/lib/notifications.css';
import { QueryClientProvider, QueryClient } from 'react-query';


import Loader from 'components/loader';
const qClient = new QueryClient();
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={qClient}>
      <MainLayout>
        <Loader />
        <Component {...pageProps} />
      </MainLayout> 
    </QueryClientProvider>
  )

}
export default MyApp
