export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex justify-center h-screen bg-gradient-to-bl from-slate-900 via-purple-900 to-slate-900 text-white">
      {children}
    </main>
  );
}