import { useState } from "react";
import { Button, Form, InputNumber, Modal, Select, Upload, notification, type UploadFile } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { isAxiosError } from "axios";
import { createDocumentAction, updateDocumentAction } from "../actions/document.action";
import { DOCUMENT_SEMESTER_OPTIONS, MAX_DOCUMENT_SIZE_MB } from "../interfaces/document.interface";
import type { ISectionDocument } from "../interfaces/section.interface";

type FormValues = {
    numSemester?: number;
    year?: number;
    fileList?: UploadFile[];
};

type Props = {
    open: boolean;
    onClose: () => void;
    onSaved: () => void;
    subSectionId: number;
    // Si viene, el modal edita ese documento; si no, sube uno nuevo
    document?: ISectionDocument;
};

export const DocumentFormModal = ({ open, onClose, onSaved, subSectionId, document }: Props) => {
    const [form] = Form.useForm<FormValues>();
    const [api, contextHolder] = notification.useNotification();
    const [saving, setSaving] = useState(false);
    const isEdit = !!document;

    const onFinish = async ({ numSemester, year, fileList }: FormValues) => {
        setSaving(true);
        const body = { numSemester: numSemester ?? null, year: year ?? null, subSectionId, file: fileList?.[0]?.originFileObj };
        try {
            if (document) await updateDocumentAction(document.id, body);
            else await createDocumentAction(body);
            api.success({
                title: isEdit ? 'Documento actualizado' : 'Documento subido',
                description: isEdit ? 'Los cambios se guardaron correctamente.' : 'El documento se subió correctamente.',
            });
            onSaved();
            onClose();
        } catch (error) {
            const detail = isAxiosError(error) ? error.response?.data?.detail : undefined;
            api.error({
                title: isEdit ? 'No se pudo actualizar el documento' : 'No se pudo subir el documento',
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
                title={isEdit ? 'Editar documento' : 'Subir documento'}
                open={open}
                okText={isEdit ? 'Guardar' : 'Subir'}
                cancelText="Cancelar"
                confirmLoading={saving}
                onOk={form.submit}
                onCancel={onClose}
                afterClose={form.resetFields}
                destroyOnHidden
            >
                {/* destroyOnHidden remonta el Form al abrir, así initialValues toma el documento actual */}
                <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ numSemester: document?.numSemester ?? undefined, year: document?.year ?? undefined }}>
                    <Form.Item name="numSemester" label="Semestre">
                        <Select placeholder="Sin semestre" options={DOCUMENT_SEMESTER_OPTIONS} allowClear />
                    </Form.Item>
                    <Form.Item name="year" label="Año">
                        <InputNumber placeholder={`Ej. ${new Date().getFullYear()}`} min={1900} max={2100} precision={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="fileList"
                        label="Archivo"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e?.fileList}
                        extra={isEdit
                            ? `Opcional: si eliges uno, reemplaza al actual. Máximo ${MAX_DOCUMENT_SIZE_MB} MB.`
                            : `Máximo ${MAX_DOCUMENT_SIZE_MB} MB.`}
                        rules={[
                            // type 'array': sin él, una lista vaciada con la ✕ ([]) pasa como "llena"
                            { required: !isEdit, type: 'array', message: 'Selecciona un archivo' },
                            {
                                validator: (_, fileList?: UploadFile[]) =>
                                    (fileList?.[0]?.size ?? 0) > MAX_DOCUMENT_SIZE_MB * 1024 * 1024
                                        ? Promise.reject(new Error(`El archivo supera los ${MAX_DOCUMENT_SIZE_MB} MB`))
                                        : Promise.resolve(),
                            },
                        ]}
                    >
                        {/* beforeUpload false: el archivo se guarda en el form y se envía al confirmar */}
                        <Upload beforeUpload={() => false} maxCount={1}>
                            <Button icon={<UploadOutlined />}>Seleccionar archivo</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
