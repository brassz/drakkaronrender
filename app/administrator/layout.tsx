import { ReactNode } from 'react'

// Force dynamic rendering and disable caching for Vercel
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="admin-layout">
      {children}
    </div>
  )
}