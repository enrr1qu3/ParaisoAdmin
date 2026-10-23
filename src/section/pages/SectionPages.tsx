import { useEffect, useState } from "react";
import { Button, Flex, Input, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { SectionList } from "../components/SectionList";
import { SectionFormModal } from "../components/SectionFormModal";
import { useSectionStore } from "../store/section.store";
import type { ISection } from "../interfaces/section.interface";

const { Title } = Typography;

export const SectionPages = () => {

    const fetchSections = useSectionStore((s) => s.sectionRequest);
    const params = useSectionStore((s) => s.params);
    const loading = useSectionStore((s) => s.loading);
    // section undefined = crear, con valor = editar
    const [modal, setModal] = useState<{ open: boolean; section?: ISection }>({ open: false });

    // Usa los últimos filtros del store: al volver del detalle se conserva búsqueda y página,
    // y de paso se refrescan los conteos de las tarjetas
    useEffect(() => {
        fetchSections(useSectionStore.getState().params);
    }, [fetchSections]);

    return (
        <Flex vertical gap="middle">
            <Flex justify="space-between" align="center" wrap gap="small">
                <Title level={2} style={{ margin: 0 }}>
                    Secciones
                </Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ open: true })}>
                    Nueva sección
                </Button>
            </Flex>
            <Input.Search
                placeholder="Buscar sección por nombre"
                allowClear
                enterButton
                loading={loading}
                defaultValue={params.search}
                style={{ maxWidth: 400 }}
                onSearch={(value) => fetchSections({ ...params, search: value.trim() || undefined, pageNumber: 1 })}
            />
            <SectionList onEdit={(section) => setModal({ open: true, section })} />
            {/* Se conserva section al cerrar para que el título no cambie durante la animación */}
            <SectionFormModal
                open={modal.open}
                section={modal.section}
                onClose={() => setModal((m) => ({ ...m, open: false }))}
            />
        </Flex>
    )
}
