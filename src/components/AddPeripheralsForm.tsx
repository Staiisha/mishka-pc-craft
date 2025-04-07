import React, { useState, useEffect } from "react";
import "@/Components/AddComponentForm.scss";

interface AddPeripheralsFormProps {
  onAdd: (component: any) => void;
  onClose: () => void;
  peripheralData?: any;
}

const AddPeripheralsForm: React.FC<AddPeripheralsFormProps> = ({ onAdd, onClose, peripheralData }) => {
  const [formData, setFormData] = useState({
    name: "",
    available: "",
    sellingprice: "",
    price: "",
    deliveryprice: '',
    manufacturer: "",
    type: "",
    note: "",
    keyboard: "",
    mouse: "",
    monitor: "",
    kovrik: "",
    wifi: "",
    powercable: "",
    imagecable: "",
    quantity: "",


  });

  useEffect(() => {
    if (peripheralData) {
      setFormData({
        name: peripheralData.name || "",
        quantity: peripheralData.quantity || "",
        deliveryprice: peripheralData.deliveryprice ? String(peripheralData.deliveryprice) : "",
        available: peripheralData.available || "",
        price: peripheralData.price ? String(peripheralData.price) : "",
        sellingprice: peripheralData.sellingprice ? String(peripheralData.sellingprice) : "",
        manufacturer: peripheralData.manufacturer || "",
        type: peripheralData.type || "",
        note: peripheralData.note || "",
        keyboard: peripheralData.keyboard || "",
        mouse: peripheralData.mouse || "",
        monitor: peripheralData.monitor || "",
        kovrik: peripheralData.kovrik || "",
        wifi: peripheralData.wifi || "",
        powercable: peripheralData.powercable || "",
        imagecable: peripheralData. imagecable || "",
      });
    }
  }, [peripheralData]);
  
  

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ ...formData, price: Number(formData.price),quantity: Number(formData.quantity), sellingprice: Number(formData.sellingprice), deliveryprice: Number(formData.deliveryprice), available: formData.available, });
  };

  return (
   <div className="modal">
  <form className="add-component-form" onSubmit={handleSubmit}>
  <h2>{peripheralData ? "Редактировать" : "Добавить периферию"}</h2>

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
      value={formData.price} 
      onChange={handleChange} 
      required 
    />

    
<input 
      name="deliveryprice" 
      type="number" 
      placeholder="Стоимость доставки" 
      value={formData.deliveryprice} 
      onChange={handleChange} 
      required 
    />

<input 
      name="sellingprice" 
      type="number" 
      placeholder="Цена продажи" 
      value={formData.sellingprice} 
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

<label htmlFor="available" className="form-label">Выберите наличие: </label>
        <select
          id="available"
          name="available"
          value={formData.available}
          onChange={handleChange}
          required
        >
      <option value="В наличии">В наличии</option>
      <option value="Нет в наличии">Нет в наличии</option>
      <option value="Заказано">Заказано</option>
    </select>

    <label htmlFor="type" className="form-label">Выберите тип: </label>
    <select className="type" name="type" value={formData.type} onChange={handleChange} required>
      <option value="keyboard">Клавиатура</option>
      <option value="monitor">Монитор</option>
      <option value="mouse">Мышь</option>
      <option value="wifi">Wi-fi адаптер</option>
      <option value="kovrik">Коврик</option>
      <option value="imagecable">Кабель изображения</option>
      <option value="powercable">Кабель питания</option>
    </select>

    <textarea 
          name="note" 
          placeholder="Описание" 
          value={formData.note} 
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
