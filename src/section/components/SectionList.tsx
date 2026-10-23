import { Alert, Button, Card, Col, Empty, Flex, Pagination, Popconfirm, Row, Tag, Tooltip, Typography, notification } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, FileTextOutlined, FolderOutlined } from "@ant-design/icons";
import { isAxiosError } from "axios";
import { Link } from "react-router";
import { useSectionStore } from "../store/section.store";
import type { ISection } from "../interfaces/section.interface";

const { Text } = Typography;

type Props = {
    onEdit: (section: ISection) => void;
};

export const SectionList = ({ onEdit }: Props) => {
    const sections = useSectionStore((s) => s.sections);
    const loading = useSectionStore((s) => s.loading);
    const error = useSectionStore((s) => s.error);
    const fetchSections = useSectionStore((s) => s.sectionRequest);
    const params = useSectionStore((s) => s.params);
    const deleteSection = useSectionStore((s) => s.deleteSection);
    const [api, contextHolder] = notification.useNotification();

    const onDelete = async (section: ISection) => {
        try {
            await deleteSection(section.id);
            api.success({ title: 'Sección eliminada', description: `"${section.nameSection}" se eliminó correctamente.` });
        } catch (error) {
            // 409: la API detectó subsecciones activas que la lista aún no mostraba
            const detail = isAxiosError(error) ? error.response?.data?.detail : undefined;
            api.error({ title: 'No se pudo eliminar la sección', description: detail ?? 'Intenta de nuevo más tarde.' });
        }
    };

    const renderContent = () => {
        if (error) return <Alert type="error" title={error} showIcon />;

        if (!loading && sections.items.length === 0) {
            return <Empty description={params.search ? `Sin resultados para "${params.search}"` : 'No hay secciones registradas'} />;
        }

        if (loading && sections.items.length === 0) {
            return (
                <Row gutter={[16, 16]}>
                    {Array.from({ length: 4 }, (_, i) => (
                        <Col key={i} xs={24} sm={12} lg={8} xxl={6}><Card loading /></Col>
                    ))}
                </Row>
            );
        }

        return (
            <Flex vertical gap="large">
                <Row gutter={[16, 16]}>
                    {sections.items.map((section) => {
                        const documentCount = section.subSections.reduce((total, sub) => total + sub.documents.length, 0);
                        // Los documentos cuelgan de subsecciones, así que basta con revisar las subsecciones
                        const hasContent = section.subSections.length > 0;
                        // updatedDate es null si nunca se ha editado; new Date(null) daría 31/12/1969
                        const lastChange = section.updatedDate ?? section.createdDate;
                        return (
                            <Col key={section.id} xs={24} sm={12} lg={8} xxl={6}>
                                <Card
                                    hoverable
                                    loading={loading}
                                    style={{ height: '100%' }}
                                    actions={[
                                        <Link key="view" to={`/secciones/${section.id}`}>
                                            <Button type="text" icon={<EyeOutlined />}>Ver</Button>
                                        </Link>,
                                        <Button key="edit" type="text" icon={<EditOutlined />} onClick={() => onEdit(section)}>Editar</Button>,
                                        hasContent ? (
                                            <Tooltip key="delete" title="No se puede eliminar: tiene subsecciones o documentos">
                                                <Button type="text" danger icon={<DeleteOutlined />} disabled>Eliminar</Button>
                                            </Tooltip>
                                        ) : (
                                            <Popconfirm
                                                key="delete"
                                                title="Eliminar sección"
                                                description={`¿Seguro que deseas eliminar "${section.nameSection}"?`}
                                                okText="Eliminar"
                                                cancelText="Cancelar"
                                                okButtonProps={{ danger: true }}
                                                onConfirm={() => onDelete(section)}
                                            >
                                                <Button type="text" danger icon={<DeleteOutlined />}>Eliminar</Button>
                                            </Popconfirm>
                                        ),
                                    ]}
                                >
                                    {/* Solo la parte superior navega; las acciones de abajo quedan fuera del enlace */}
                                    <Link to={`/secciones/${section.id}`} style={{ color: 'inherit', display: 'block' }}>
                                        <Card.Meta
                                            avatar={<FolderOutlined style={{ fontSize: 28, color: 'var(--ant-color-primary)' }} />}
                                            title={section.nameSection}
                                            description={
                                                <Flex vertical gap="small">
                                                    <Flex wrap gap="small">
                                                        <Tag color="blue" icon={<FolderOutlined />}>
                                                            {section.subSections.length} {section.subSections.length === 1 ? 'subsección' : 'subsecciones'}
                                                        </Tag>
                                                        <Tag color="green" icon={<FileTextOutlined />}>
                                                            {documentCount} {documentCount === 1 ? 'documento' : 'documentos'}
                                                        </Tag>
                                                    </Flex>
                                                    <Text type="secondary">
                                                        {lastChange ? `Actualizado ${new Date(lastChange).toLocaleDateString()}` : 'Sin fecha'}
                                                    </Text>
                                                </Flex>
                                            }
                                        />
                                    </Link>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
                <Pagination
                    align="center"
                    current={sections.pageNumber}
                    pageSize={sections.pageSize}
                    total={sections.totalCount}
                    pageSizeOptions={[8, 12, 24]}
                    showSizeChanger
                    onChange={(pageNumber, pageSize) => fetchSections({ ...params, pageNumber, pageSize })}
                />
            </Flex>
        );
    };

    return (
        <>
            {contextHolder}
            {renderContent()}
        </>
    );
}
