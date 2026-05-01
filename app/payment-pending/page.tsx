"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { APP_CONFIG } from '@/lib/config'
import { Brain, Clock, CheckCircle, LogOut } from 'lucide-react'

export default function PaymentPendingPage() {
  const supabase = createClient()
  const router = useRouter()
  const [profile, setProfile] = useState<{ first_name: string; amount_paid: number; voucher_code_used: string | null } | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/auth'); return }

      const { data } = await supabase
        .from('profiles')
        .select('first_name, payment_status, amount_paid, voucher_code_used')
        .eq('id', user.id)
        .single()

      if (!data) { router.replace('/auth'); return }

      if (data.payment_status === 'approved') {
        router.replace('/?start=1')
        return
      }

      setProfile({ first_name: data.first_name, amount_paid: data.amount_paid, voucher_code_used: data.voucher_code_used })
      setChecking(false)
    }
    check()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white/40 text-sm animate-pulse">Checking your status...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-black text-white mb-2">{APP_CONFIG.appName}</h1>

        <div className="bg-[#12121a] border border-white/10 rounded-2xl p-8 mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-7 h-7 text-amber-400" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-2">
            Payment Under Review
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            Hi {profile?.first_name}, your bank slip has been submitted. We&apos;ll verify your payment and activate your account within a few hours.
          </p>

          <div className="bg-white/5 rounded-xl p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Amount to verify</span>
              <span className="text-white font-semibold">PKR {(profile?.amount_paid || 5000).toLocaleString()}</span>
            </div>
            {profile?.voucher_code_used && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Voucher applied</span>
                <span className="text-emerald-400 font-semibold">{profile.voucher_code_used}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Status</span>
              <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
                Pending
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-left">
            <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <p className="text-blue-300 text-xs leading-relaxed">
              Once approved, you&apos;ll be able to log in and access your full assessment. You do not need to do anything else right now.
            </p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-slate-500 hover:text-white text-sm transition-colors mx-auto"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  )
}
