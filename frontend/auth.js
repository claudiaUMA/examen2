import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      // Pasamos datos extra a la sesión si los necesitamos
      return session;
    },
  },
})