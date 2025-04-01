import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./AddBuildForm.scss";

interface Component {
  id: string;
  type: string;
  status: string;
  details: string;
  quantity: number;
}

interface BuildComponent {
  in_build_quantity: number;
  component_data: {
    id: string;
    details: string;
  };
}

interface Build {
  id: string;
  name: string;
  status: string;
  sell_price?: string | null;
  components: BuildComponent[];
}

interface AddBuildFormProps {
  onAdd: (build: {
    name: string;
    status: string;
    sell_price?: string;
    components: {
      quantity: number;
      component: string;
    }[];
  }) => void;
  onClose: () => void;
  components: Component[];
  buildData?: Build;
}

const AddBuildForm: React.FC<AddBuildFormProps> = ({ 
  onAdd, 
  onClose, 
  components, 
  buildData 
}) => {
  const [formData, setFormData] = useState({
    name: "",
    status: "in_stock",
    sell_price: '',
    components: [] as { id: string; name: string; quantity: number }[],
  });

  useEffect(() => {
    if (buildData) {
      setFormData({
        name: buildData.name,
        status: buildData.status,
        sell_price: buildData.sell_price || "",
        components: buildData.components.map((comp) => ({
          id: comp.component_data.id,
          name: comp.component_data.details,
          quantity: comp.in_build_quantity
        }))
      });
    }
  }, [buildData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData.name.trim()) {
      alert("Введите название сборки");
      return;
    }
  
    if (formData.components.length === 0) {
      alert("Добавьте хотя бы один компонент");
      return;
    }
  
    const buildToSend = {
      name: formData.name.trim(),
      status: formData.status,
      ...(formData.sell_price && { sell_price: formData.sell_price }),
      components: formData.components.map(comp => ({
        quantity: comp.quantity,
        component: comp.id
      }))
    };
  
    onAdd(buildToSend);
    onClose();
  };

  const componentOptions = components.map(comp => ({
    value: comp.id,
    label: `${comp.details} (${comp.type}, доступно: ${comp.quantity} шт.)`,
    maxQuantity: comp.quantity,
  }));

  const handleComponentChange = (selectedOptions: any) => {
    setFormData(prev => ({
      ...prev,
      components: selectedOptions.map((opt: any) => ({
        id: opt.value,
        name: opt.label.split(" (")[0],
        quantity: 1
      }))
    }));
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setFormData(prev => ({
      ...prev,
      components: prev.components.map(comp =>
        comp.id === id ? { 
          ...comp, 
          quantity: Math.min(newQuantity, components.find(c => c.id === id)?.quantity || 1) 
        } : comp
      )
    }));
  };

  return (
    <div className="modal">
      <form className="add-build-form" onSubmit={handleSubmit}>
        <h2>{buildData ? "Редактировать сборку" : "Добавить сборку"}</h2>

        <input 
          type="text" 
          placeholder="Название сборки"
          value={formData.name} 
          onChange={e => setFormData({ ...formData, name: e.target.value })} 
          required 
        />

<input 
          type="number" 
          placeholder="Цена продажи"
          value={formData.sell_price} 
          onChange={e => setFormData({ ...formData, sell_price: e.target.value })} 
          required 
        />

        <label>Выберите наличие: </label>
        <select 
          value={formData.status} 
          onChange={e => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="in_stock">В наличии</option>
          <option value="sold">Продано</option>
        </select>

        <label>Компоненты: </label>
        <Select
          isMulti
          options={componentOptions}
          value={componentOptions.filter(opt => 
            formData.components.some(c => c.id === opt.value)
          )}
          onChange={handleComponentChange}
          className="component-select"
          placeholder="Выберите компоненты..."
        />

        <div className="selected-components">
          {formData.components.map((comp) => {
            const component = components.find(c => c.id === comp.id);
            const maxQuantity = component?.quantity || 1;
            
            return (
              <div key={comp.id} className="component-quantity">
                <span>{comp.name}</span> 
                <input
                  type="number"
                  min="1"
                  max={maxQuantity}
                  value={comp.quantity}
                  onChange={(e) => 
                    handleQuantityChange(comp.id, parseInt(e.target.value) || 1)
                  }
                />
                <span>Макс: {maxQuantity}</span>
              </div>
            );
          })}
        </div>

        <div className="form-buttons">
          <button type="submit" className="save">
            {buildData ? "Сохранить" : "Добавить"}
          </button>
          <button type="button" className="cancel" onClick={onClose}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBuildForm;