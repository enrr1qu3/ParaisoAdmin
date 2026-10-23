import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { LoginPage } from "../auth/pages/LoginPage";
import { AdminRoute, NotAuthenticatedRoute } from "./ProtectedRoutes";
import { Spin } from "antd";
import { SectionDetailPage, SectionPages } from "../section";
import { UsersPages } from "../users";
import { BinnaclePages } from "../binnacle";
import { CategoryPages } from "../category";

const AuthLayout = lazy(() => import('../auth/layouts/AuthLayout'));
const AdminLayout = lazy(() => import('../layout/AdminLayout'));


export const AppRouter = createBrowserRouter([
    {
        path: '/auth',
        element:
            <NotAuthenticatedRoute>
                <Suspense fallback={<Spin fullscreen />}>
                    <AuthLayout />
                </Suspense>
            </NotAuthenticatedRoute>,
        children: [
            {
                index: true,
                element: <Navigate to={'/auth/login'} replace />
            },
            {
                path: 'login',
                element: <LoginPage />

            },
        ]
    },
    // Admin Routes
    {
        path: '/',
        element: <AdminRoute>
            <Suspense fallback={<Spin fullscreen />}>
                <AdminLayout />
            </Suspense>
        </AdminRoute>,
        children: [
            {
                // La bitácora es lo primero que se ve al entrar
                index: true,
                element: <BinnaclePages />
            },
            {
                path: 'secciones',
                element: <SectionPages />
            },
            {
                path: 'secciones/:id',
                element: <SectionDetailPage />
            },
            {
                path: 'categorias',
                element: <CategoryPages />
            },
            {
                path: 'usuarios',
                element: <UsersPages />
            },
        ]
    },
    {
        path: '*',
        element: <Navigate to='/auth' replace />
    }
]);