import React, { useState, useEffect } from "react";
import "@/Components/AddComponentForm.scss";

interface AddPeripheralsFormProps {
  onAdd: (component: any) => void;
  onClose: () => void;
  peripheralData?: any;
}

const AddPeripheralsForm: React.FC<AddPeripheralsFormProps> = ({ onAdd, onClose, peripheralData }) => {
  const [formData, setFormData] = useState({
    details: "",
    status: "in_stock",
    purchase_price: "",
    sell_price: "",
    type: "keyboard",
    notes: "",
    keyboard: "",
    mouse: "",
    monitor: "",
    carpet: "",
    wifi_adapter: "",
    power_cable: "",
    image_cable: "",
    quantity: "",


  });

  useEffect(() => {
    if (peripheralData) {
      setFormData({
        details: peripheralData.details || "",
        quantity: peripheralData.quantity || "",
        status: peripheralData.status || "in_stock",
        sell_price: peripheralData.sell_price ? String(peripheralData.sell_price) : "",
        purchase_price: peripheralData.purchase_price? String(peripheralData.purchase_price) : "",
        type: peripheralData.type || "",
        notes: peripheralData.notes || "",
        keyboard: peripheralData.keyboard || "",
        mouse: peripheralData.mouse || "",
        monitor: peripheralData.monitor || "",
        carpet: peripheralData.kovrik || "",
        wifi_adapter: peripheralData.wifi || "",
        power_cable: peripheralData.powercable || "",
        image_cable: peripheralData. imagecable || "",
      });
    }
  }, [peripheralData]);
  
  

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ 
      ...formData,
      sell_price: Number(formData.sell_price).toFixed(2),
      quantity: Number(formData.quantity),
      purchase_price: Number(formData.purchase_price).toFixed(2),
      status: formData.status,
    });
    onClose(); 
  };
    

  return (
   <div className="modal">
  <form className="add-component-form" onSubmit={handleSubmit}>
  <h2>{peripheralData ? "Редактировать" : "Добавить периферию"}</h2>

    <input 
      name="details" 
      placeholder="Название" 
      value={formData.details} 
      onChange={handleChange} 
      required 
    />


    <input 
      name="sell_price" 
      type="number" 
      placeholder="Цена продажи" 
      value={formData.sell_price} 
      onChange={handleChange} 
      required 
    />


<input 
      name="purchase_price" 
      type="number" 
      placeholder="Цена закупки" 
      value={formData.purchase_price} 
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
      <option value="sold">Продано</option>
      <option value="ordered">Заказано</option>
    </select>

    <label htmlFor="type" className="form-label">Выберите тип: </label>
    <select className="type" name="type" value={formData.type} onChange={handleChange} required>
      <option value="keyboard">Клавиатура</option>
      <option value="monitor">Монитор</option>
      <option value="mouse">Мышь</option>
      <option value="wifi_adapter">Wi-fi адаптер</option>
      <option value="carpet">Коврик</option>
      <option value="image_cable">Кабель изображения</option>
      <option value="power_cable">Кабель питания</option>
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

export default AddPeripheralsForm;
