import { useEffect, useState } from "react";
import { Form, Input, Modal, Select, notification } from "antd";
import { isAxiosError } from "axios";
import { createSubSectionAction, updateSubSectionAction } from "../actions/subSection.action";
import { categoryAction } from "../../category/actions/category.actions";
import { SEMESTER_OPTIONS, type Semester } from "../interfaces/subSection.interface";
import type { ISubSection } from "../interfaces/section.interface";
import type { ICategory } from "../../category/interfaces/category.interface";

type FormValues = {
    nameSubSection: string;
    semester?: Semester;
    date?: string;
    categoryId?: number;
};

type Props = {
    open: boolean;
    onClose: () => void;
    onSaved: () => void;
    sectionId: number;
    // Si viene, el modal edita esa subsección; si no, crea una nueva
    subSection?: ISubSection;
};

export const SubSectionFormModal = ({ open, onClose, onSaved, sectionId, subSection }: Props) => {
    const [form] = Form.useForm<FormValues>();
    const [api, contextHolder] = notification.useNotification();
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const isEdit = !!subSection;

    useEffect(() => {
        if (!open) return;
        setLoadingCategories(true);
        // ponytail: solo trae las primeras 50 (máximo de la API); paginar/buscar en servidor si crecen
        categoryAction({ pageSize: 50 })
            .then((data) => setCategories(data.items))
            .catch(() => setCategories([]))
            .finally(() => setLoadingCategories(false));
    }, [open]);

    const onFinish = async (values: FormValues) => {
        setSaving(true);
        // El PUT deja en null lo que no se envía, por eso se mandan siempre los opcionales
        const body = {
            nameSubSection: values.nameSubSection,
            sectionId,
            semester: values.semester ?? null,
            date: values.date || null,
            categoryId: values.categoryId ?? null,
        };
        try {
            if (subSection) await updateSubSectionAction(subSection.id, body);
            else await createSubSectionAction(body);
            api.success({
                title: isEdit ? 'Subsección actualizada' : 'Subsección creada',
                description: `"${values.nameSubSection}" se ${isEdit ? 'actualizó' : 'creó'} correctamente.`,
            });
            onSaved();
            onClose();
        } catch (error) {
            const detail = isAxiosError(error) ? error.response?.data?.detail : undefined;
            api.error({
                title: isEdit ? 'No se pudo actualizar la subsección' : 'No se pudo crear la subsección',
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
                title={isEdit ? 'Editar subsección' : 'Nueva subsección'}
                open={open}
                okText={isEdit ? 'Guardar' : 'Crear'}
                cancelText="Cancelar"
                confirmLoading={saving}
                onOk={form.submit}
                onCancel={onClose}
                afterClose={form.resetFields}
                destroyOnHidden
            >
                {/* destroyOnHidden remonta el Form al abrir, así initialValues toma la subsección actual */}
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        nameSubSection: subSection?.nameSubSection,
                        semester: subSection?.semester ?? undefined,
                        date: subSection?.date ?? undefined,
                        categoryId: subSection?.categoryId ?? undefined,
                    }}
                >
                    <Form.Item
                        name="nameSubSection"
                        label="Nombre"
                        rules={[{ required: true, whitespace: true, message: 'El nombre es requerido' }]}
                    >
                        <Input placeholder="Ej. Avisos" autoFocus />
                    </Form.Item>
                    <Form.Item name="semester" label="Semestre">
                        <Select placeholder="Sin semestre" options={SEMESTER_OPTIONS} allowClear />
                    </Form.Item>
                    {/* Input nativo: entrega yyyy-MM-dd, el formato que espera la API */}
                    <Form.Item name="date" label="Fecha">
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item name="categoryId" label="Categoría">
                        <Select
                            placeholder="Sin categoría"
                            allowClear
                            showSearch
                            optionFilterProp="label"
                            loading={loadingCategories}
                            options={categories.map((c) => ({ value: c.id, label: c.nameCategory }))}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
