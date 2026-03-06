import { useState, useEffect } from "react";
import { Bell, BellOff, CheckCircle, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  requestNotificationPermission,
  isUserSubscribed
} from "../services/oneSignalService";

export default function NotificationSettings() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const pushSupported =
        "Notification" in window &&
        "serviceWorker" in navigator &&
        "PushManager" in window;

      if (Notification.permission === "denied") { setStatus("denied"); return; }

      try {
        const subscribed = await isUserSubscribed();
        setStatus(subscribed ? "subscribed" : "default");
      } catch {
        setStatus(Notification.permission === "granted" ? "subscribed" : "default");
      }
    };
    checkStatus();
  }, []);

  const handleEnableNotifications = async () => {
    setLoading(true);
    try {
      const granted = await requestNotificationPermission();
      if (granted) {
        setStatus("subscribed");
      } else {
        setStatus(Notification.permission === "denied" ? "denied" : "default");
      }
    } catch (error) {
      console.error("[NotificationSettings] Erro:", error);
      setStatus("default");
    } finally {
      setLoading(false);
    }
  };

  if (status === "unsupported") {
    return (
      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <X className="h-5 w-5" />
            Notificações não suportadas
          </CardTitle>
          <CardDescription className="text-red-600">
            Seu navegador não suporta notificações push. Use Chrome, Firefox ou Edge.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (status === null) {
    return (
      <Card className="bg-gray-50 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
            Verificando status das notificações...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (status === "subscribed") {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            Notificações Ativadas
          </CardTitle>
          <CardDescription className="text-green-600">
            Você receberá alertas em tempo real sobre seus investimentos e lucros.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (status === "denied") {
    return (
      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700">
            <BellOff className="h-5 w-5" />
            Notificações Bloqueadas
          </CardTitle>
          <CardDescription className="text-amber-600">
            Você bloqueou as notificações. Clique no cadeado na barra de endereço e permita notificações para este site.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="transition-all bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellOff className="h-5 w-5 text-blue-600" />
          <span className="text-blue-700">Ative as Notificações</span>
        </CardTitle>
        <CardDescription className="text-blue-600">
          Receba alertas em tempo real sobre seus investimentos e lucros.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleEnableNotifications}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 text-base shadow-lg"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Ativando notificações...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Ativar Notificações Agora
            </span>
          )}
        </Button>

        <div className="mt-4 p-3 bg-white/60 rounded-lg border border-blue-100">
          <p className="text-sm text-gray-700 font-semibold mb-2">Você receberá notificações sobre:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Lucros e rendimentos dos seus investimentos</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Atualizações de saldo em tempo real</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Resultados mensais de rentabilidade</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Avisos e comunicados importantes</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
