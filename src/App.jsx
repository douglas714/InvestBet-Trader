import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { setUserExternalId } from './services/oneSignalService'
import AuthPage from './components/AuthPage'
import ContractPage from './components/ContractPage'
import Dashboard from './components/Dashboard'
import './App.css'
import UpdatePasswordPage from './components/UpdatePasswordPage'
import { supabase } from './lib/supabase'
import { CURRENT_CONTRACT } from './lib/contract'

function AppContent() {
  const { user, profile, loading, initialized } = useAuth()
  const [contractStatus, setContractStatus] = useState(null)
  const [contractError, setContractError] = useState(null)

  // Definir External ID quando usuário logar
  useEffect(() => {
    if (user && initialized) {
      setUserExternalId(user.id);
    }
  }, [user, initialized])
  
  useEffect(() => {
    let cancelled = false

    const loadContractStatus = async () => {
      if (!user || !initialized) {
        if (!cancelled) {
          setContractStatus(null)
          setContractError(null)
        }
        return
      }

      setContractError(null)
      const { data, error } = await supabase.rpc('get_contract_acceptance_status', {
        p_contract_version: CURRENT_CONTRACT.version,
      })

      if (cancelled) return
      if (error) {
        console.error('AppContent: Não foi possível verificar o aceite no servidor:', error)
        setContractStatus(null)
        setContractError('Não foi possível verificar o aceite do contrato. Tente novamente.')
        return
      }

      setContractStatus(data?.[0] || { required: true, accepted: false })
    }

    loadContractStatus()
    return () => { cancelled = true }
  }, [user, profile, initialized])

  const handleContractAccept = async () => {
    if (!user) return { error: new Error('Sessão autenticada não encontrada.') }

    const { data, error } = await supabase.rpc('record_contract_acceptance', {
      p_contract_version: CURRENT_CONTRACT.version,
      p_acceptance_action: 'checkbox_and_confirm_button',
    })

    if (error) {
      console.error('AppContent: Erro ao registrar aceite no servidor:', error)
      return { error }
    }

    setContractStatus({
      required: false,
      accepted: true,
      event_id: data?.[0]?.event_id,
      accepted_at: data?.[0]?.accepted_at,
      contract_version: CURRENT_CONTRACT.version,
      contract_sha256: CURRENT_CONTRACT.sha256,
    })
    return { data }
  }

  // Mostrar loading enquanto não inicializado ou carregando
  if (!initialized || loading) {
    console.log('AppContent: Renderizando tela de carregamento')
    return (
      <div className="min-h-screen investbet-gradient flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Carregando...</p>
          <p className="text-sm mt-2 opacity-75">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Lógica para lidar com o redirecionamento do Supabase (tratamento de hash)
  const hash = window.location.hash;
  const isRecovery = hash.includes("type=recovery");

  // 1. Prioridade máxima: se for um fluxo de recuperação, renderize a página de atualização de senha.
  if (isRecovery || window.location.pathname === '/update-password') {
    console.log("AppContent: Fluxo de recuperação detectado, renderizando UpdatePasswordPage");
    return <UpdatePasswordPage />;
  }

  // 2. Mostrar loading enquanto não inicializado ou carregando
  if (!initialized || loading) {
    console.log('AppContent: Renderizando tela de carregamento')
    return (
      <div className="min-h-screen investbet-gradient flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Carregando...</p>
          <p className="text-sm mt-2 opacity-75">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // 3. Usuário não logado
  if (!user) {
    console.log('AppContent: Renderizando AuthPage (sem usuário)')
    return <AuthPage />
  }

  // 4. Usuário logado mas contrato não aceito
  if (user && contractError) {
    return (
      <div className="min-h-screen investbet-gradient flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 text-center max-w-md">
          <p className="text-red-700 font-medium">{contractError}</p>
          <button className="mt-4 underline" onClick={() => window.location.reload()}>Tentar novamente</button>
        </div>
      </div>
    )
  }

  if (user && !contractStatus) {
    return (
      <div className="min-h-screen investbet-gradient flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Verificando o aceite do contrato...</p>
        </div>
      </div>
    )
  }

  if (user && contractStatus.required && !contractStatus.accepted) {
    console.log('AppContent: Renderizando ContractPage (contrato não aceito)')
    return <ContractPage onAccept={handleContractAccept} />
  }

  // 5. Usuário logado e contrato aceito
  if (user && contractStatus.accepted) {
    console.log('AppContent: Renderizando Dashboard (tudo pronto)')
    return <Dashboard />
  }

  // Fallback
  console.warn('AppContent: Estado inesperado, renderizando AuthPage')
  return <AuthPage />
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App

