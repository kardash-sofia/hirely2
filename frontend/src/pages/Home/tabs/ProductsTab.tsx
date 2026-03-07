import { ProductItem } from './ProductItem';
import { BasicList } from '../../../common/BasicList';
import DUMMY_IMAGE from '../../../assets/img.jpg';
import { useProjects } from '../../../hooks/useProjects';

export const ProductsTab = () => {
    const { data, isLoading } = useProjects();
    
    return (
        <BasicList
            items={data?.items || []}
            renderItem={(item) => <ProductItem {...item} image={DUMMY_IMAGE} />}
            loading={isLoading}
        />
    );
};