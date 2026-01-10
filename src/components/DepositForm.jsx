import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'

import { Card, CardContent } from './ui/card'
import { 
  MessageCircle, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  QrCode,
  Upload,
  UserCheck,
  Search
} from 'lucide-react'

export default function DepositForm() {

  const [formData, setFormData] = useState({
    fullName: '',
    cpf: '',
    amount: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Formatação específica para CPF
    if (name === 'cpf') {
      const formattedCpf = value
        .replace(/\D/g, '') // Remove tudo que não é dígito
        .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona primeiro ponto
        .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona segundo ponto
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2') // Adiciona hífen
        .substring(0, 14) // Limita a 14 caracteres
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedCpf
      }))
    } else if (name === 'amount') {
      // Formatação para valor monetário
      const numericValue = value.replace(/\D/g, '')
      const formattedValue = (numericValue / 100).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const validateForm = () => {
    const { fullName, cpf, amount } = formData
    
    if (!fullName.trim()) {
      alert('Por favor, preencha o nome completo.')
      return false
    }
    
    if (!cpf || cpf.length !== 14) {
      alert('Por favor, preencha um CPF válido.')
      return false
    }
    
    if (!amount || parseFloat(amount.replace(/\./g, '').replace(',', '.')) < 100) {
      alert('O valor mínimo para depósito é de R$ 100,00.')
      return false
    }
    
    return true
  }

  const handleFindConsultant = () => {
    const whatsappNumber = '5522997291348'
    const message = 'Olá! Tenho interesse em investir na InvestBet Capital e gostaria de mais informações.'
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Preparar dados para WhatsApp
      const { fullName, cpf, amount } = formData
      const whatsappNumber = '5522997291348'
      
      const message = `💰 *SOLICITAÇÃO DE DEPÓSITO - InvestBet Capital*

👤 *Nome Completo:* ${fullName}
📄 *CPF:* ${cpf}
💵 *Valor do Depósito:* R$ ${amount}

📅 *Data da Solicitação:* ${new Date().toLocaleDateString('pt-BR')}

---
Esta é uma solicitação automática gerada pelo sistema.

📎 *Abaixo segue comprovante*`

      const encodedMessage = encodeURIComponent(message)
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
      
      // Abrir WhatsApp
      window.open(whatsappUrl, '_blank')
      
      // Mostrar mensagem de sucesso
      setShowSuccess(true)
      
      // Limpar formulário após 3 segundos
      setTimeout(() => {
        setFormData({
          fullName: '',
          cpf: '',
          amount: ''
        })
        setShowSuccess(false)
      }, 3000)
      
    } catch (error) {
      console.error('Erro ao processar solicitação:', error)
      alert('Erro ao processar solicitação. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

   return (
    <div className="space-y-6">
      {/* Nova Seção de Instrução de Depósito via Consultor */}
      <Card className="border-blue-200 bg-blue-50 shadow-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <UserCheck className="h-8 w-8 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-blue-900">Como realizar seu depósito</h3>
              <p className="text-blue-800 font-medium">
                Para realizar o depósito na plataforma, você precisa entrar em contato com o seu consultor credenciado InvestBet.
              </p>
            </div>
            
            <div className="w-full pt-2 border-t border-blue-200">
              <p className="text-sm text-blue-700 mb-4">
                Caso você não possua uma indicação, clique no botão abaixo para encontrar o consultor mais próximo.
              </p>
              <Button 
                onClick={handleFindConsultant}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto px-8"
                size="lg"
              >
                <Search className="h-5 w-5 mr-2" />
                Encontrar Consultor Próximo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informação sobre a rentabilidade */}
      <Alert className="border-green-200 bg-green-50 shadow-sm">
        <AlertDescription className="text-green-800">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-4 w-4" />
            <strong className="text-lg">Regra de Rentabilidade</strong>
          </div>
          <div className="space-y-2 mt-2">
            <p>
              A rentabilidade do novo depósito só ocorrerá no mesmo mês se a rentabilidade atual estiver <strong>até 7%</strong>. 
              Neste caso, ainda poderá render até 3% na conta.
            </p>
            <p>
              Caso a rentabilidade atual já tenha batido <strong>7% ou mais</strong>, a rentabilidade do novo depósito passará a contar a partir do <strong>dia 1º do mês seguinte</strong>.
            </p>
          </div>
        </AlertDescription>
      </Alert>

      {/* Informações importantes sobre depósito */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="bg-amber-100 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <strong className="block text-gray-900">Atualização do Saldo</strong>
              <span className="text-sm text-gray-600">O saldo é atualizado em até 24 horas após a validação do depósito.</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Upload className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <strong className="block text-gray-900">Comprovante Obrigatório</strong>
              <span className="text-sm text-gray-600">Você deve enviar o comprovante de pagamento via WhatsApp.</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QR Code para depósito */}
      <Card className="shadow-md border-gray-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <QrCode className="h-6 w-6 text-gray-700" />
              <h3 className="text-xl font-bold text-gray-800">QR Code para Depósito</h3>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl inline-block border border-gray-100">
              <div className="w-56 h-56 mx-auto bg-white border-4 border-white shadow-sm rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src="/qr-code-pix.jpg" 
                  alt="QR Code PIX" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            <p className="text-sm font-medium text-gray-500">
              Escaneie o QR Code acima para realizar o depósito via PIX
            </p>
            
            {/* Dados do PIX */}
            <div className="mt-6 p-5 bg-slate-50 rounded-xl text-left border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Dados para PIX Manual
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-500">Destinatário:</span>
                  <span className="text-slate-900 font-medium">Douglas Francisco Tabella</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-500">CPF:</span>
                  <span className="text-slate-900 font-medium">***.437.607-**</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="font-semibold text-slate-500">Chave PIX:</span>
                  <span className="text-slate-900 font-medium break-all">86b73193-e9b8-4f82-86d7-a6cd3607a319</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de depósito */}
      <Card className="shadow-lg border-t-4 border-t-green-600">
        <CardContent className="pt-8">
          {showSuccess ? (
            <div className="text-center py-10">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-800 mb-3">
                Solicitação Enviada!
              </h3>
              <p className="text-gray-600 max-w-xs mx-auto">
                Sua solicitação foi enviada via WhatsApp. Não esqueça de enviar o comprovante para validação.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-700 font-bold">Nome Completo *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="h-12 border-gray-300 focus:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf" className="text-gray-700 font-bold">CPF *</Label>
                  <Input
                    id="cpf"
                    name="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    required
                    className="h-12 border-gray-300 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-gray-700 font-bold">Valor do Depósito (R$) *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">R$</span>
                  <Input
                    id="amount"
                    name="amount"
                    type="text"
                    placeholder="0,00"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    className="h-12 pl-10 border-gray-300 focus:ring-green-500 text-lg font-bold"
                  />
                </div>
              </div>

              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <AlertDescription className="text-amber-800 ml-2">
                  <strong>Atenção:</strong> Você será redirecionado para o WhatsApp. Envie a mensagem gerada junto com o comprovante.
                </AlertDescription>
              </Alert>

              <Button 
                type="submit" 
                className="w-full h-14 bg-green-600 hover:bg-green-700 text-white text-lg font-bold shadow-md transition-all active:scale-[0.98]" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-6 w-6 mr-3" />
                    Fazer Depósito via WhatsApp
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Instruções Adicionais */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h4 className="font-bold text-gray-800 mb-4">Passo a passo para investir:</h4>
        <div className="space-y-4">
          {[
            { step: 1, text: "Fale com seu consultor ou encontre um clicando no botão no topo desta página." },
            { step: 2, text: "Realize o pagamento via PIX utilizando o QR Code ou os dados manuais." },
            { step: 3, text: "Preencha o formulário acima com seus dados e o valor depositado." },
            { step: 4, text: "Envie a mensagem no WhatsApp e anexe o seu comprovante de pagamento." }
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                {item.step}
              </div>
              <p className="text-gray-700 text-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
