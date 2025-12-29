import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'
import { Card, CardContent } from './ui/card'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { 
  MessageCircle, 
  Calendar, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  CreditCard,
  Loader2
} from 'lucide-react'

export default function WithdrawForm() {
  const { profile, user } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    cpf: '',
    amount: ''
  })
  const [pixKey, setPixKey] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRegisteringPix, setIsRegisteringPix] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [pixRegistered, setPixRegistered] = useState(false)
  const [showPixInput, setShowPixInput] = useState(false)

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        fullName: profile.name || '',
        cpf: profile.cpf || ''
      }))
      
      // Verifica se o PIX já está cadastrado no perfil do Supabase
      // O campo no banco é "CHAVE PIX" (com espaço e maiúsculo conforme a imagem)
      // No JS o Supabase costuma retornar exatamente como está no banco
      const hasPix = !!(profile['CHAVE PIX'] || profile.chave_pix)
      setPixRegistered(hasPix)
    }
  }, [profile])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'cpf') {
      const formattedCpf = value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        .substring(0, 14)
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedCpf
      }))
    } else if (name === 'amount') {
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

  const handleRegisterPix = async () => {
    if (!pixKey.trim()) {
      alert('Por favor, insira uma chave PIX válida.')
      return
    }

    setIsRegisteringPix(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 'CHAVE PIX': pixKey })
        .eq('id', user.id)

      if (error) throw error

      setPixRegistered(true)
      setShowPixInput(false)
      alert('Chave PIX cadastrada com sucesso!')
      
      // Recarregar a página ou atualizar o estado global seria ideal, 
      // mas para simplicidade aqui atualizamos o estado local
    } catch (error) {
      console.error('Erro ao cadastrar PIX:', error)
      alert('Erro ao cadastrar PIX. Tente novamente.')
    } finally {
      setIsRegisteringPix(false)
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
    
    if (!amount || parseFloat(amount.replace(/\./g, '').replace(',', '.')) <= 0) {
      alert('Por favor, informe um valor válido para saque.')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const { fullName, cpf, amount } = formData
      const whatsappNumber = '5522997291348'
      
      const message = `🏦 *SOLICITAÇÃO DE SAQUE DE CAPITAL - InvestBet Capital*\n\n👤 *Nome Completo:* ${fullName}\n📄 *CPF:* ${cpf}\n💰 *Valor do Saque:* R$ ${amount}\n\n📅 *Data da Solicitação:* ${new Date().toLocaleDateString('pt-BR')}\n\n---\nEsta é uma solicitação automática gerada pelo sistema.`

      const encodedMessage = encodeURIComponent(message)
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
      
      window.open(whatsappUrl, '_blank')
      setShowSuccess(true)
      
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          amount: ''
        }))
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Alert>
          <Calendar className="h-4 w-4" />
          <AlertDescription>
            <strong>Prazo de Processamento:</strong><br />
            O pagamento da rentabilidade é feito automaticamente todo dia 1° de cada mês.
          </AlertDescription>
        </Alert>
        
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            <strong>Tempo de Pagamento:</strong><br />
            O valor é creditado em até 24 horas após o processamento automático.
          </AlertDescription>
        </Alert>
      </div>

      {/* Cadastro PIX para Rentabilidade */}
      {!pixRegistered ? (
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="pt-6 space-y-4">
            {!showPixInput ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Chave PIX não cadastrada
                    </h3>
                    <p className="text-xs text-gray-500">
                      Necessário para receber rendimentos automáticos.
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs border-green-200 text-green-700 hover:bg-green-50"
                  onClick={() => setShowPixInput(true)}
                >
                  Cadastrar PIX
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Label htmlFor="pixKey" className="text-xs">Digite sua Chave PIX (CPF, Email, Celular ou Chave Aleatória)</Label>
                <div className="flex gap-2">
                  <Input
                    id="pixKey"
                    placeholder="Sua chave PIX"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    className="h-9 text-sm"
                  />
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700 h-9"
                    onClick={handleRegisterPix}
                    disabled={isRegisteringPix}
                  >
                    {isRegisteringPix ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-9 text-xs"
                    onClick={() => setShowPixInput(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Alert className="border-blue-100 bg-blue-50/50">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 text-xs">
            <strong>PIX Cadastrado!</strong> Para alterar sua chave, entre em contato com o suporte.
          </AlertDescription>
        </Alert>
      )}

      {/* Formulário de saque de CAPITAL */}
      <Card>
        <CardContent className="pt-6">
          {showSuccess ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-700 mb-2">
                Solicitação de Saque de Capital Enviada com Sucesso!
              </h3>
              <p className="text-gray-600">
                Sua solicitação de saque de capital foi enviada via WhatsApp. Aguarde o contato da nossa equipe.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Valor do Saque de Capital (R$) * (Disponível após 12 meses de investimento)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="text"
                  placeholder="0,00"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>

              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  <strong>Atenção:</strong> Ao clicar em "Solicitar Saque", você será redirecionado para o WhatsApp 
                  com uma mensagem pré-preenchida contendo seus dados. Envie a mensagem para finalizar a solicitação.
                </AlertDescription>
              </Alert>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Processando...
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Solicitar Saque via WhatsApp
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Alert className="border-blue-200 bg-blue-50">
        <AlertDescription className="text-blue-800">
          <strong>Informações Importantes:</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• O pagamento da rentabilidade é processado automaticamente no primeiro dia útil de cada mês.</li>
            <li>• O prazo para recebimento da rentabilidade é de até 24 horas após o processamento automático.</li>
            <li>• <strong>Saque do Capital:</strong> Só pode ser realizado após 12 meses (365 dias) do investimento inicial.</li>
            <li>• <strong>Antes de 12 meses:</strong> Apenas o pagamento automático da rentabilidade é realizado. O capital fica bloqueado.</li>
            <li>• Certifique-se de que todos os dados estão corretos antes de enviar</li>
            <li>• Em caso de dúvidas, entre em contato conosco pelo WhatsApp</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
