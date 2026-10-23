import { useState } from "react";
import { Form, Input, Modal, notification } from "antd";
import { isAxiosError } from "axios";
import { useCategoryStore } from "../store/category.store";
import type { ICategory, ICategoryRequest } from "../interfaces/category.interface";

type Props = {
    open: boolean;
    onClose: () => void;
    // Si viene, el modal edita esa categoría; si no, crea una nueva
    category?: ICategory;
};

export const CategoryFormModal = ({ open, onClose, category }: Props) => {
    const [form] = Form.useForm<ICategoryRequest>();
    const [api, contextHolder] = notification.useNotification();
    const [saving, setSaving] = useState(false);
    const createCategory = useCategoryStore((s) => s.createCategory);
    const updateCategory = useCategoryStore((s) => s.updateCategory);
    const isEdit = !!category;

    const onFinish = async (values: ICategoryRequest) => {
        setSaving(true);
        try {
            if (category) await updateCategory(category.id, values);
            else await createCategory(values);
            api.success({
                title: isEdit ? 'Categoría actualizada' : 'Categoría creada',
                description: `"${values.nameCategory}" se ${isEdit ? 'actualizó' : 'creó'} correctamente.`,
            });
            onClose();
        } catch (error) {
            const detail = isAxiosError(error) ? error.response?.data?.detail : undefined;
            api.error({
                title: isEdit ? 'No se pudo actualizar la categoría' : 'No se pudo crear la categoría',
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
                title={isEdit ? 'Editar categoría' : 'Nueva categoría'}
                open={open}
                okText={isEdit ? 'Guardar' : 'Crear'}
                cancelText="Cancelar"
                confirmLoading={saving}
                onOk={form.submit}
                onCancel={onClose}
                afterClose={form.resetFields}
                destroyOnHidden
            >
                {/* destroyOnHidden remonta el Form al abrir, así initialValues toma la categoría actual */}
                <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ nameCategory: category?.nameCategory }}>
                    <Form.Item
                        name="nameCategory"
                        label="Nombre"
                        rules={[
                            { required: true, whitespace: true, message: 'El nombre es requerido' },
                            { max: 100, message: 'Máximo 100 caracteres' },
                        ]}
                    >
                        <Input placeholder="Ej. Obras públicas" maxLength={100} showCount autoFocus />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
