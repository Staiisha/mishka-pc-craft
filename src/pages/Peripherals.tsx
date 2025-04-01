import { useState, useEffect } from "react";
import '../styles/Peripherals.scss';
import AddPeripheralsForm from "../components/AddPeripheralsForm"; 
import { Plus, Filter, Search, Trash, Edit } from "lucide-react";

const typeMapping: { [key: string]: string } = {
  keyboard: "Клавиатура",
  monitor: "Монитор",
  mouse: "Мышь",
  wifi: "Wi-fi адаптер",
  kovrik: "Коврик",
  imagecable: "Кабель изображения",
  powercable: "Кабель питания",
};

const Peripherals: React.FC = () => {
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [selectedPeripheral, setSelectedPeripheral] = useState<number | null>(null);
  const [editingPeripheral, setEditingPeripheral] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [peripherals, setPeripherals] = useState<any[]>([]);

  useEffect(() => {
    const savedPeripherals = localStorage.getItem("peripherals");
    if (savedPeripherals) {
      try {
        setPeripherals(JSON.parse(savedPeripherals) || []);
      } catch (error) {
        console.error("Ошибка при загрузке данных из localStorage:", error);
        setPeripherals([]);
      }
    }
  }, []);

  useEffect(() => {
    if (peripherals.length > 0) {
      localStorage.setItem("peripherals", JSON.stringify(peripherals));
    }
  }, [peripherals]);

  const filteredPeripherals = peripherals.filter((peripheral) =>
    peripheral.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filter ? peripheral.type === filter : true) &&
    (!availabilityFilter || peripheral.available === availabilityFilter) &&
    (priceFilter ? peripheral.price <= Number(priceFilter) : true) &&
    (nameFilter ? peripheral.name.toLowerCase().includes(nameFilter.toLowerCase()) : true)
  );

  const handleAddPeripheral = (newPeripheral: any) => {
    let updatedPeripherals;
    if (editingPeripheral) {
      updatedPeripherals = peripherals.map((peripheral) =>
        peripheral.id === editingPeripheral.id ? { ...peripheral, ...newPeripheral } : peripheral
      );
    } else {
      updatedPeripherals = [...peripherals, { ...newPeripheral, id: peripherals.length + 1 }];
    }
    setPeripherals(updatedPeripherals);
    localStorage.setItem("peripherals", JSON.stringify(updatedPeripherals));
    setIsAdding(false);
    setEditingPeripheral(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Удалить периферийное устройство?")) {
      const updatedPeripherals = peripherals.filter((peripheral) => peripheral.id !== id);
      setPeripherals(updatedPeripherals);
      if (updatedPeripherals.length === 0) {
        localStorage.removeItem("peripherals");
      } else {
        localStorage.setItem("peripherals", JSON.stringify(updatedPeripherals));
      }
    }
  };

  const handleEdit = (peripheral: any) => {
    setEditingPeripheral(peripheral);
    setIsAdding(true);
  };

  return (
    <div className="peripherals-page">
      <h1>Периферия</h1>
      <div className="top-bar">
        <div className="search-container">
          <Search className="icon" />
          <input type="text" placeholder="Поиск..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <button className="add-btn" onClick={() => setIsAdding(true)}>
          <Plus size={18} /> Добавить
        </button>
      </div>
      <div className="filter-container">
        <Filter className="icon" />
        <select className="filter-input" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="type">Тип</option>
          <option value="keyboard">Клавиатура</option>
          <option value="monitor">Монитор</option>
          <option value="mouse">Мышь</option>
          <option value="wifi">Wi-fi адаптер</option>
      <option value="kovrik">Коврик</option>
      <option value="imagecable">Кабель изображения</option>
      <option value="powercable">Кабель питания</option>
        </select>
        <select className="filter-input" value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)}>
          <option value="Наличие">Наличие</option>
          <option value="В наличии">В наличии</option>
          <option value="Заказано">Заказано</option>
          <option value="Нет в наличии">Нет в наличии</option>
        </select>
        <input type="number" className="filter-input" placeholder="Цена до..." value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} />
        <input type="text" className="filter-input" placeholder="Название..." value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} />
      </div>
      <div className="peripheral-list">
        {filteredPeripherals.map((peripheral) => (
          <div key={peripheral.id} className={`peripheral-card ${selectedPeripheral === peripheral.id ? "selected" : ""}`} onClick={() => setSelectedPeripheral(peripheral.id)}>
            <div className="title">{peripheral.name}</div>
            <div className="details">
              <span>Цена закупки: {peripheral.price} руб.</span>
              <span>Стоимость доставки: {peripheral.deliveryprice}  руб.</span>
              <span>Цена продажи: {peripheral.sellingprice} руб.</span>
              <span>Наличие: {peripheral.available}</span>
              <span>Количество: {peripheral.quantity} </span>
              <span>Прибыль: {peripheral.sellingprice - peripheral.price} руб.</span>
              <span>Тип: {typeMapping[peripheral.type] || peripheral.type}</span>
              <span className="note">Описание: {peripheral.note}</span>
            </div>
            <div className="actions">
              <button className="edit-btn" onClick={() => handleEdit(peripheral)}>
                <Edit size={16} />
              </button>
              <button className="delete-btn" onClick={() => handleDelete(peripheral.id)}>
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {isAdding && <AddPeripheralsForm onAdd={handleAddPeripheral} onClose={() => setIsAdding(false)} peripheralData={editingPeripheral} />}
    </div>
  );
};

export default Peripherals;
