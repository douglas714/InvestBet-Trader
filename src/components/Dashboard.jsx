import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import {
  LogOut,
  DollarSign,
  TrendingUp,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  User,
  Calendar,
  FileText,
  MessageCircle,
  Crown,
  Gift,
  Zap,
  Star,
  UserPlus,
  Users,
  Settings,
  Wallet,
  PieChart,
  Bell
} from 'lucide-react'
import logoImage from '../assets/logo.jpeg'
import PWAInstallLink from './PWAInstallLink'
import WithdrawForm from './WithdrawForm'
import DepositForm from './DepositForm'
import ContractModal from './ContractModal'
import MonthlyProfitability from './MonthlyProfitability'
import ReferralPage from './ReferralPage'
import ConsultantsPage from './ConsultantsPage'
import AdminReferralsPage from './AdminReferralsPage'
import NotificationSettings from './NotificationSettings'

export default function Dashboard() {
  const { user, profile, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [showContract, setShowContract] = useState(false)

  const isConsultant = profile?.Categoria === 'consultor'
  const isAdmin = profile?.email === 'douglasnoticias@gmail.com'

  const handleSignOut = async () => {
    await signOut()
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(2)}%`
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="bg-slate-900 p-1.5 rounded-lg shadow-inner">
                <img 
                  src={logoImage} 
                  alt="InvestBet Capital" 
                  className="w-12 h-12 object-contain rounded"
                />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">InvestBet <span className="text-green-600">Capital</span></h1>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sistema de Gestão</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-slate-900">{profile?.name || user?.email}</p>
                <Badge variant="outline" className="text-[10px] uppercase font-black border-slate-300">
                  {isConsultant ? 'Consultor' : isAdmin ? 'Administrador' : 'Investidor'}
                </Badge>
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleSignOut}
                className="shadow-sm font-bold"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
            <TabsList className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-2 w-full bg-transparent h-auto p-0">
              <TabsTrigger value="overview" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white px-6 py-3 rounded-xl font-bold transition-all">
                <PieChart className="h-4 w-4 mr-2" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="deposit" className="data-[state=active]:bg-green-600 data-[state=active]:text-white px-6 py-3 rounded-xl font-bold transition-all">
                <Wallet className="h-4 w-4 mr-2" />
                Depósito
              </TabsTrigger>
              <TabsTrigger value="withdraw" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white px-6 py-3 rounded-xl font-bold transition-all">
                <ArrowDownRight className="h-4 w-4 mr-2" />
                Saque
              </TabsTrigger>
              <TabsTrigger value="profitability" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6 py-3 rounded-xl font-bold transition-all">
                <TrendingUp className="h-4 w-4 mr-2" />
                Rentabilidade
              </TabsTrigger>
              <TabsTrigger value="signals" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-6 py-3 rounded-xl font-bold transition-all">
                <Target className="h-4 w-4 mr-2" />
                Sala de Sinal
              </TabsTrigger>
              
              {isConsultant && (
                <TabsTrigger value="referrals" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-6 py-3 rounded-xl font-bold transition-all">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Indicações
                </TabsTrigger>
              )}
              
              {isAdmin && (
                <>
                  <TabsTrigger value="consultants" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white px-6 py-3 rounded-xl font-bold transition-all">
                    <Users className="h-4 w-4 mr-2" />
                    Consultores
                  </TabsTrigger>
                  <TabsTrigger value="admin-referrals" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white px-6 py-3 rounded-xl font-bold transition-all">
                    <Settings className="h-4 w-4 mr-2" />
                    Gestão
                  </TabsTrigger>
                </>
              )}
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-8 animate-in fade-in duration-500">
            {/* Configurações de Notificação */}
            <NotificationSettings />

            {/* Cards de Resumo Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Saldo Atual */}
              <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-black uppercase tracking-widest opacity-70">Saldo Total</CardTitle>
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <Wallet className="h-5 w-5 text-green-400" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-4xl font-black tracking-tighter mb-1">
                    {formatCurrency(profile?.balance || 0)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500 hover:bg-green-600 text-white border-none font-bold">
                      Disponível
                    </Badge>
                    <p className="text-xs text-slate-400 font-medium">
                      Pronto para operações
                    </p>
                  </div>
                </CardContent>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
              </Card>

              {/* Lucro Mensal */}
              <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-blue-700 to-blue-900 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-black uppercase tracking-widest opacity-70">Desempenho do Mês</CardTitle>
                  <div className="bg-white/20 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-4xl font-black tracking-tighter mb-1">
                    {formatPercentage(profile?.monthly_profit || 0)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-white/20 text-white border-none font-bold">
                      Mês Atual
                    </Badge>
                    <p className="text-xs text-blue-100/70 font-medium">
                      Performance em tempo real
                    </p>
                  </div>
                </CardContent>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
              </Card>
            </div>

            {/* Informações da Conta e Resumo */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 shadow-lg border-slate-200">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <div className="bg-slate-900 p-2 rounded-lg">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    Informações da Conta
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Nome Completo</p>
                      <p className="text-lg font-bold text-slate-900">{profile?.name || "Não informado"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">E-mail de Acesso</p>
                      <p className="text-lg font-bold text-slate-900">{profile?.email || user?.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Telefone de Contato</p>
                      <p className="text-lg font-bold text-slate-900">{profile?.phone || "Não informado"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Status da Conta</p>
                      <div>
                        <Badge className={profile?.status === "active" ? "bg-green-100 text-green-700 border-green-200 font-bold" : "bg-slate-100 text-slate-700 border-slate-200 font-bold"}>
                          {profile?.status === "active" ? "CONTA ATIVA" : "INATIVA"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-4">
                    <PWAInstallLink />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowContract(true)}
                      className="text-slate-500 hover:text-slate-900 font-bold"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Contrato e Termos
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.location.pathname = '/update-password'}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Redefinir Senha
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-slate-200">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <div className="bg-blue-600 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-slate-500">Rendimento</span>
                      <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-lg">
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-black text-green-700">
                          {formatPercentage(profile?.monthly_profit || 0)}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                      <div 
                        className="bg-green-500 h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${Math.min((profile?.monthly_profit || 0) * 5, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-100 p-2 rounded-lg">
                          <DollarSign className="h-4 w-4 text-slate-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-700">Capital</span>
                      </div>
                      <span className="text-sm font-black text-slate-900">{formatCurrency(profile?.balance || 0)}</span>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                      <div className="flex items-center gap-2 text-green-800 mb-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-xs font-black uppercase tracking-widest">Aumente seus Lucros</span>
                      </div>
                      <p className="text-xs text-green-700 font-bold leading-relaxed">
                        Realize novos aportes para potencializar seus rendimentos e alcançar suas metas mais rápido!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ações Rápidas com Visual Melhorado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Button 
                onClick={() => setActiveTab('deposit')}
                className="h-24 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 shadow-lg rounded-2xl group transition-all"
              >
                <div className="flex items-center justify-between w-full px-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-4 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-colors">
                      <Wallet className="h-8 w-8 text-green-600 group-hover:text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-xl font-black">Efetuar Depósito</p>
                      <p className="text-sm text-slate-500 font-bold">Adicionar capital à sua conta</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-6 w-6 text-slate-300 group-hover:text-green-600 transition-colors" />
                </div>
              </Button>

              <Button 
                onClick={() => setActiveTab('withdraw')}
                className="h-24 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 shadow-lg rounded-2xl group transition-all"
              >
                <div className="flex items-center justify-between w-full px-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-amber-100 p-4 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <ArrowDownRight className="h-8 w-8 text-amber-600 group-hover:text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-xl font-black">Solicitar Saque</p>
                      <p className="text-sm text-slate-500 font-bold">Retirar seus lucros ou capital</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-6 w-6 text-slate-300 group-hover:text-amber-600 transition-colors" />
                </div>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="deposit" className="animate-in slide-in-from-bottom-4 duration-500">
            <DepositForm />
          </TabsContent>

          <TabsContent value="withdraw" className="animate-in slide-in-from-bottom-4 duration-500">
            <WithdrawForm />
          </TabsContent>

          <TabsContent value="profitability" className="animate-in slide-in-from-bottom-4 duration-500">
            <MonthlyProfitability />
          </TabsContent>

          <TabsContent value="signals" className="animate-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-8 text-white">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="space-y-2 text-center md:text-left">
                    <Badge className="bg-white/20 text-white border-none font-black px-3 py-1">EXCLUSIVO VIP</Badge>
                    <h2 className="text-4xl font-black tracking-tighter">Sala de Sinais InvestBet</h2>
                    <p className="text-purple-100 font-medium text-lg">Copie as operações dos nossos melhores traders em tempo real.</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20">
                    <Target className="h-16 w-16 text-white" />
                  </div>
                </div>
              </div>
              
              <CardContent className="p-8 bg-white">
                <div className="grid md:grid-cols-3 gap-8 mb-10">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                    <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Zap className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-black text-slate-900 mb-1">Alta Precisão</h4>
                    <p className="text-sm text-slate-500 font-medium">Sinais analisados por especialistas</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                    <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Star className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-black text-slate-900 mb-1">Consistência</h4>
                    <p className="text-sm text-slate-500 font-medium">Resultados comprovados mensalmente</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                    <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Bell className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-black text-slate-900 mb-1">Suporte 24/7</h4>
                    <p className="text-sm text-slate-500 font-medium">Acompanhamento total da equipe</p>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-6">
                  <div className="w-full max-w-2xl bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 text-amber-400 mb-4">
                        <Crown className="h-5 w-5 fill-amber-400" />
                        <span className="text-xs font-black uppercase tracking-widest">Oferta de Lançamento</span>
                      </div>
                      <h3 className="text-3xl font-black mb-2">Acesso Vitalício VIP</h3>
                      <p className="text-slate-400 font-medium mb-6">Entre agora e garanta sua vaga com desconto especial para investidores ativos.</p>
                      
                      <div className="flex items-baseline gap-2 mb-8">
                        <span className="text-4xl font-black text-white">R$ 1,00</span>
                        <span className="text-slate-500 line-through font-bold">R$ 97,00</span>
                        <Badge className="ml-2 bg-green-500 text-white border-none font-black">99% OFF</Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button 
                          size="lg" 
                          className="bg-green-600 hover:bg-green-700 text-white font-black h-14 rounded-xl shadow-lg shadow-green-900/20"
                          onClick={() => window.open('https://pay.kirvano.com/e9b87434-7802-48b4-9c92-4488056b411b', '_blank')}
                        >
                          <Crown className="h-5 w-5 mr-2" />
                          ASSINAR VIP AGORA
                        </Button>
                        <Button 
                          size="lg" 
                          variant="outline"
                          className="border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white font-black h-14 rounded-xl"
                          onClick={() => window.open('https://t.me/investbetoficial/1', '_blank')}
                        >
                          <MessageCircle className="h-5 w-5 mr-2" />
                          TESTAR GRÁTIS
                        </Button>
                      </div>
                    </div>
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"></div>
                  </div>
                  
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Pagamento seguro via Kirvano • Acesso imediato</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {isConsultant && (
            <TabsContent value="referrals" className="animate-in slide-in-from-bottom-4 duration-500">
              <ReferralPage />
            </TabsContent>
          )}

          {isAdmin && (
            <>
              <TabsContent value="consultants" className="animate-in slide-in-from-bottom-4 duration-500">
                <ConsultantsPage />
              </TabsContent>
              
              <TabsContent value="admin-referrals" className="animate-in slide-in-from-bottom-4 duration-500">
                <AdminReferralsPage />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      {/* Modal do Contrato */}
      <ContractModal 
        isOpen={showContract} 
        onClose={() => setShowContract(false)} 
      />
      
      {/* Footer Simples */}
      <footer className="py-10 text-center border-t border-slate-200 bg-white mt-12">
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
          © 2026 InvestBet Capital • Todos os direitos reservados
        </p>
      </footer>
    </div>
  )
}
