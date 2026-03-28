import { ProductItem } from './ProductItem';
import { BasicList } from '../../../common/BasicList';
import DUMMY_IMAGE from '../../../assets/img.jpg';
import { useGetProjects } from '../../../hooks/useProjects';

export const ProductsTab = () => {
    const { data, isLoading } = useGetProjects();
    
    return (
        <BasicList
            items={data?.items || []}
            total={data?.total || 0}
            renderItem={(item) => <ProductItem {...item}  image={DUMMY_IMAGE} />}
            loading={isLoading}
        />
    );
};