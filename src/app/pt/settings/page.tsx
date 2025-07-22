import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import PTSettingsInterface from '@/components/PTSettingsInterface'

export default async function PTSettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.userType !== 'pt') {
    redirect('/login')
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Account Settings
          </h1>
          <p className="text-gray-600">
            Manage your account preferences and security settings
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <PTSettingsInterface />
      </main>
    </div>
  )
}
