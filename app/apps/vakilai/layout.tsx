import AuthProvider from "./_components/AuthProvider";

export default function VakilAILayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">{children}</div>
    </AuthProvider>
  );
}
