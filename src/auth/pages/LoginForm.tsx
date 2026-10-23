import { useState } from "react";
import { Button, Col, Form, Input, Row } from "antd";
import { useAuthStore } from "../store/auth.store";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";


export const LoginForm = () => {
    const navigate = useNavigate();
    const login = useAuthStore((s) => s.login);
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async ({ email, password }: { email: string; password: string }) => {
        setIsLoading(true);
        const isValid = await login(email, password);
        if (isValid) {
            navigate('/');
            return;
        };
        // ponytail: login() solo devuelve boolean; si hace falta distinguir 401 de caída de red, que devuelva el motivo
        form.setFields([{ name: 'password', errors: ['Correo o contraseña incorrectos, o el servidor no responde'] }]);
        setIsLoading(false);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            name="loginForm"
            onFinish={handleSubmit}
            size="large"
            classNames={{ label: "login__label" }}
        >
            <Row gutter={[16, 8]}>
                <Col
                    xs={{ flex: "100%" }}
                    xl={{ flex: "100%" }}
                >
                    <Form.Item
                        label="Correo"
                        name="email"
                        rules={[
                            { required: true, message: 'Colocar correo' },
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="usuario@paraiso.gob.mx"
                            type="email"
                            autoComplete="username" />
                    </Form.Item>
                </Col>
                <Col
                    xs={{ flex: "100%" }}
                    xl={{ flex: "100%" }}
                >
                    <Form.Item
                        label="Contraseña"
                        name="password"
                        rules={[
                            { required: true, message: 'Colocar contraseña' },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder='Contraseña'
                            autoComplete="current-password" />
                    </Form.Item>
                </Col>
                
                <Col
                    xs={{ flex: "100%" }}
                    xl={{ flex: "100%" }}
                >
                    <Form.Item >
                        <Button type="primary" htmlType="submit" block loading={isLoading}>
                            Entrar
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}
