"use client"

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Brain, Upload, CheckCircle, Tag, X, Loader2 } from 'lucide-react'

const BASE_PRICE = 5000
const BANK_DETAILS = {
  bank: 'BankIslami Pakistan Limited',
  branch: 'Thokar Niaz Baig Branch, Lahore',
  accountTitle: 'THINK FACULTY',
  iban: 'PK69BKIP0202958180440001',
}

interface VoucherResult {
  valid: boolean
  name?: string
  discount?: number
  finalPrice?: number
  error?: string
}

export default function RegisterPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const voucherDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', voucherCode: '',
  })
  const [slip, setSlip] = useState<File | null>(null)
  const [slipPreview, setSlipPreview] = useState<string | null>(null)
  const [voucher, setVoucher] = useState<VoucherResult | null>(null)
  const [voucherChecking, setVoucherChecking] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))

    if (name === 'voucherCode') {
      setVoucher(null)
      if (voucherDebounce.current) clearTimeout(voucherDebounce.current)
      if (value.trim().length >= 3) {
        setVoucherChecking(true)
        voucherDebounce.current = setTimeout(() => validateVoucher(value.trim()), 600)
      } else {
        setVoucherChecking(false)
      }
    }
  }

  const validateVoucher = useCallback(async (code: string) => {
    try {
      const res = await fetch(`/api/vouchers/validate?code=${encodeURIComponent(code)}`)
      const data = await res.json()
      setVoucher(data)
    } catch {
      setVoucher({ valid: false, error: 'Could not validate voucher' })
    } finally {
      setVoucherChecking(false)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSlip(file)
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setSlipPreview(url)
    } else {
      setSlipPreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (!slip) {
      setError('Please upload your bank deposit slip')
      return
    }
    if (form.voucherCode && voucher && !voucher.valid) {
      setError('Please remove the invalid voucher code or correct it')
      return
    }

    setSubmitting(true)
    const data = new FormData()
    data.append('firstName', form.firstName)
    data.append('lastName', form.lastName)
    data.append('email', form.email)
    data.append('phone', form.phone)
    data.append('password', form.password)
    data.append('voucherCode', form.voucherCode)
    data.append('slip', slip)

    try {
      const res = await fetch('/api/auth/register', { method: 'POST', body: data })
      const result = await res.json()
      if (!res.ok) {
        setError(result.error || 'Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }
      router.push('/payment-pending')
    } catch {
      setError('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  const finalPrice = voucher?.valid && voucher.finalPrice !== undefined ? voucher.finalPrice : BASE_PRICE

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-4 py-10">
      <div className="max-w-lg mx-auto">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center mb-3">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-black text-white">CareerLens</h1>
          <p className="text-slate-500 text-sm mt-1">Career Assessment Platform</p>
        </div>

        {/* Bank Payment Details */}
        <div className="bg-[#12121a] border border-blue-500/30 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-bold mb-1 text-sm uppercase tracking-wide">Step 1 — Pay via Bank Transfer</h2>
          <p className="text-slate-400 text-sm mb-4">Transfer <span className="text-white font-bold">PKR {finalPrice.toLocaleString()}</span> to the account below, then complete the form.</p>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Bank</span>
              <span className="text-white font-medium">{BANK_DETAILS.bank}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Branch</span>
              <span className="text-white font-medium">{BANK_DETAILS.branch}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Account Title</span>
              <span className="text-white font-bold">{BANK_DETAILS.accountTitle}</span>
            </div>
            <div className="border-t border-white/5 pt-2 flex justify-between items-center">
              <span className="text-slate-500">IBAN</span>
              <span className="text-blue-400 font-mono font-semibold tracking-wide">{BANK_DETAILS.iban}</span>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="bg-[#12121a] border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-bold text-sm uppercase tracking-wide mb-2">Step 2 — Create Your Account</h2>

          {/* Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">First Name *</label>
              <input
                name="firstName" required value={form.firstName} onChange={handleChange}
                placeholder="Ammar"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Last Name</label>
              <input
                name="lastName" value={form.lastName} onChange={handleChange}
                placeholder="Khan"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Email Address *</label>
            <input
              name="email" type="email" required value={form.email} onChange={handleChange}
              placeholder="you@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Phone Number</label>
            <input
              name="phone" type="tel" value={form.phone} onChange={handleChange}
              placeholder="03XX-XXXXXXX"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Password */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Password *</label>
              <input
                name="password" type="password" required value={form.password} onChange={handleChange}
                placeholder="Min. 8 characters"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Confirm Password *</label>
              <input
                name="confirmPassword" type="password" required value={form.confirmPassword} onChange={handleChange}
                placeholder="Repeat password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Voucher Code */}
          <div>
            <label className="text-xs text-slate-500 mb-1 block flex items-center gap-1">
              <Tag className="w-3 h-3" /> Voucher Code <span className="text-slate-600">(optional)</span>
            </label>
            <div className="relative">
              <input
                name="voucherCode" value={form.voucherCode} onChange={handleChange}
                placeholder="e.g. AITCHISON25"
                className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white text-sm uppercase placeholder:text-slate-600 placeholder:normal-case focus:outline-none ${
                  voucher?.valid ? 'border-emerald-500' : voucher && !voucher.valid ? 'border-red-500' : 'border-white/10 focus:border-blue-500'
                }`}
              />
              {voucherChecking && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
              )}
              {voucher?.valid && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
              )}
              {voucher && !voucher.valid && (
                <X className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
              )}
            </div>
            {voucher?.valid && (
              <p className="text-emerald-400 text-xs mt-1.5 font-semibold">
                ✓ {voucher.name} — PKR {voucher.discount?.toLocaleString()} off. You pay PKR {voucher.finalPrice?.toLocaleString()}
              </p>
            )}
            {voucher && !voucher.valid && (
              <p className="text-red-400 text-xs mt-1.5">{voucher.error}</p>
            )}
          </div>

          {/* Bank Slip Upload */}
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Bank Deposit Slip *</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors ${
                slip ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              {slipPreview ? (
                <div className="flex items-center gap-3">
                  <img src={slipPreview} alt="Slip preview" className="w-12 h-12 object-cover rounded-lg" />
                  <div>
                    <p className="text-white text-sm font-medium truncate max-w-[200px]">{slip?.name}</p>
                    <p className="text-slate-500 text-xs">Click to change</p>
                  </div>
                </div>
              ) : slip ? (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center">
                    <Upload className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium truncate max-w-[200px]">{slip.name}</p>
                    <p className="text-slate-500 text-xs">Click to change</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-2">
                  <Upload className="w-6 h-6 text-slate-500" />
                  <p className="text-slate-400 text-sm text-center">Click to upload your bank deposit slip</p>
                  <p className="text-slate-600 text-xs">JPG, PNG or PDF</p>
                </div>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : 'Submit Registration'}
          </button>

          <p className="text-center text-slate-600 text-xs">
            Already have an account?{' '}
            <Link href="/auth" className="text-blue-400 hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
