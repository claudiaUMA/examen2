import { SessionProvider } from "next-auth/react"
import "./globals.css";

export const metadata = { title: "ReViews Examen" };

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <SessionProvider>
            {children}
        </SessionProvider>
      </body>
    </html>
  );
}