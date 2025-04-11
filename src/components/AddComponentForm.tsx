import React, { useState, useEffect } from "react";
import "@/components/AddComponentForm.scss";

interface AddComponentFormProps {
  onAdd: (component: any) => void;
  onClose: () => void;
  componentData?: any; 
}

const AddComponentForm: React.FC<AddComponentFormProps> = ({ onAdd, onClose, componentData }) => {
  const [formData, setFormData] = useState({
    name: "",
    status: "in_stock",
    price: "",
    type: "cpu",
    notes: "",
    shippingprice: "",
    quantity: '',
  });

  useEffect(() => {
    if (componentData) {
      setFormData((prev) => ({
        ...prev,
        name: componentData.details || "",
        status: componentData.status || "in_stock",
        price: componentData.purchase_price ? String(componentData.purchase_price) : "",
        quantity: componentData.quantity ? String(componentData.quantity) : "",
        // type: componentData.type || "", 
        type: componentData.type || "cpu",
        notes: componentData.notes || "",
        shippingprice: componentData.shippingprice ? String(componentData.shippingprice) : "",
      
        
      }));
    }
  }, [componentData]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`Изменение поля: ${name}, новое значение: ${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Отправляемые данные:", formData); 
    onAdd({
      ...formData,
      price: Number(formData.price),
      shippingprice: Number(formData.shippingprice),
      quantity: Number(formData.quantity),
    });
  };
  

  return (
    <div className="modal">
      <form className="add-component-form" onSubmit={handleSubmit}>
      <h2>{componentData ? "Редактировать компонент" : "Добавить компонент"}</h2>

        <input 
          name="name" 
          placeholder="Название" 
          value={formData.name} 
          onChange={handleChange} 
          required 
        />

        <input 
          name="price" 
          type="number" 
          placeholder="Себестоимость" 
          value={formData.price || ""}
          onChange={handleChange} 
          required 
        />

        <input 
          name="shippingprice" 
          type="number"
          placeholder="Цена доставки" 
          value={formData.shippingprice} 
          onChange={handleChange}
          required  
        />

        <input 
          name="quantity" 
          type="number" 
          placeholder="Количество" 
          value={formData.quantity} 
          onChange={handleChange} 
          required 
        />

        <label htmlFor="status" className="form-label">Выберите наличие: </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="in_stock">В наличии</option>
          <option value="ordered">Заказано</option>
          <option value="planned">Запланировано</option>
        </select>

        <label htmlFor="type" className="form-label">Выберите тип: </label>
        <select className="type" name="type" value={formData.type} onChange={handleChange} required>
          <option value="cpu">Процессор</option> 
          <option value="vd">Видеокарта</option> 
          <option value="tower">Башня</option> 
          <option value="ram">Оперативная память </option> 
          <option value="case">Корпус</option> 
          <option value="psu">Блок питания</option> 
          <option value="hdd">HDD накопитель</option> 
          <option value="ssd">SSD накопитель</option> 
          <option value="motherboard">Материнская плата</option> 
          <option value="cooler">Кулер</option> 
          <option value="controller">Контроллер</option> 
          <option value="watercooler">СВО</option>
        </select>

        <textarea 
          name="notes" 
          placeholder="Описание" 
          value={formData.notes} 
          onChange={handleChange} 
        />

        <div className="form-buttons">
          <button type="submit" className="save">Добавить</button>
          <button type="button" className="cancel" onClick={onClose}>Отмена</button>
        </div>
      </form>
    </div>
  );
};

export default AddComponentForm;