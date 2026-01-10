import { Button } from './ui/button'
import { Alert, AlertDescription } from './ui/alert'
import { Card, CardContent } from './ui/card'
import { 
  Clock, 
  CheckCircle,
  UserCheck,
  Search,
  MessageCircle
} from 'lucide-react'

export default function DepositForm() {

  const handleFindConsultant = () => {
    const whatsappNumber = '5522997291348'
    const message = 'Olá! Tenho interesse em investir na InvestBet Capital e gostaria de mais informações.'
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank')
  }

   return (
    <div className="space-y-6">
      {/* Seção Principal: Instrução de Depósito via Consultor */}
      <Card className="border-blue-200 bg-blue-50 shadow-xl overflow-hidden border-t-4 border-t-blue-600">
        <CardContent className="pt-10 pb-10">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-200">
              <UserCheck className="h-12 w-12 text-white" />
            </div>
            
            <div className="space-y-3 max-w-md">
              <h3 className="text-2xl font-black text-blue-900 tracking-tight">Como realizar seu depósito</h3>
              <p className="text-blue-800 font-bold text-lg leading-relaxed">
                Para realizar o depósito na plataforma, você precisa entrar em contato diretamente com o seu <span className="text-blue-600 underline">consultor credenciado InvestBet</span>.
              </p>
            </div>
            
            <div className="w-full pt-8 border-t border-blue-200 max-w-sm">
              <p className="text-sm font-bold text-blue-700 mb-6 uppercase tracking-widest">
                Não possui um consultor?
              </p>
              <Button 
                onClick={handleFindConsultant}
                className="bg-green-600 hover:bg-green-700 text-white w-full h-16 rounded-2xl shadow-xl shadow-green-200 text-lg font-black transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <MessageCircle className="h-6 w-6" />
                ENCONTRAR CONSULTOR
              </Button>
              <p className="text-xs text-blue-500 mt-4 font-medium">
                Você será redirecionado para o suporte oficial via WhatsApp.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informação sobre a rentabilidade */}
      <Alert className="border-green-200 bg-green-50 shadow-md py-6">
        <AlertDescription className="text-green-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-600 p-1.5 rounded-lg">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <strong className="text-xl font-black tracking-tight">Regra de Rentabilidade</strong>
          </div>
          <div className="space-y-3 mt-4 text-base font-medium leading-relaxed">
            <p>
              A rentabilidade do novo depósito só ocorrerá no mesmo mês se a rentabilidade atual estiver <strong>até 7%</strong>. 
              Neste caso, ainda poderá render até 3% na conta.
            </p>
            <p className="p-3 bg-white/50 rounded-xl border border-green-100">
              Caso a rentabilidade atual já tenha batido <strong>7% ou mais</strong>, a rentabilidade do novo depósito passará a contar a partir do <strong>dia 1º do mês seguinte</strong>.
            </p>
          </div>
        </AlertDescription>
      </Alert>

      {/* Informações importantes sobre depósito */}
      <Card className="border-slate-200 shadow-lg bg-white">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="bg-amber-100 p-3 rounded-2xl">
            <Clock className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <strong className="block text-slate-900 text-lg font-black">Atualização do Saldo</strong>
            <span className="text-slate-600 font-bold">O saldo é atualizado em até 24 horas após a validação do depósito pelo seu consultor.</span>
          </div>
        </CardContent>
      </Card>

      {/* Passo a passo simplificado */}
      <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden">
        <div className="relative z-10">
          <h4 className="font-black text-xl mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
            Passo a passo para investir
          </h4>
          <div className="space-y-6">
            {[
              { step: 1, text: "Entre em contato com seu consultor credenciado." },
              { step: 2, text: "Solicite os dados para transferência ou PIX." },
              { step: 3, text: "Envie o comprovante diretamente para o consultor." },
              { step: 4, text: "Aguarde a validação e atualização do seu saldo no dashboard." }
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-black shadow-lg shadow-blue-900/50">
                  {item.step}
                </div>
                <p className="text-slate-300 font-bold text-base pt-1">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
}
