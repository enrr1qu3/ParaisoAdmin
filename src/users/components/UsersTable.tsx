import { Alert, Avatar, Flex, Table, Tag, Typography } from "antd";
import type { TableProps } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useUsersStore } from "../store/users.store";
import type { User } from "../../interfaces/user.interface";

const { Text } = Typography;

const columns: TableProps<User>['columns'] = [
    {
        title: 'Usuario',
        key: 'user',
        render: (_, user) => (
            <Flex align="center" gap="middle">
                <Avatar src={user.photoUrl} icon={<UserOutlined />} />
                <Flex vertical>
                    <Text strong>{[user.firstName, user.paternalLastName, user.maternalLastName].filter(Boolean).join(' ')}</Text>
                    <Text type="secondary">{user.email}</Text>
                </Flex>
            </Flex>
        ),
    },
    {
        title: 'Teléfono',
        dataIndex: 'phoneNumber',
        responsive: ['md'],
        render: (phone: string | null) => phone ?? <Text type="secondary">—</Text>,
    },
    {
        title: 'Estado',
        dataIndex: 'isBlocked',
        render: (isBlocked: boolean) => isBlocked ? <Tag color="error">Bloqueado</Tag> : <Tag color="success">Activo</Tag>,
    },
];

export const UsersTable = () => {
    const users = useUsersStore((s) => s.users);
    const loading = useUsersStore((s) => s.loading);
    const error = useUsersStore((s) => s.error);
    const params = useUsersStore((s) => s.params);
    const fetchUsers = useUsersStore((s) => s.usersRequest);

    if (error) return <Alert type="error" title={error} showIcon />;

    return (
        <Table<User>
            rowKey="id"
            columns={columns}
            dataSource={users.items}
            loading={loading}
            scroll={{ x: 'max-content' }}
            locale={{ emptyText: 'No hay usuarios registrados' }}
            pagination={{
                current: users.pageNumber,
                pageSize: users.pageSize,
                total: users.totalCount,
                showSizeChanger: true,
                pageSizeOptions: [10, 20, 50],
                showTotal: (total) => `${total} ${total === 1 ? 'usuario' : 'usuarios'}`,
                onChange: (pageNumber, pageSize) => fetchUsers({ ...params, pageNumber, pageSize }),
            }}
        />
    );
};
