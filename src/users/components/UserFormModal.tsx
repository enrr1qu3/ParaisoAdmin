import { useState } from "react";
import { Col, Form, Input, Modal, Row, notification } from "antd";
import { LockOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { isAxiosError } from "axios";
import { useUsersStore } from "../store/users.store";
import type { IRegisterRequest } from "../interfaces/users.interface";

// Misma política que la API
const PASSWORD_RULES = (
    <ul style={{ margin: 0, paddingInlineStart: 16 }}>
        <li>Mínimo 6 caracteres</li>
        <li>Al menos una letra mayúscula</li>
        <li>Al menos un dígito</li>
    </ul>
);

type Props = {
    open: boolean;
    onClose: () => void;
};

export const UserFormModal = ({ open, onClose }: Props) => {
    const [form] = Form.useForm<IRegisterRequest>();
    const [api, contextHolder] = notification.useNotification();
    const [saving, setSaving] = useState(false);
    const createUser = useUsersStore((s) => s.createUser);

    const onFinish = async (values: IRegisterRequest) => {
        setSaving(true);
        try {
            // La API espera null en los opcionales, no ""
            await createUser({
                ...values,
                maternalLastName: values.maternalLastName?.trim() || null,
                phoneNumber: values.phoneNumber?.trim() || null,
            });
            api.success({
                title: 'Usuario creado',
                description: `"${values.email}" se creó correctamente.`,
            });
            onClose();
        } catch (error) {
            // 409: el correo ya está registrado; 400: no cumple la política
            const detail = isAxiosError(error) ? error.response?.data?.detail : undefined;
            api.error({
                title: 'No se pudo crear el usuario',
                description: detail ?? 'Intenta de nuevo más tarde.',
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            {contextHolder}
            <Modal
                title="Nuevo usuario"
                open={open}
                okText="Crear"
                cancelText="Cancelar"
                confirmLoading={saving}
                onOk={form.submit}
                onCancel={onClose}
                afterClose={form.resetFields}
                destroyOnHidden
                width={640}
            >
                <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
                    <Row gutter={16}>
                        <Col xs={24}>
                            <Form.Item
                                name="firstName"
                                label="Nombre"
                                rules={[{ required: true, whitespace: true, message: 'El nombre es requerido' }]}
                            >
                                <Input placeholder="Ej. María" autoFocus />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="paternalLastName"
                                label="Apellido paterno"
                                rules={[{ required: true, whitespace: true, message: 'El apellido paterno es requerido' }]}
                            >
                                <Input placeholder="Ej. López" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="maternalLastName" label="Apellido materno">
                                <Input placeholder="Opcional" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="email"
                                label="Correo"
                                rules={[
                                    { required: true, message: 'El correo es requerido' },
                                    { type: 'email', message: 'Correo no válido' },
                                ]}
                            >
                                <Input prefix={<MailOutlined />} placeholder="usuario@paraiso.gob.mx" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="phoneNumber"
                                label="Teléfono"
                                rules={[{ pattern: /^\d{10}$/, message: 'Debe tener 10 dígitos' }]}
                            >
                                <Input prefix={<PhoneOutlined />} placeholder="Opcional" maxLength={10} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="password"
                                label="Contraseña"
                                tooltip={PASSWORD_RULES}
                                hasFeedback
                                rules={[
                                    { required: true, message: 'La contraseña es requerida' },
                                    // Misma política que la API
                                    { pattern: /^(?=.*[A-Z])(?=.*\d).{6,}$/, message: 'Mínimo 6 caracteres, una mayúscula y un dígito' },
                                ]}
                            >
                                <Input.Password prefix={<LockOutlined />} autoComplete="new-password" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="confirmPassword"
                                label="Confirmar contraseña"
                                tooltip="Debe ser igual a la contraseña"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    { required: true, message: 'Confirma la contraseña' },
                                    ({ getFieldValue }) => ({
                                        validator: (_, value) => !value || value === getFieldValue('password')
                                            ? Promise.resolve()
                                            : Promise.reject(new Error('Las contraseñas no coinciden')),
                                    }),
                                ]}
                            >
                                <Input.Password prefix={<LockOutlined />} autoComplete="new-password" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};
