import { Alert, Button, Flex, Popconfirm, Table, Tag, Tooltip, Typography, notification } from "antd";
import type { TableProps } from "antd";
import { DeleteOutlined, EditOutlined, FolderOutlined, TagsOutlined } from "@ant-design/icons";
import { isAxiosError } from "axios";
import { useCategoryStore } from "../store/category.store";
import type { ICategory } from "../interfaces/category.interface";

const { Text } = Typography;

type Props = {
    onEdit: (category: ICategory) => void;
};

const formatDate = (date: string | null) => date
    ? new Date(date).toLocaleDateString('es-MX', { dateStyle: 'medium' })
    : <Text type="secondary">—</Text>;

export const CategoryTable = ({ onEdit }: Props) => {
    const categories = useCategoryStore((s) => s.categories);
    const loading = useCategoryStore((s) => s.loading);
    const error = useCategoryStore((s) => s.error);
    const params = useCategoryStore((s) => s.params);
    const fetchCategories = useCategoryStore((s) => s.categoryRequest);
    const deleteCategory = useCategoryStore((s) => s.deleteCategory);
    const [api, contextHolder] = notification.useNotification();

    const onDelete = async (category: ICategory) => {
        try {
            await deleteCategory(category.id);
            api.success({ title: 'Categoría eliminada', description: `"${category.nameCategory}" se eliminó correctamente.` });
        } catch (error) {
            // 409: la API detectó subsecciones activas que la lista aún no mostraba
            const detail = isAxiosError(error) ? error.response?.data?.detail : undefined;
            api.error({ title: 'No se pudo eliminar la categoría', description: detail ?? 'Intenta de nuevo más tarde.' });
        }
    };

    const columns: TableProps<ICategory>['columns'] = [
        {
            title: 'Categoría',
            dataIndex: 'nameCategory',
            render: (name: string) => (
                <Flex align="center" gap="small">
                    <TagsOutlined style={{ color: 'var(--ant-color-primary)' }} />
                    <Text strong>{name}</Text>
                </Flex>
            ),
        },
        {
            title: 'Subsecciones',
            dataIndex: 'subSections',
            render: (subSections: ICategory['subSections']) => (
                <Tag color="blue" icon={<FolderOutlined />}>
                    {subSections.length} {subSections.length === 1 ? 'subsección' : 'subsecciones'}
                </Tag>
            ),
        },
        {
            title: 'Creada',
            dataIndex: 'createdDate',
            responsive: ['md'],
            render: formatDate,
        },
        {
            title: 'Actualizada',
            dataIndex: 'updatedDate',
            responsive: ['md'],
            render: formatDate,
        },
        {
            title: 'Acciones',
            key: 'actions',
            align: 'right',
            render: (_, category) => (
                <Flex justify="end" gap="small">
                    <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(category)}>Editar</Button>
                    {category.subSections.length > 0 ? (
                        <Tooltip title="No se puede eliminar: tiene subsecciones">
                            <Button type="text" danger icon={<DeleteOutlined />} disabled>Eliminar</Button>
                        </Tooltip>
                    ) : (
                        <Popconfirm
                            title="Eliminar categoría"
                            description={`¿Seguro que deseas eliminar "${category.nameCategory}"?`}
                            okText="Eliminar"
                            cancelText="Cancelar"
                            okButtonProps={{ danger: true }}
                            onConfirm={() => onDelete(category)}
                        >
                            <Button type="text" danger icon={<DeleteOutlined />}>Eliminar</Button>
                        </Popconfirm>
                    )}
                </Flex>
            ),
        },
    ];

    if (error) return <Alert type="error" title={error} showIcon />;

    return (
        <>
            {contextHolder}
            <Table<ICategory>
                rowKey="id"
                columns={columns}
                dataSource={categories.items}
                loading={loading}
                scroll={{ x: 'max-content' }}
                locale={{ emptyText: params.search ? `Sin resultados para "${params.search}"` : 'No hay categorías registradas' }}
                pagination={{
                    current: categories.pageNumber,
                    pageSize: categories.pageSize,
                    total: categories.totalCount,
                    showSizeChanger: true,
                    pageSizeOptions: [10, 20, 50],
                    showTotal: (total) => `${total} ${total === 1 ? 'categoría' : 'categorías'}`,
                    onChange: (pageNumber, pageSize) => fetchCategories({ ...params, pageNumber, pageSize }),
                }}
            />
        </>
    );
};
