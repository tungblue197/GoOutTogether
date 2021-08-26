import type { AppProps } from 'next/app'
import MainLayout from 'layouts/MainLayout'
import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import { QueryClientProvider, QueryClient } from 'react-query';
const qClient = new QueryClient();
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={qClient}>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout> ˝
    </QueryClientProvider>
  )

}
export default MyApp
