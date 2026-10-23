import { useState } from "react";
import { Button, Collapse, Empty, Flex, Input, Listy, Popconfirm, Tag, Tooltip, Typography, notification } from "antd";
import { CalendarOutlined, DeleteOutlined, EditOutlined, EyeOutlined, FileTextOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { isAxiosError } from "axios";
import { deleteSubSectionAction } from "../actions/subSection.action";
import { deleteDocumentAction } from "../actions/document.action";
import { DocumentFormModal } from "./DocumentFormModal";
import { SEMESTER_OPTIONS } from "../interfaces/subSection.interface";
import { SubSectionFormModal } from "./SubSectionFormModal";
import type { ISection, ISectionDocument, ISubSection } from "../interfaces/section.interface";

const { Text } = Typography;

// Nombre legible del archivo a partir de su URL (sin query string)
const fileName = (doc: ISectionDocument) => {
    const name = doc.filePathUrl.split('?')[0].split('/').pop() || `Documento ${doc.id}`;
    try {
        return decodeURIComponent(name);
    } catch {
        return name; // un "%" mal codificado lanza URIError y tumbaría la página
    }
};

// updatedDate es null si nunca se ha editado; new Date(null) daría 31/12/1969
const lastChange = (doc: ISectionDocument) => {
    const date = doc.updatedDate ?? doc.createdDate;
    return date && new Date(date).toLocaleDateString();
};

type Props = {
    section: ISection;
    // Se llama tras cualquier alta/edición/baja para recargar la sección
    onChange: () => void | Promise<void>;
};

export const SubSectionCollapse = ({ section, onChange }: Props) => {
    const [search, setSearch] = useState('');
    // subSection undefined = crear, con valor = editar
    const [modal, setModal] = useState<{ open: boolean; subSection?: ISubSection }>({ open: false });
    // document undefined = subir, con valor = editar
    const [docModal, setDocModal] = useState<{ open: boolean; subSectionId?: number; document?: ISectionDocument }>({ open: false });
    const [api, contextHolder] = notification.useNotification();

    const onDelete = async (sub: ISubSection) => {
        try {
            await deleteSubSectionAction(sub.id);
            api.success({ title: 'Subsección eliminada', description: `"${sub.nameSubSection}" se eliminó correctamente.` });
            await onChange();
        } catch (error) {
            // 409: la API detectó documentos activos que la página aún no mostraba
            const detail = isAxiosError(error) ? error.response?.data?.detail : undefined;
            api.error({ title: 'No se pudo eliminar la subsección', description: detail ?? 'Intenta de nuevo más tarde.' });
        }
    };

    const onDeleteDocument = async (doc: ISectionDocument) => {
        try {
            await deleteDocumentAction(doc.id);
            api.success({ title: 'Documento eliminado', description: `"${fileName(doc)}" se eliminó correctamente.` });
            await onChange();
        } catch (error) {
            const detail = isAxiosError(error) ? error.response?.data?.detail : undefined;
            api.error({ title: 'No se pudo eliminar el documento', description: detail ?? 'Intenta de nuevo más tarde.' });
        }
    };

    const subSections = section.subSections.filter((sub) =>
        sub.nameSubSection.toLowerCase().includes(search.trim().toLowerCase())
    );

    const items = subSections.map((sub) => ({
        key: sub.id,
        label: (
            <Flex vertical gap={4}>
                <Text strong>{sub.nameSubSection}</Text>
                <Flex wrap gap={4}>
                    {sub.semester != null && (
                        <Tag color="blue">{SEMESTER_OPTIONS.find((o) => o.value === sub.semester)?.label ?? sub.semester}</Tag>
                    )}
                    {sub.date && <Tag icon={<CalendarOutlined />}>{sub.date}</Tag>}
                    <Tag color="green" icon={<FileTextOutlined />}>
                        {sub.documents.length} {sub.documents.length === 1 ? 'documento' : 'documentos'}
                    </Tag>
                </Flex>
            </Flex>
        ),
        // stopPropagation: que los botones no expandan/colapsen el panel
        extra: (
            <Flex gap={4} onClick={(e) => e.stopPropagation()}>
                <Tooltip title="Editar">
                    <Button type="text" icon={<EditOutlined />} onClick={() => setModal({ open: true, subSection: sub })} />
                </Tooltip>
                {sub.documents.length > 0 ? (
                    <Tooltip title="No se puede eliminar: tiene documentos">
                        <Button type="text" danger icon={<DeleteOutlined />} disabled />
                    </Tooltip>
                ) : (
                    <Popconfirm
                        title="Eliminar subsección"
                        description={`¿Seguro que deseas eliminar "${sub.nameSubSection}"?`}
                        okText="Eliminar"
                        cancelText="Cancelar"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => onDelete(sub)}
                    >
                        <Tooltip title="Eliminar">
                            <Button type="text" danger icon={<DeleteOutlined />} />
                        </Tooltip>
                    </Popconfirm>
                )}
            </Flex>
        ),
        children: (
            <Flex vertical gap="small">
                {sub.documents.length === 0 ? (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sin documentos" />
                ) : (
                    <Listy
                        items={sub.documents}
                        rowKey="id"
                        itemRender={(doc) => (
                            // wrap: en pantallas angostas las acciones bajan de línea en vez de aplastar el nombre.
                            // Listy ya pone separador y relleno por item
                            <Flex wrap align="center" gap="small">
                                <Flex align="center" gap="small" style={{ flex: '1 1 220px', minWidth: 0 }}>
                                    <FileTextOutlined style={{ fontSize: 20, color: 'var(--ant-color-primary)' }} />
                                    <Flex vertical style={{ minWidth: 0 }}>
                                        <Text strong ellipsis={{ tooltip: fileName(doc) }} style={{ maxWidth: '100%' }}>{fileName(doc)}</Text>
                                        <Text type="secondary">
                                            {[
                                                doc.numSemester != null ? `Semestre ${doc.numSemester}` : 'Sin semestre',
                                                doc.year != null && `Año ${doc.year}`,
                                                lastChange(doc),
                                            ].filter(Boolean).join(' · ')}
                                        </Text>
                                    </Flex>
                                </Flex>
                                <Flex gap={4} style={{ marginLeft: 'auto' }}>
                                    <Tooltip title="Ver">
                                        <Button type="text" icon={<EyeOutlined />} href={doc.filePathUrl} target="_blank" rel="noopener noreferrer" />
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <Button type="text" icon={<EditOutlined />} onClick={() => setDocModal({ open: true, subSectionId: sub.id, document: doc })} />
                                    </Tooltip>
                                    <Popconfirm
                                        title="Eliminar documento"
                                        description={`¿Seguro que deseas eliminar "${fileName(doc)}"?`}
                                        okText="Eliminar"
                                        cancelText="Cancelar"
                                        okButtonProps={{ danger: true }}
                                        onConfirm={() => onDeleteDocument(doc)}
                                    >
                                        <Tooltip title="Eliminar">
                                            <Button type="text" danger icon={<DeleteOutlined />} />
                                        </Tooltip>
                                    </Popconfirm>
                                </Flex>
                            </Flex>
                        )}
                    />
                )}
                <Button type="dashed" block icon={<UploadOutlined />} onClick={() => setDocModal({ open: true, subSectionId: sub.id })}>
                    Subir documento
                </Button>
            </Flex>
        ),
    }));

    return (
        <Flex vertical gap="middle">
            {contextHolder}
            <Flex justify="space-between" align="center" wrap gap="small">
                <Input.Search
                    placeholder="Buscar subsección"
                    allowClear
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ maxWidth: 400 }}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ open: true })}>
                    Nueva subsección
                </Button>
            </Flex>
            {items.length > 0 ? (
                <Collapse items={items} />
            ) : (
                <Empty description={search ? `Sin resultados para "${search}"` : 'Esta sección no tiene subsecciones'} />
            )}
            <SubSectionFormModal
                open={modal.open}
                sectionId={section.id}
                subSection={modal.subSection}
                onSaved={onChange}
                onClose={() => setModal((m) => ({ ...m, open: false }))}
            />
            {docModal.subSectionId !== undefined && (
                <DocumentFormModal
                    open={docModal.open}
                    subSectionId={docModal.subSectionId}
                    document={docModal.document}
                    onSaved={onChange}
                    onClose={() => setDocModal((m) => ({ ...m, open: false }))}
                />
            )}
        </Flex>
    );
};
