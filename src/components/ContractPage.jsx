import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { ScrollArea } from './ui/scroll-area'
import logoImage from '../assets/logo.jpeg'

export default function ContractPage({ onAccept }) {
  const [accepted, setAccepted] = useState(false)

  const handleAccept = () => {
    if (accepted) {
      onAccept()
    }
  }

  return (
    <div className="min-h-screen investbet-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl investbet-card">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src={logoImage} 
              alt="InvestBet Capital" 
              className="investbet-logo"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Contrato de Prestação de Serviços
          </CardTitle>
          <CardDescription className="text-gray-600">
            Leia atentamente todos os termos antes de prosseguir
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ScrollArea className="h-96 w-full border rounded-md p-4 bg-gray-50">
            <div className="space-y-4 text-sm text-gray-700">
              <div className="text-center mb-4">
                <h2 className="font-bold text-base text-gray-800 mb-1">
                  CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE EXECUÇÃO TÉCNICA EM ENTRETENIMENTO DIGITAL
                </h2>
                <h3 className="font-semibold text-sm text-gray-700">
                  InvestBet Capital – A Sua Vantagem Operacional no Mundo das Apostas Esportivas
                </h3>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">1. PARTES CONTRATANTES E NATUREZA DO SERVIÇO</h4>
                <p className="mb-2">
                  <strong>CONTRATADA:</strong> InvestBet Capital, empresa atuante <strong>exclusivamente</strong> no segmento de <strong>entretenimento digital</strong> e <strong>tecnologia operacional</strong>. A CONTRATADA atua como <strong>MANDATÁRIA TÉCNICA</strong>, executando ordens operacionais em plataformas de apostas esportivas.
                </p>
                <p>
                  <strong>CONTRATANTE:</strong> O Usuário que adere a este Contrato de forma eletrônica, reconhecendo a natureza <strong>recreativa e de alto risco</strong> da atividade.
                </p>
                <h5 className="font-semibold text-sm mt-4 mb-2">1.3. AVISO LEGAL E BLINDAGEM REGULATÓRIA</h5>
                <table className="w-full text-left border-collapse mb-4">
                  <thead>
                    <tr>
                      <th className="border p-2">Atividade</th>
                      <th className="border p-2">Status</th>
                      <th className="border p-2">Implicação Jurídica</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2"><strong>Consultoria Financeira</strong></td>
                      <td className="border p-2">Não Prestada</td>
                      <td className="border p-2">Não há recomendações de investimento ou análise de mercado financeiro.</td>
                    </tr>
                    <tr>
                      <td className="border p-2"><strong>Gestão de Investimentos</strong></td>
                      <td className="border p-2">Não Realizada</td>
                      <td className="border p-2">O capital não é administrado como patrimônio financeiro.</td>
                    </tr>
                    <tr>
                      <td className="border p-2"><strong>Captação de Poupança Pública</strong></td>
                      <td className="border p-2">Não Realizada</td>
                      <td className="border p-2">A CONTRATADA não se enquadra na Lei nº 7.492/86.</td>
                    </tr>
                    <tr>
                      <td className="border p-2"><strong>Garantia de Rentabilidade</strong></td>
                      <td className="border p-2">Ausente</td>
                      <td className="border p-2">Não há promessa, seguro ou garantia de lucro ou preservação de capital.</td>
                    </tr>
                    <tr>
                      <td className="border p-2"><strong>Regulamentação</strong></td>
                      <td className="border p-2">Não Sujeita</td>
                      <td className="border p-2">A CONTRATADA não está sujeita à CVM, Banco Central ou SUSEP.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">2. OBJETO DO CONTRATO: EXECUÇÃO TÉCNICA DE MANDATO</h4>
                <p className="mb-2">
                  O objeto deste Contrato é a prestação de <strong>Serviços Operacionais e Técnicos</strong>, consistindo na <strong>execução manual e automatizada de apostas esportivas</strong> em plataformas de terceiros, seguindo a metodologia operacional interna da CONTRATADA, que é aceita pelo CONTRATANTE como seu <strong>parâmetro operacional</strong>.
                </p>
                <p>
                  A CONTRATADA não define estratégias financeiras, não administra patrimônio e não promete desempenho. Sua função é estritamente operacional e técnica.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">3. DESTINAÇÃO DO CAPITAL E EXONERAÇÃO DE RESPONSABILIDADE</h4>
                <h5 className="font-semibold text-sm mt-4 mb-2">3.1. Destinação Exclusiva</h5>
                <p className="mb-2">
                  Qualquer valor encaminhado pelo CONTRATANTE tem finalidade <strong>exclusiva</strong> de permitir a execução das operações recreativas nas plataformas de apostas.
                </p>
                <h5 className="font-semibold text-sm mt-4 mb-2">3.2. Autorização e Risco</h5>
                <p className="mb-2">
                  O CONTRATANTE autoriza a CONTRATADA a utilizar o capital para as operações, ciente de que:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 mb-2">
                  <li>Os valores <strong>não configuram investimento financeiro</strong> e não geram expectativa de retorno garantido.</li>
                  <li>O capital está sujeito a <strong>risco de perda total</strong> e não possui garantia de preservação.</li>
                  <li>A CONTRATADA atuará apenas como <strong>executora técnica</strong>, não assumindo qualquer responsabilidade pelo resultado das operações.</li>
                </ul>
                <h5 className="font-semibold text-sm mt-4 mb-2">3.3. Limitação de Responsabilidade (Cláusula Blindada)</h5>
                <p className="mb-2">
                  A responsabilidade da CONTRATADA está <strong>limitada à correta execução técnica</strong> das operações. Em nenhuma hipótese a CONTRATADA será responsável por:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Perdas, danos ou prejuízos</strong> decorrentes do resultado das operações de apostas.</li>
                  <li><strong>Falhas, bloqueios, limitações ou políticas internas</strong> impostas pelas plataformas de apostas terceiras.</li>
                  <li><strong>Danos que excedam o valor da taxa de serviço</strong> cobrada pela CONTRATADA, excluindo-se o capital operacional do CONTRATANTE.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">4. SERVIÇOS PRESTADOS: O DIFERENCIAL OPERACIONAL</h4>
                <p className="mb-2">A CONTRATADA executará:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Análise Operacional:</strong> Estudo de eventos esportivos e definição de parâmetros de execução.</li>
                  <li><strong>Execução Técnica:</strong> Realização das apostas esportivas em nome do CONTRATANTE.</li>
                  <li><strong>Apoio Operacional:</strong> Gestão da conta no sentido estritamente operacional (sem caráter financeiro ou fiduciário).</li>
                </ul>
                <p className="mt-2">
                  <strong>Nenhuma dessas atividades representa promessa de lucro, investimento ou garantia de desempenho.</strong>
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">5. POLÍTICA DE SALDO, MOVIMENTAÇÃO E SAQUES</h4>
                <h5 className="font-semibold text-sm mt-4 mb-2">5.1. Saldo e Disponibilidade</h5>
                <p className="mb-2">
                  O saldo do CONTRATANTE é o valor disponível nas plataformas de apostas, sujeito às regras e políticas dessas plataformas.
                </p>
                <h5 className="font-semibold text-sm mt-4 mb-2">5.2. Saques</h5>
                <p className="mb-2">As solicitações de saque seguirão:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Procedimentos internos</strong> da CONTRATADA.</li>
                  <li><strong>Prazos operacionais</strong> de até 7 (sete) dias úteis.</li>
                  <li><strong>Disponibilidade e políticas</strong> das plataformas de apostas.</li>
                </ul>
                <p className="mt-2">
                  A CONTRATADA não garante prazo fixo e <strong>não se responsabiliza</strong> por atrasos ou bloqueios causados pelas plataformas de terceiros.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">6. OBRIGAÇÕES DAS PARTES</h4>
                <table className="w-full text-left border-collapse mb-4">
                  <thead>
                    <tr>
                      <th className="border p-2">Parte</th>
                      <th className="border p-2">Obrigações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2"><strong>CONTRATANTE</strong></td>
                      <td className="border p-2">Fornecer informações verídicas; Avaliar sua capacidade financeira; Reconhecer a natureza recreativa e os riscos; Cumprir integralmente este Contrato.</td>
                    </tr>
                    <tr>
                      <td className="border p-2"><strong>CONTRATADA</strong></td>
                      <td className="border p-2">Empregar o máximo esforço técnico e operacional; Utilizar o capital exclusivamente nas operações; Proteger dados conforme LGPD.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">7. VIGÊNCIA, RESCISÃO E FORO</h4>
                <h5 className="font-semibold text-sm mt-4 mb-2">7.1. Vigência e Rescisão</h5>
                <p className="mb-2">
                  Este Contrato entra em vigor na data do aceite eletrônico e pode ser rescindido por qualquer parte mediante aviso prévio de <strong>30 (trinta) dias corridos</strong>.
                </p>
                <h5 className="font-semibold text-sm mt-4 mb-2">7.2. Foro (Cláusula de Eleição)</h5>
                <p className="mb-2">
                  Fica eleito o <strong>Foro da Comarca da Sede da CONTRATADA</strong> para dirimir quaisquer dúvidas ou litígios decorrentes deste Contrato, com expressa renúncia a qualquer outro, por mais privilegiado que seja.
                </p>
              </div>

              <div className="rounded-md border border-red-200 bg-red-50 p-3">
                <h4 className="font-semibold text-sm text-red-700 mb-2">DECLARAÇÃO DE CIÊNCIA E ACEITE (O SEU COMPROMISSO)</h4>
                <p className="text-sm text-red-700 mb-2">
                  <strong>O CONTRATANTE DECLARA, SOB AS PENAS DA LEI, QUE:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-red-700">
                  <li><strong>1. Leu, compreendeu e aceita integralmente</strong> todos os termos, em especial a <strong>Limitação de Responsabilidade (Cláusula 3.3)</strong>.</li>
                  <li><strong>2. Está plenamente ciente</strong> de que a atividade é de <strong>entretenimento digital</strong>, possui <strong>alto risco</strong> e <strong>não é um investimento financeiro</strong>.</li>
                  <li><strong>3. Isenta a InvestBet Capital de qualquer responsabilidade</strong> por perdas operacionais, limitando a responsabilidade da CONTRATADA à correta execução técnica do serviço.</li>
                </ul>
                <p className="mt-2 text-xs text-red-700">
                  <strong>Este Contrato substitui e revoga quaisquer acordos ou entendimentos anteriores.</strong>
                </p>
              </div>
            </div>
          </ScrollArea>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="accept-terms" 
              checked={accepted}
              onCheckedChange={setAccepted}
            />
            <label 
              htmlFor="accept-terms" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Li e concordo com todos os termos e condições acima
            </label>
          </div>
          
          <Button 
            onClick={handleAccept}
            disabled={!accepted}
            className="w-full"
          >
            Aceitar e Continuar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
