export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex justify-center items-center h-screen w-full">
      {children}
    </main>
  );
}
