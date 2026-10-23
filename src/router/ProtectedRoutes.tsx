import type { PropsWithChildren } from "react";

import { Spin } from "antd";
import { Navigate } from "react-router";
import { useAuthStore } from "../auth/store/auth.store";

export const NotAuthenticatedRoute = ({ children }: PropsWithChildren) => {
    const authStatus = useAuthStore((s) => s.authStatus);
    if (authStatus === 'checking') return <Spin fullscreen />;

    if (authStatus === 'authenticated') return <Navigate to='/' replace />;

    return children;
};

export const AdminRoute = ({ children }: PropsWithChildren) => {
    const authStatus = useAuthStore((s) => s.authStatus);
    if (authStatus === 'checking') return <Spin fullscreen />;

    if (authStatus === 'not-authenticated') return <Navigate to='/auth/login' replace />;

    // if (!isAdmin()) return <Navigate to='/' />;

    return children;
};
