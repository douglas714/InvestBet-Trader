// OneSignal Service Worker (Corrigido para v16)
// Este arquivo deve apenas importar o script principal do OneSignal.
// A chamada OneSignal.init() e os listeners customizados foram removidos
// para corrigir o erro "OneSignal is not defined" e garantir a compatibilidade com o SDK v16.

importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');
