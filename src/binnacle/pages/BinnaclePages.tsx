import { useEffect } from "react";
import { DatePicker, Flex, Input, Typography } from "antd";
import { BinnacleTable } from "../components/BinnacleTable";
import { useBinnacleStore } from "../store/binnacle.store";

const { Title } = Typography;

export const BinnaclePages = () => {
    const fetchBinnacle = useBinnacleStore((s) => s.binnacleRequest);
    const params = useBinnacleStore((s) => s.params);
    const loading = useBinnacleStore((s) => s.loading);

    useEffect(() => {
        fetchBinnacle({ pageNumber: 1, pageSize: 10 });
    }, [fetchBinnacle]);

    return (
        <Flex vertical gap="middle">
            <Title level={2} style={{ margin: 0 }}>
                Bitácora
            </Title>
            <Flex wrap gap="small">
                <Input.Search
                    placeholder="Buscar por usuario o acción"
                    allowClear
                    enterButton
                    loading={loading}
                    style={{ maxWidth: 400 }}
                    onSearch={(value) => fetchBinnacle({ ...params, search: value.trim() || undefined, pageNumber: 1 })}
                />
                <DatePicker.RangePicker
                    placeholder={['Desde', 'Hasta']}
                    // Días completos en hora local; toISOString los pasa a UTC como espera la API
                    onChange={(dates) => fetchBinnacle({
                        ...params,
                        dateFrom: dates?.[0]?.startOf('day').toISOString(),
                        dateTo: dates?.[1]?.endOf('day').toISOString(),
                        pageNumber: 1,
                    })}
                />
            </Flex>
            <BinnacleTable />
        </Flex>
    );
};
