import { useState } from "react";
import { Form, Input, Modal, notification } from "antd";
import { isAxiosError } from "axios";
import { useSectionStore } from "../store/section.store";
import type { ISection, ISectionRequest } from "../interfaces/section.interface";

type Props = {
    open: boolean;
    onClose: () => void;
    // Si viene, el modal edita esa sección; si no, crea una nueva
    section?: ISection;
};

export const SectionFormModal = ({ open, onClose, section }: Props) => {
    const [form] = Form.useForm<ISectionRequest>();
    const [api, contextHolder] = notification.useNotification();
    const [saving, setSaving] = useState(false);
    const createSection = useSectionStore((s) => s.createSection);
    const updateSection = useSectionStore((s) => s.updateSection);
    const isEdit = !!section;

    const onFinish = async (values: ISectionRequest) => {
        setSaving(true);
        try {
            if (section) await updateSection(section.id, values);
            else await createSection(values);
            api.success({
                title: isEdit ? 'Sección actualizada' : 'Sección creada',
                description: `"${values.nameSection}" se ${isEdit ? 'actualizó' : 'creó'} correctamente.`,
            });
            onClose();
        } catch (error) {
            const detail = isAxiosError(error) ? error.response?.data?.detail : undefined;
            api.error({
                title: isEdit ? 'No se pudo actualizar la sección' : 'No se pudo crear la sección',
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
                title={isEdit ? 'Editar sección' : 'Nueva sección'}
                open={open}
                okText={isEdit ? 'Guardar' : 'Crear'}
                cancelText="Cancelar"
                confirmLoading={saving}
                onOk={form.submit}
                onCancel={onClose}
                afterClose={form.resetFields}
                destroyOnHidden
            >
                {/* destroyOnHidden remonta el Form al abrir, así initialValues toma la sección actual */}
                <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ nameSection: section?.nameSection }}>
                    <Form.Item
                        name="nameSection"
                        label="Nombre"
                        rules={[
                            { required: true, whitespace: true, message: 'El nombre es requerido' },
                            { max: 150, message: 'Máximo 150 caracteres' },
                        ]}
                    >
                        <Input placeholder="Ej. Transparencia" maxLength={150} showCount autoFocus />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
