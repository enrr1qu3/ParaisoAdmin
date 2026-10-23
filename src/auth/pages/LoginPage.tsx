import { Card, Flex, Typography } from "antd";
import { LoginForm } from "./LoginForm";

const { Title, Text, Paragraph } = Typography;

import "./LoginPage.css";

export const LoginPage = () => {
    return (
        <Flex vertical className="login">
            {/* Curvas institucionales de fondo (mar y naranja del escudo) */}
            <svg className="login__bg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <defs>
                    <linearGradient id="login-mar" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#1E9BD7" stopOpacity="0.22" />
                        <stop offset="1" stopColor="#1E9BD7" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="login-naranja" x1="1" y1="1" x2="0" y2="0">
                        <stop offset="0" stopColor="#EE7F12" stopOpacity="0.22" />
                        <stop offset="1" stopColor="#EE7F12" stopOpacity="0" />
                    </linearGradient>
                    <filter id="login-blur"><feGaussianBlur stdDeviation="18" /></filter>
                </defs>
                <path d="M0 0 H380 C 460 220, 560 360, 820 440 C 460 430, 180 300, 0 160 Z" fill="url(#login-mar)" filter="url(#login-blur)" />
                <path d="M0 80 C 180 260, 380 400, 700 440" className="login__bg-line" />
                <path d="M0 220 C 200 360, 420 430, 640 450" className="login__bg-line login__bg-line--mar" />
                <path d="M1600 120 C 1420 380, 1240 600, 1000 690 C 1260 700, 1460 640, 1600 560 Z" fill="url(#login-naranja)" filter="url(#login-blur)" />
                <path d="M1600 180 C 1430 420, 1260 610, 1060 690" className="login__bg-line login__bg-line--mar" />
                <path d="M1280 360 C 1420 420, 1540 520, 1600 660" className="login__bg-line" />
            </svg>

            <Flex vertical align="center" justify="center" gap={24} className="login__main">
                {/* Identidad institucional: escudo transparente + texto, sigue el tema */}
                <Flex align="center" gap={16} className="login__identity">
                    <img src="/Paraiso.svg" alt="Escudo de Paraíso" className="login__shield" />
                    <Flex vertical>
                        <Title level={1} className="login__name">PARAÍSO</Title>
                        <Text strong className="login__motto">Legado que Trasciende</Text>
                        <Text strong className="login__gov">Gobierno en Movimiento</Text>
                        <Text strong className="login__period">2024 – 2027</Text>
                    </Flex>
                </Flex>

                <Card className="login__card">
                    <Title level={3} className="login__title">Iniciar sesión</Title>
                    <Paragraph type="secondary">
                        Ingresa con tu correo institucional para acceder al sistema.
                    </Paragraph>
                    {/* Formulario */}
                    <LoginForm />
                    
                    <Text type="secondary" className="login__help">
                        ¿No puedes entrar? Solicita apoyo al área de Tecnologías de la Información del Ayuntamiento.
                    </Text>
                </Card>

                <Text type="secondary" className="login__footer">
                    H. Ayuntamiento Constitucional de Paraíso, Tabasco. Administración 2024–2027.
                </Text>
            </Flex>

            <svg className="login__wave" viewBox="0 0 1200 160" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0 60 C 200 10, 400 110, 600 60 S 1000 10, 1200 60 L1200 160 L0 160 Z" className="login__wave-water" />
                <path d="M0 60 C 200 10, 400 110, 600 60 S 1000 10, 1200 60" className="login__wave-line" />
            </svg>
        </Flex>
    );
};