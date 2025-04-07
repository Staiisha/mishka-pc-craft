import React, { useState } from "react";
import Select from "react-select";
import { BuildComponent } from "./types";
import "@/components/AddBuildsInProgress.scss";

interface AddBuildsInProgressProps {
  onAdd: (newBuild: BuildComponent) => void;
  onClose: () => void;
  buildData?: BuildComponent | null;
  components: any[]; // Список доступных компонентов
}

const AddBuildsInProgress: React.FC<AddBuildsInProgressProps> = ({ onAdd, onClose, buildData, components }) => {
  const [formData, setFormData] = useState<BuildComponent>({
    id: buildData?.id || undefined,
    name: buildData?.name || "",
    available: buildData?.available || "",
    sellingprice: String(buildData?.sellingprice) || "",
    price: buildData?.price || 0,
    costprice: String(buildData?.costprice) || "",
    manufacturer: buildData?.manufacturer || "",
    type: buildData?.type || "",
    note: buildData?.note || "",
    description: buildData?.description || "",
    components: buildData?.components || [],
  });

  const [selectedComponents, setSelectedComponents] = useState<any[]>(formData.components || []);

  const componentOptions = components.map((comp) => ({
    value: comp.id,
    label: comp.name,
  }));

  const handleComponentChange = (selectedOptions: any) => {
    setSelectedComponents(selectedOptions);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      components: selectedComponents.map((opt) => opt.value),
    });
  };

  return (
    <div className="modal">
      <form className="add-builds-in-progress-form" onSubmit={handleSubmit}>
        <h2>{buildData ? "Редактировать сборку" : "Добавить сборку"}</h2>

        <input name="name" placeholder="Название" value={formData.name} onChange={handleChange} required />

        <input name="sellingprice" type="number" placeholder="Цена продажи" value={formData.sellingprice} onChange={handleChange} required />

        <input name="costprice" type="number" placeholder="Себестоимость" value={formData.costprice} onChange={handleChange} required />

        <textarea name="description" placeholder="Описание" value={formData.description} onChange={handleChange} />

        <label>Компоненты:</label>
        <Select isMulti options={componentOptions} value={selectedComponents} onChange={handleComponentChange} placeholder="Выберите компоненты..."  className="component-select" />

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
