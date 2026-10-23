import { theme, type ThemeConfig } from "antd";

// Colores institucionales tomados del logo de Paraíso
export const paraisoColors = {
    naranja: "#EE7F12",
    mar: "#1E9BD7",
    gris: "#7A7A7A",
    negro: "#000000",
};

const base: ThemeConfig["token"] = {
    fontFamily: "Inter, system-ui, sans-serif",
    borderRadius: 6,
    colorInfo: paraisoColors.mar,
};

export const paraisoLightTheme: ThemeConfig = {
    algorithm: theme.defaultAlgorithm,
    token: {
        ...base,
        // Naranja oscurecido: texto blanco del botón primario con contraste AA
        colorPrimary: "#B85A06",
        colorLink: "#137CB0",
        colorTextBase: "#1A1A1A",
        colorBgLayout: "#F4F5F7",
        // Placeholder más legible que el 25% por defecto
        colorTextPlaceholder: "rgba(0, 0, 0, 0.45)",
        // Texto secundario (Typography type="secondary") más legible que el 45% por defecto
        colorTextDescription: "rgba(0, 0, 0, 0.65)",
    },
};

export const paraisoDarkTheme: ThemeConfig = {
    algorithm: theme.darkAlgorithm,
    token: {
        ...base,
        colorPrimary: paraisoColors.naranja,
        colorLink: "#4FB3E6",
        colorBgBase: paraisoColors.negro,
        colorTextPlaceholder: "rgba(255, 255, 255, 0.45)",
        colorTextDescription: "rgba(255, 255, 255, 0.70)",
    },
    components: {
        Button: {
            // Texto negro sobre naranja, como en el logo (blanco no llega a contraste AA)
            primaryColor: paraisoColors.negro,
        },
    },
};
