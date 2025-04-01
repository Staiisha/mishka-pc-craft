import React from 'react';

interface ComponentData {
  id: string;
  type: string;
  details: string;
  quantity: number;
}

interface ProductCardProps {
  name: string;
  status: string;
  build_price: string | null;
  sell_price: string | null;
  profit: number;
  components: {
    in_build_quantity: number;
    component_data: ComponentData;
  }[];
  description: string;
  imageUrl: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  status,
  build_price,
  sell_price,
  profit,
  components = [],
  description,
  imageUrl
}) => {
  return (
    <div className="product-card">
      <img src={imageUrl} alt={name} className="product-image" />
      <h2 className="product-name">{name}</h2>
      
      <div className="product-info">
        <p><strong>Статус:</strong> {status}</p>
        <p><strong>Цена продажи:</strong> {sell_price ? `${sell_price} руб.` : "—"}</p>
        <p><strong>Себестоимость:</strong> {build_price ? `${build_price} руб.` : "—"}</p>
        <p><strong>Прибыль:</strong> {profit.toFixed(2)} руб.</p>
      </div>

      <div className="components-list">
        <strong>Компоненты:</strong>
        {components.length > 0 ? (
          <ul>
            {components.map((comp, index) => (
              <li key={`${comp.component_data.id}-${index}`}>
                {comp.component_data.details} (x{comp.in_build_quantity})
                <span className="component-type">{comp.component_data.type}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Нет компонентов</p>
        )}
      </div>

      <div className="product-description">
        <strong>Описание:</strong>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default ProductCard;