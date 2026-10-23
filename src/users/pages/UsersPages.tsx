import { useEffect, useState } from "react";
import { Button, Flex, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { UsersTable } from "../components/UsersTable";
import { UserFormModal } from "../components/UserFormModal";
import { useUsersStore } from "../store/users.store";

const { Title } = Typography;

export const UsersPages = () => {
    const fetchUsers = useUsersStore((s) => s.usersRequest);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        fetchUsers({ pageNumber: 1, pageSize: 10 });
    }, [fetchUsers]);

    return (
        <Flex vertical gap="middle">
            <Flex justify="space-between" align="center" wrap gap="small">
                <Title level={2} style={{ margin: 0 }}>
                    Usuarios
                </Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
                    Nuevo usuario
                </Button>
            </Flex>
            <UsersTable />
            <UserFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </Flex>
    );
};
