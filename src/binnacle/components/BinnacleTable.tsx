import { Alert, Avatar, Flex, Table, Typography } from "antd";
import type { TableProps } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useBinnacleStore } from "../store/binnacle.store";
import type { IBinnacle } from "../interfaces/binnacle.interface";

const { Text } = Typography;

const columns: TableProps<IBinnacle>['columns'] = [
    {
        title: 'Fecha',
        dataIndex: 'createdDate',
        width: 200,
        render: (date: string | null) => date
            ? new Date(date).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })
            : <Text type="secondary">—</Text>,
    },
    {
        title: 'Usuario',
        dataIndex: 'nameUser',
        render: (name: string) => (
            <Flex align="center" gap="small" style={{ whiteSpace: 'nowrap' }}>
                <Avatar size="small" icon={<UserOutlined />} />
                <Text strong>{name}</Text>
            </Flex>
        ),
    },
    {
        title: 'Acción',
        dataIndex: 'nameTask',
    },
];

export const BinnacleTable = () => {
    const binnacle = useBinnacleStore((s) => s.binnacle);
    const loading = useBinnacleStore((s) => s.loading);
    const error = useBinnacleStore((s) => s.error);
    const params = useBinnacleStore((s) => s.params);
    const fetchBinnacle = useBinnacleStore((s) => s.binnacleRequest);

    if (error) return <Alert type="error" title={error} showIcon />;

    const filtered = params.search || params.dateFrom;

    return (
        <Table<IBinnacle>
            rowKey="id"
            columns={columns}
            dataSource={binnacle.items}
            loading={loading}
            // x fijo (no max-content): en escritorio la acción larga se parte en líneas; en móvil hay scroll
            scroll={{ x: 720 }}
            locale={{ emptyText: filtered ? 'Sin registros para estos filtros' : 'No hay registros en la bitácora' }}
            pagination={{
                current: binnacle.pageNumber,
                pageSize: binnacle.pageSize,
                total: binnacle.totalCount,
                showSizeChanger: true,
                pageSizeOptions: [10, 20, 50],
                showTotal: (total) => `${total} ${total === 1 ? 'registro' : 'registros'}`,
                onChange: (pageNumber, pageSize) => fetchBinnacle({ ...params, pageNumber, pageSize }),
            }}
        />
    );
};
