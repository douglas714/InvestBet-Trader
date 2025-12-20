import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart
} from 'recharts'
import {
  TrendingUp,
  RefreshCw,
  Calendar,
  Target,
  Award,
  Activity,
  BarChart3,
  ExternalLink
} from 'lucide-react'
import { fetchMonthlyProfitability } from '../services/googleSheets'

export default function MonthlyProfitability() {
  const [data, setData] = useState([])
  const [annualData, setAnnualData] = useState([])
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [chartType, setChartType] = useState("bar") // 'line', 'bar', 'area'
  const [totalReturnFromSheet, setTotalReturnFromSheet] = useState(0)

  useEffect(() => {
    fetchGoogleSheetsData()
  }, [])

  const fetchGoogleSheetsData = async () => {
    setLoading(true)
    try {
      const result = await fetchMonthlyProfitability()
      setData(result.monthlyData)
      setTotalReturnFromSheet(result.totalReturnFromSheet)
      setAnnualData(result.annualData || [])
      setLastUpdate(new Date().toLocaleTimeString("pt-BR"))
    } catch (error) {
      console.error("Erro ao buscar dados do Google Sheets:", error)
      // Em caso de erro, pode-se manter os dados anteriores ou definir um estado de erro
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = () => {
    const validData = data.filter(item => item.rentabilidade > 0)
    const totalMonths = validData.length
    
    const totalReturn = totalReturnFromSheet
    const avgMonthly = totalMonths > 0 ? totalReturn / totalMonths : 0
    const bestMonth = Math.max(...data.map(item => item.rentabilidade))
    
    return {
      totalReturn,
      avgMonthly,
      bestMonth,
      totalMonths
    }
  }

  const stats = calculateStats()

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-blue-600">
            {`Rentabilidade: ${payload[0]?.value?.toFixed(2)}%`}
          </p>
          {payload[1] && (
            <p className="text-green-600">
              {`Acumulado: ${payload[1]?.value?.toFixed(2)}%`}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    }

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mes" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="rentabilidade" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="acumulado" 
              stroke="#10b981" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        )
      
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mes" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="rentabilidade" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        )
      
      case 'area':
      default:
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorRentabilidade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mes" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="rentabilidade" 
              stroke="#3b82f6" 
              fillOpacity={1} 
              fill="url(#colorRentabilidade)"
              strokeWidth={3}
            />
          </AreaChart>
        )
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Rentabilidade Total</p>
                <p className="text-2xl font-bold text-blue-700 animate-pulse">{stats.totalReturn.toFixed(2)}%</p>
              </div>
              <div className="p-2 bg-blue-200 rounded-full">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Média Mensal</p>
                <p className="text-2xl font-bold text-green-700">{stats.avgMonthly.toFixed(2)}%</p>
              </div>
              <div className="p-2 bg-green-200 rounded-full">
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Melhor Mês</p>
                <p className="text-2xl font-bold text-purple-700">{stats.bestMonth.toFixed(2)}%</p>
              </div>
              <div className="p-2 bg-purple-200 rounded-full">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Meses Ativos</p>
                <p className="text-2xl font-bold text-orange-700">{stats.totalMonths}</p>
              </div>
              <div className="p-2 bg-orange-200 rounded-full">
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Banner motivacional */}
      <Card className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">🚀 Performance Excepcional!</h3>
              <p className="text-lg opacity-90">
                A rentabilidade total de <span className="font-bold">{stats.totalReturn.toFixed(2)}%</span> está superando as expectativas do mercado
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico Principal */}
      <Card className="hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Evolução da Rentabilidade Mensal
              </CardTitle>
              <CardDescription>
                Acompanhe o desempenho mês a mês dos seus investimentos com dados em tempo real
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Seletor de tipo de gráfico */}
              <div className="flex bg-gray-100 rounded-lg p-1 shadow-inner">
                <button
                  onClick={() => setChartType("bar")}
                  className={`px-3 py-1 rounded text-sm transition-all duration-200 ${
                    chartType === "bar" 
                      ? "bg-white text-blue-600 shadow-sm transform scale-105" 
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  Barras
                </button>
              </div>

              <Button 
                onClick={fetchGoogleSheetsData}
                disabled={loading}
                variant="outline"
                size="sm"
                className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : 'hover:rotate-180 transition-transform duration-300'}`} />
                {loading ? 'Atualizando...' : 'Atualizar Histórico'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
          
          {lastUpdate && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Última atualização: {lastUpdate.toLocaleString('pt-BR')}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumo das Rentabilidades Anuais */}
      {annualData.length > 0 && (
        <Card className="hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
              <div>
                <CardTitle>Resumo de Rentabilidades Anuais</CardTitle>
                <CardDescription>Histórico de rentabilidades por ano</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Ano</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Rentabilidade</th>
                  </tr>
                </thead>
                <tbody>
                  {annualData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-800">{item.ano}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          item.rentabilidade > 0 
                            ? 'bg-green-100 text-green-800' 
                            : item.rentabilidade < 0 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.rentabilidade.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  )
}
