"use client"

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Brain, Users, CheckCircle, LogOut,
  ShieldCheck, Tag, Plus, Trash2, ExternalLink, Loader2, RefreshCw, X
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface StudentRecord {
  id: string; first_name: string; email: string; age: number | null
  education_level: string | null; created_at: string
  assessment_status: 'completed' | 'in_progress' | 'not_started'
  completed_at: string | null; top_career: string | null; top_match: number | null
}

interface PendingUser {
  id: string; first_name: string; last_name: string | null; email: string
  phone: string | null; amount_paid: number; voucher_code_used: string | null
  created_at: string; slipSignedUrl: string | null
}

interface Voucher {
  id: string; name: string; code: string; expiry_date: string
  quantity: number; quantity_used: number; discount_amount: number; created_at: string
}

const APP_ID = process.env.NEXT_PUBLIC_APP_ID ?? 'careerlens'

type AdminTab = 'approvals' | 'students' | 'vouchers'

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function InstitutionPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [institutionName, setInstitutionName] = useState('')
  const [activeTab, setActiveTab] = useState<AdminTab>('approvals')

  // Students tab
  const [students, setStudents] = useState<StudentRecord[]>([])
  const [studentFilter, setStudentFilter] = useState<'all' | 'completed' | 'pending'>('all')

  // Approvals tab
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [slipModal, setSlipModal] = useState<string | null>(null)

  // Vouchers tab
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [voucherForm, setVoucherForm] = useState({ name: '', code: '', expiry_date: '', quantity: '', discount_amount: '' })
  const [voucherSaving, setVoucherSaving] = useState(false)
  const [voucherError, setVoucherError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { loadAll() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadAll = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth'); return }

    const { data: adminProfile } = await supabase
      .from('profiles').select('role, institution_id').eq('id', user.id).single()

    if (!adminProfile || adminProfile.role !== 'institution') { router.push('/'); return }

    if (adminProfile.institution_id) {
      const { data: inst } = await supabase.from('institutions').select('name').eq('id', adminProfile.institution_id).single()
      if (inst) setInstitutionName(inst.name)
    }

    await Promise.all([loadStudents(), loadPendingUsers(), loadVouchers()])
    setLoading(false)
  }

  const loadStudents = async () => {
    const { data: studentProfiles } = await supabase
      .from('profiles').select('id, first_name, email, age, education_level, created_at')
      .eq('role', 'student').eq('payment_status', 'approved').eq('app_id', APP_ID).order('created_at', { ascending: false })
    if (!studentProfiles) return

    const enriched: StudentRecord[] = await Promise.all(
      studentProfiles.map(async (s) => {
        const { data: assessment } = await supabase
          .from('assessments').select('status, completed_at').eq('user_id', s.id)
          .order('created_at', { ascending: false }).limit(1).single()
        let topCareer = null; let topMatch = null
        if (assessment?.status === 'completed') {
          const { data: match } = await supabase
            .from('career_matches').select('career_id, overall_match').eq('user_id', s.id).eq('rank', 1).single()
          if (match) { topCareer = match.career_id; topMatch = match.overall_match }
        }
        return {
          ...s,
          assessment_status: assessment ? (assessment.status === 'completed' ? 'completed' : 'in_progress') : 'not_started',
          completed_at: assessment?.completed_at || null, top_career: topCareer, top_match: topMatch,
        }
      })
    )
    setStudents(enriched)
  }

  const loadPendingUsers = useCallback(async () => {
    const res = await fetch('/api/admin/pending-users')
    if (!res.ok) return
    const { users } = await res.json()
    setPendingUsers(users || [])
  }, [])

  const loadVouchers = useCallback(async () => {
    const res = await fetch('/api/admin/vouchers')
    if (!res.ok) return
    const { vouchers: v } = await res.json()
    setVouchers(v || [])
  }, [])

  const handleApprove = async (userId: string) => {
    setApprovingId(userId)
    const res = await fetch('/api/admin/approve-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    if (res.ok) {
      setPendingUsers(prev => prev.filter(u => u.id !== userId))
      await loadStudents()
    }
    setApprovingId(null)
  }

  const handleCreateVoucher = async (e: React.FormEvent) => {
    e.preventDefault()
    setVoucherError(null)
    setVoucherSaving(true)
    const res = await fetch('/api/admin/vouchers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: voucherForm.name,
        code: voucherForm.code.toUpperCase(),
        expiry_date: voucherForm.expiry_date,
        quantity: Number(voucherForm.quantity),
        discount_amount: Number(voucherForm.discount_amount),
      }),
    })
    const data = await res.json()
    if (!res.ok) { setVoucherError(data.error); setVoucherSaving(false); return }
    setVouchers(prev => [data.voucher, ...prev])
    setVoucherForm({ name: '', code: '', expiry_date: '', quantity: '', discount_amount: '' })
    setVoucherSaving(false)
  }

  const handleDeleteVoucher = async (id: string) => {
    if (!confirm('Delete this voucher?')) return
    setDeletingId(id)
    await fetch('/api/admin/vouchers', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setVouchers(prev => prev.filter(v => v.id !== id))
    setDeletingId(null)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white/40 text-sm animate-pulse">Loading dashboard...</div>
      </div>
    )
  }

  const completedCount = students.filter(s => s.assessment_status === 'completed').length
  const filteredStudents = students.filter(s => {
    if (studentFilter === 'completed') return s.assessment_status === 'completed'
    if (studentFilter === 'pending') return s.assessment_status !== 'completed'
    return true
  })

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight">Career<span className="text-blue-500">Lens</span></span>
              <span className="text-slate-500 text-sm ml-3">Admin Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {institutionName && (
              <span className="text-sm font-semibold text-slate-400 bg-white/5 px-3 py-1 rounded-full">{institutionName}</span>
            )}
            <button onClick={handleSignOut} className="flex items-center gap-2 text-slate-500 hover:text-white text-sm transition-colors">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#12121a] rounded-2xl border border-white/10 p-5">
            <div className="flex items-center gap-2 mb-2"><ShieldCheck className="w-4 h-4 text-amber-400" /><span className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Pending Approval</span></div>
            <div className="text-3xl font-black text-amber-400">{pendingUsers.length}</div>
          </div>
          <div className="bg-[#12121a] rounded-2xl border border-white/10 p-5">
            <div className="flex items-center gap-2 mb-2"><Users className="w-4 h-4 text-blue-400" /><span className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Active Users</span></div>
            <div className="text-3xl font-black text-white">{students.length}</div>
          </div>
          <div className="bg-[#12121a] rounded-2xl border border-white/10 p-5">
            <div className="flex items-center gap-2 mb-2"><CheckCircle className="w-4 h-4 text-emerald-400" /><span className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Tests Completed</span></div>
            <div className="text-3xl font-black text-emerald-400">{completedCount}</div>
          </div>
          <div className="bg-[#12121a] rounded-2xl border border-white/10 p-5">
            <div className="flex items-center gap-2 mb-2"><Tag className="w-4 h-4 text-purple-400" /><span className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Active Vouchers</span></div>
            <div className="text-3xl font-black text-purple-400">{vouchers.filter(v => new Date(v.expiry_date) >= new Date()).length}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {([
            { key: 'approvals', label: 'Payment Approvals', badge: pendingUsers.length },
            { key: 'students', label: 'Students' },
            { key: 'vouchers', label: 'Vouchers' },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab.key ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
              {'badge' in tab && tab.badge > 0 && (
                <span className="bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Payment Approvals Tab ── */}
        {activeTab === 'approvals' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Pending Payment Approvals</h2>
              <button onClick={loadPendingUsers} className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>

            {pendingUsers.length === 0 ? (
              <div className="bg-[#12121a] rounded-2xl border border-white/10 p-12 text-center text-slate-600">
                No pending approvals right now.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingUsers.map(user => (
                  <div key={user.id} className="bg-[#12121a] border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Slip thumbnail */}
                      {user.slipSignedUrl ? (
                        <button onClick={() => setSlipModal(user.slipSignedUrl!)} className="shrink-0 w-14 h-14 rounded-xl overflow-hidden border border-white/10 hover:border-blue-400 transition-colors">
                          <img src={user.slipSignedUrl} alt="Slip" className="w-full h-full object-cover" />
                        </button>
                      ) : (
                        <div className="shrink-0 w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-600 text-xs">No slip</div>
                      )}

                      {/* User info */}
                      <div className="min-w-0">
                        <p className="text-white font-semibold truncate">
                          {user.first_name} {user.last_name || ''}
                        </p>
                        <p className="text-slate-400 text-sm truncate">{user.email}</p>
                        {user.phone && <p className="text-slate-500 text-xs">{user.phone}</p>}
                      </div>
                    </div>

                    {/* Payment info */}
                    <div className="text-right shrink-0 hidden sm:block">
                      <p className="text-white font-bold">PKR {user.amount_paid.toLocaleString()}</p>
                      {user.voucher_code_used && (
                        <p className="text-emerald-400 text-xs">Voucher: {user.voucher_code_used}</p>
                      )}
                      <p className="text-slate-600 text-xs mt-0.5">
                        {new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {user.slipSignedUrl && (
                        <a href={user.slipSignedUrl} target="_blank" rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleApprove(user.id)}
                        disabled={approvingId === user.id}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
                      >
                        {approvingId === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Students Tab ── */}
        {activeTab === 'students' && (
          <div>
            <div className="flex gap-2 mb-4">
              {(['all', 'completed', 'pending'] as const).map(f => (
                <button key={f} onClick={() => setStudentFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${studentFilter === f ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="bg-[#12121a] rounded-2xl border border-white/10 overflow-hidden">
              <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <div className="col-span-3">Student</div>
                <div className="col-span-2">Education</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-3">Top Career Match</div>
                <div className="col-span-2">Completed</div>
              </div>

              {filteredStudents.length === 0 ? (
                <div className="text-center py-12 text-slate-600">No students found</div>
              ) : (
                filteredStudents.map(student => (
                  <div key={student.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 hover:bg-white/3 transition-colors items-center">
                    <div className="col-span-3">
                      <div className="font-semibold text-white text-sm">{student.first_name}</div>
                      <div className="text-xs text-slate-500 truncate">{student.email}</div>
                    </div>
                    <div className="col-span-2 text-sm text-slate-400 capitalize">
                      {student.education_level || '—'}
                      {student.age && <span className="text-slate-600 ml-1">· {student.age}</span>}
                    </div>
                    <div className="col-span-2">
                      {student.assessment_status === 'completed' && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Done
                        </span>
                      )}
                      {student.assessment_status === 'in_progress' && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />In Progress
                        </span>
                      )}
                      {student.assessment_status === 'not_started' && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-white/5 px-2.5 py-1 rounded-full">
                          Not Started
                        </span>
                      )}
                    </div>
                    <div className="col-span-3">
                      {student.top_career ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white font-medium truncate">{student.top_career.replace(/-/g, ' ')}</span>
                          {student.top_match && <span className="text-xs font-bold text-emerald-400 shrink-0">{Math.round(student.top_match)}%</span>}
                        </div>
                      ) : <span className="text-slate-600 text-sm">—</span>}
                    </div>
                    <div className="col-span-2 text-xs text-slate-500">
                      {student.completed_at ? new Date(student.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── Vouchers Tab ── */}
        {activeTab === 'vouchers' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Create voucher form */}
            <div className="lg:col-span-2">
              <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-blue-400" /> Create Voucher
                </h3>

                <form onSubmit={handleCreateVoucher} className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Voucher Name</label>
                    <input value={voucherForm.name} onChange={e => setVoucherForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Aitchison College" required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500" />
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Voucher Code</label>
                    <input value={voucherForm.code} onChange={e => setVoucherForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                      placeholder="e.g. AITCHISON25" required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm uppercase placeholder:text-slate-600 placeholder:normal-case focus:outline-none focus:border-blue-500" />
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Expiry Date</label>
                    <input type="date" value={voucherForm.expiry_date} onChange={e => setVoucherForm(f => ({ ...f, expiry_date: e.target.value }))}
                      required min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Quantity (max uses)</label>
                    <input type="number" min="1" value={voucherForm.quantity} onChange={e => setVoucherForm(f => ({ ...f, quantity: e.target.value }))}
                      placeholder="e.g. 50" required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500" />
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Discount Amount (PKR)</label>
                    <input type="number" min="1" max="4999" value={voucherForm.discount_amount} onChange={e => setVoucherForm(f => ({ ...f, discount_amount: e.target.value }))}
                      placeholder="e.g. 1000" required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500" />
                    {voucherForm.discount_amount && (
                      <p className="text-slate-500 text-xs mt-1">
                        Users pay: PKR {(5000 - Number(voucherForm.discount_amount)).toLocaleString()}
                      </p>
                    )}
                  </div>

                  {voucherError && (
                    <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{voucherError}</p>
                  )}

                  <button type="submit" disabled={voucherSaving}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                    {voucherSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Create Voucher
                  </button>
                </form>
              </div>
            </div>

            {/* Voucher list */}
            <div className="lg:col-span-3">
              <h3 className="font-bold text-white mb-4">All Vouchers ({vouchers.length})</h3>

              {vouchers.length === 0 ? (
                <div className="bg-[#12121a] rounded-2xl border border-white/10 p-10 text-center text-slate-600">
                  No vouchers yet. Create one on the left.
                </div>
              ) : (
                <div className="space-y-3">
                  {vouchers.map(v => {
                    const expired = new Date(v.expiry_date) < new Date()
                    const full = v.quantity_used >= v.quantity
                    const statusColor = expired || full ? 'text-red-400' : 'text-emerald-400'
                    const statusLabel = expired ? 'Expired' : full ? 'Fully Used' : 'Active'
                    const pct = Math.round((v.quantity_used / v.quantity) * 100)

                    return (
                      <div key={v.id} className="bg-[#12121a] border border-white/10 rounded-2xl p-5">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-bold">{v.name}</span>
                              <span className="text-xs font-mono bg-white/10 text-slate-300 px-2 py-0.5 rounded-lg">{v.code}</span>
                              <span className={`text-xs font-semibold ${statusColor}`}>{statusLabel}</span>
                            </div>
                            <p className="text-slate-500 text-xs mt-0.5">
                              PKR {v.discount_amount.toLocaleString()} off · Final price PKR {(5000 - v.discount_amount).toLocaleString()} · Expires {new Date(v.expiry_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                          <button onClick={() => handleDeleteVoucher(v.id)} disabled={deletingId === v.id}
                            className="text-slate-600 hover:text-red-400 transition-colors p-1">
                            {deletingId === v.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>

                        {/* Usage bar */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-white/5 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${expired || full ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-slate-500 shrink-0">{v.quantity_used} / {v.quantity} used</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Slip Modal */}
      {slipModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSlipModal(null)}>
          <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSlipModal(null)} className="absolute -top-10 right-0 text-white/60 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <img src={slipModal} alt="Bank slip" className="w-full rounded-2xl" />
          </div>
        </div>
      )}
    </div>
  )
}
