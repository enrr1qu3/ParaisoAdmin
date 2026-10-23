import { useState } from "react";
import { Avatar, Button, Dropdown, Flex, Layout, Menu, Tooltip, Typography } from "antd";
import type { MenuProps } from "antd";
import {
    AppstoreOutlined,
    DownOutlined,
    HistoryOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MoonOutlined,
    SunOutlined,
    TagsOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation } from "react-router";
import "./AdminLayout.css";
import { useAuthStore } from "../auth";
import { useThemeStore } from "../theme/theme.store";

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;

const menuItems: MenuProps["items"] = [
    { key: "/", icon: <HistoryOutlined />, label: <Link to="/">Bitácora</Link> },
    { key: "/secciones", icon: <AppstoreOutlined />, label: <Link to="/secciones">Secciones</Link> },
    { key: "/categorias", icon: <TagsOutlined />, label: <Link to="/categorias">Categorías</Link> },
    { key: "/usuarios", icon: <TeamOutlined />, label: <Link to="/usuarios">Usuarios</Link> },
];

// ponytail: "perfil" sin acción todavía
const userMenu: MenuProps["items"] = [
    // { key: "perfil", icon: <UserOutlined />, label: "Mi perfil" },
    { type: "divider" },
    { key: "salir", icon: <LogoutOutlined />, label: "Cerrar sesión", danger: true },
];

export default function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const { pathname } = useLocation();
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const darkMode = useThemeStore((s) => s.darkMode);
    const toggleTheme = useThemeStore((s) => s.toggleTheme);
    // "/secciones/12" marca "Secciones"
    const selectedKey = "/" + (pathname.split("/")[1] ?? "");


    return (
        <Layout className="admin">
            {/* Bajo lg (992px) se pliega solo; el botón del header lo abre/cierra */}
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                breakpoint="lg"
                onBreakpoint={setCollapsed}
                width={248}
                theme="light"
                className="admin__sider"
            >
                <Link to="/" className="admin__brand">
                    <img src="/Paraiso.svg" alt="Escudo de Paraíso" className="admin__shield" />
                    {!collapsed && (
                        <Flex vertical className="admin__brand-text">
                            <span className="admin__name">PARAÍSO</span>
                            <span className="admin__gov">Gobierno en Movimiento</span>
                        </Flex>
                    )}
                </Link>
                <div className="admin__stripe" aria-hidden="true" />
                <Menu mode="inline" selectedKeys={[selectedKey]} items={menuItems} className="admin__menu" />
            </Sider>

            {/* Solo visible en móvil (CSS): tocar fuera del menú abierto lo cierra */}
            {!collapsed && <div className="admin__backdrop" onClick={() => setCollapsed(true)} aria-hidden="true" />}

            <Layout className="admin__main">
                <Header className="admin__header">
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        aria-label={collapsed ? "Abrir menú" : "Cerrar menú"}
                        className="admin__toggle"
                    />
                    <Text strong className="admin__title">Administración Municipal</Text>

                    <Tooltip title={darkMode ? "Activar modo claro" : "Activar modo oscuro"}>
                        <Button
                            type="text"
                            icon={darkMode ? <SunOutlined /> : <MoonOutlined />}
                            onClick={toggleTheme}
                            aria-label={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                        />
                    </Tooltip>

                    <Dropdown
                        menu={{ items: userMenu, onClick: ({ key }) => key === "salir" && logout() }}
                        trigger={["click"]} placement="bottomRight">
                        <Button type="text" className="admin__user">
                            <Avatar size="small" icon={<UserOutlined />} className="admin__avatar" />
                            <span className="admin__user-name">{user?.firstName || "Sin información"}</span>
                            <DownOutlined className="admin__user-caret" />
                        </Button>
                    </Dropdown>
                </Header>

                <Content className="admin__content">
                    <Outlet />
                </Content>

                <Footer className="admin__footer">
                    <Text type="secondary">
                        H. Ayuntamiento Constitucional de Paraíso, Tabasco. Administración 2024–2027.
                    </Text>
                </Footer>
            </Layout>
        </Layout>
    );
}
