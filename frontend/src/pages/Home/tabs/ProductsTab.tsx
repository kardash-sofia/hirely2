import { ProductItem } from '../components/ProductItem';
import { BasicList } from '../../../common/BasicList';
import DUMMY_IMAGE from '../../../assets/img.jpg';
import { useGetProjects } from '../../Projects/hooks/useGetProjects';

export const ProductsTab = () => {
    const { data, isLoading } = useGetProjects({ limit: 10, offset: 0 });
    
    return (
        <BasicList
            items={data?.items || []}
            total={data?.total || 0}
            renderItem={(item) => <ProductItem {...item}  image={DUMMY_IMAGE} />}
            loading={isLoading}
        />
    );
};