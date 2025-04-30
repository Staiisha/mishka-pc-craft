import React, { useState } from "react";
import Select from "react-select";
import { BuildComponent, Build as BuildType } from './types';
import "@/components/AddBuildsInProgress.scss";

export interface Component {
  id: string;
  name: string;
  type: string;
  details: string;
  quantity: number;
  status?: string; 
}



interface Build {
  id: string;
  name: string;
  in_progress_price: string; 
  planned_sell_price: string | null;
  components: BuildComponent[];
}

interface AddBuildsInProgressProps {
  
  onAdd: (newBuild: BuildComponent) => void;
  onClose: () => void;
  editingBuild: BuildComponent | null;
  buildData?: any | null;
  components: Component[];
}

const AddBuildsInProgress: React.FC<AddBuildsInProgressProps> = ({
  onAdd,
  onClose,
  buildData,
  components,
}) => {
  const [formData, setFormData] = useState({
    name: buildData?.name || "",
    description: buildData?.description || "",
    in_progress_price: buildData?.in_progress_price || "",
    planned_sell_price: buildData?.planned_sell_price || "",
    components: [] as { id: string; name: string; quantity: number }[],
  });

  const componentOptions = components.map(comp => ({
    value: comp.id,
    label: `${comp.details} (${comp.type}, доступно: ${comp.quantity} шт.)`,
    maxQuantity: comp.quantity,
  }));

  console.log("Компоненты перед отправкой:", formData.components);
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
          quantity: Math.min(
            newQuantity, 
            components.find(c => c.id === id)?.quantity || 1
          ) 
        } : comp
      )
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Введите название сборки");
      return;
    }

    const newBuild: BuildComponent = {
      id: buildData?.id,
      name: formData.name,
      description: formData.description,
      components: formData.components.map(comp => ({
        quantity: comp.quantity,
        component: comp.id
      })),
      in_progress_price: formData.in_progress_price,
      planned_sell_price: formData.planned_sell_price || null,
      date: new Date().toISOString(),
    };
    
    
    
    console.log("Отправляем сборку:", newBuild);

    onAdd(newBuild);
  };

  const selectedOptions = componentOptions.filter(opt => 
    formData.components.some(c => c.id === opt.value)
  );

  return (
    <div className="modal">
      <form className="add-builds-in-progress-form" onSubmit={handleSubmit}>
        <h2>{buildData ? "Редактировать сборку" : "Добавить сборку"}</h2>

        <input
          name="name"
          placeholder="Название сборки"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Описание"
          value={formData.description}
          onChange={handleChange}
        />


        <label>Компоненты:</label>
        <Select
          isMulti
          options={componentOptions}
          value={selectedOptions}
          onChange={handleComponentChange}
          className="component-select"
          placeholder="Выберите компоненты..."
        />
     <div className="selected-components">
          {formData.components.map((comp, index) => {
            const component = components.find(c => c.id === comp.id);
            const maxQuantity = component?.quantity || 1;
            
            return (
              <div key={`${comp.id}-${index}`} className="component-quantity">
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

export default AddBuildsInProgress;