import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { ConfigProvider, Layout } from "antd";

import esES from 'antd/locale/es_ES';
import { AppRouter } from "./router/app.router";
import { paraisoDarkTheme, paraisoLightTheme } from "./theme/paraiso.theme";
import { useAuthStore } from "./auth";
import { useThemeStore } from "./theme/theme.store";

export default function ParaisoAdmin() {
  const darkMode = useThemeStore((s) => s.darkMode);
  const userProfile = useAuthStore((s) => s.userProfile);
  const logout = useAuthStore((s) => s.logout);

  // Solo al arrancar: restaura la sesión guardada. Tras el login, el propio login() carga el perfil.
  useEffect(() => {
    if (localStorage.getItem('token')) {
      userProfile();
    } else {
      logout();
    }
  }, [userProfile, logout])


  return (
    <ConfigProvider
      locale={esES}
      theme={darkMode ? paraisoDarkTheme : paraisoLightTheme}
    >
      <Layout style={{ minHeight: "calc(100vh)" }}>
        <RouterProvider router={AppRouter} />
      </Layout>
    </ConfigProvider>
  )
}
