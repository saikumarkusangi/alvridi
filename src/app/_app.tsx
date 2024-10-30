// _app.tsx
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";


function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <DefaultLayout session={session}>
        <Component {...pageProps} />
      </DefaultLayout>
    </SessionProvider>
  );
}

export default MyApp;
