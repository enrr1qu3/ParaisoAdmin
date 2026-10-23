import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Alert, Breadcrumb, Button, Card, Flex, Result, Skeleton, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { isAxiosError } from "axios";
import { getSectionByIdAction } from "../actions/section.actions";
import { SubSectionCollapse } from "../components/SubSectionCollapse";
import type { ISection } from "../interfaces/section.interface";

const { Title } = Typography;

export const SectionDetailPage = () => {
    const { id } = useParams();
    const sectionId = Number(id);
    const [section, setSection] = useState<ISection | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!Number.isInteger(sectionId)) {
            setNotFound(true);
            setLoading(false);
            return;
        }
        let ignore = false; // evita pintar una respuesta vieja si cambia el id antes de que llegue
        setLoading(true);
        setNotFound(false);
        setError(null);
        getSectionByIdAction(sectionId)
            .then((data) => !ignore && setSection(data))
            .catch((err) => {
                if (ignore) return;
                if (isAxiosError(err) && err.response?.status === 404) setNotFound(true);
                else setError('No se pudo cargar la sección');
            })
            .finally(() => !ignore && setLoading(false));
        return () => { ignore = true; };
    }, [sectionId]);

    // Recarga sin skeleton tras cualquier cambio en subsecciones o documentos
    const refresh = async () => {
        try {
            setSection(await getSectionByIdAction(sectionId));
            setError(null); // limpia un fallo de recarga anterior
        } catch {
            setError('No se pudo recargar la sección');
        }
    };

    if (notFound) {
        return (
            <Result
                status="404"
                title="Sección no encontrada"
                subTitle="La sección que buscas no existe o fue eliminada."
                extra={<Link to="/secciones"><Button type="primary">Volver a secciones</Button></Link>}
            />
        );
    }

    return (
        <Flex vertical gap="middle">
            <Breadcrumb
                items={[
                    { title: <Link to="/secciones">Secciones</Link> },
                    { title: section?.nameSection ?? '…' },
                ]}
            />
            <Flex align="center" gap="small">
                <Link to="/secciones">
                    <Button type="text" icon={<ArrowLeftOutlined />} aria-label="Volver a secciones" />
                </Link>
                {loading ? (
                    <Skeleton.Input active />
                ) : (
                    <Title level={2} style={{ margin: 0 }}>{section?.nameSection}</Title>
                )}
            </Flex>
            {error && <Alert type="error" title={error} showIcon />}
            {loading ? (
                <Card><Skeleton active /></Card>
            ) : (
                section && <SubSectionCollapse section={section} onChange={refresh} />
            )}
        </Flex>
    );
};
