import { useEffect, useState } from "react";
import { Button, Flex, Input, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { CategoryTable } from "../components/CategoryTable";
import { CategoryFormModal } from "../components/CategoryFormModal";
import { useCategoryStore } from "../store/category.store";
import type { ICategory } from "../interfaces/category.interface";

const { Title } = Typography;

export const CategoryPages = () => {
    const fetchCategories = useCategoryStore((s) => s.categoryRequest);
    const params = useCategoryStore((s) => s.params);
    const loading = useCategoryStore((s) => s.loading);
    // category undefined = crear, con valor = editar
    const [modal, setModal] = useState<{ open: boolean; category?: ICategory }>({ open: false });

    useEffect(() => {
        fetchCategories({ pageNumber: 1, pageSize: 10 });
    }, [fetchCategories]);

    return (
        <Flex vertical gap="middle">
            <Flex justify="space-between" align="center" wrap gap="small">
                <Title level={2} style={{ margin: 0 }}>
                    Categorías
                </Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ open: true })}>
                    Nueva categoría
                </Button>
            </Flex>
            <Input.Search
                placeholder="Buscar categoría por nombre"
                allowClear
                enterButton
                loading={loading}
                style={{ maxWidth: 400 }}
                onSearch={(value) => fetchCategories({ ...params, search: value.trim() || undefined, pageNumber: 1 })}
            />
            <CategoryTable onEdit={(category) => setModal({ open: true, category })} />
            {/* Se conserva category al cerrar para que el título no cambie durante la animación */}
            <CategoryFormModal
                open={modal.open}
                category={modal.category}
                onClose={() => setModal((m) => ({ ...m, open: false }))}
            />
        </Flex>
    );
};
