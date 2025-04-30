import { useState, useEffect } from "react";
import '../styles/Peripherals.scss';
import AddPeripheralsForm from "../components/AddPeripheralsForm"; 
import { Plus, Filter, Search, Trash, Edit } from "lucide-react";
import { fetchWithAuth } from "../api";

const typeMapping: { [key: string]: string } = {
  keyboard: "Клавиатура",
  monitor: "Монитор",
  mouse: "Мышь",
  wifi_adapter: "Wi-fi адаптер",
  carpet: "Коврик",
  image_cable: "Кабель изображения",
  power_cable: "Кабель питания",
};


const statusMapping: { [key: string]: string } = {
    in_stock: 'В наличии',
  sold: 'Продано',
  ordered: 'Заказано',
}

const Peripherals: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [sell_priceFilter, setsell_PriceFilter] = useState("");
  const [detailsFilter, setDetailsFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [selectedPeripheral, setSelectedPeripheral] = useState<string | null>(null);
  const [editingPeripheral, setEditingPeripheral] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [peripherals, setPeripherals] = useState<any[]>([]);

  useEffect(() => {
    const fetchPeripherals = async () => {
      try {
        const response = await fetchWithAuth('/api/accessories/');
        if (!response.ok) throw new Error('Ошибка загрузки сборок');
        const data = await response.json();

        setPeripherals(data.map((item: any) => ({
          id: item.id,
          details: item.details || '',
          type: item.type || '',
          status: item.status || '',
          sell_price: item.sell_price || 0,
          purchase_price: item.purchase_price || 0,
          deliveryprice: item.deliveryprice || 0,
          quantity: item.quantity || 0,
          notes: item.notes || '',
        })));
      } catch (error) {
        console.error("Ошибка загрузки сборок:", error);
      }
    };

    fetchPeripherals();
  }, []);



  const filteredPeripherals = peripherals.filter((peripheral) =>
    (peripheral.details?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) &&
    (filter ? peripheral.type === filter : true) &&
    (!statusFilter || peripheral.available === statusFilter) &&
    (sell_priceFilter ? peripheral.price <= Number(sell_priceFilter) : true) &&
    (detailsFilter ? peripheral.details?.toLowerCase().includes(detailsFilter.toLowerCase()) : true)
  );

  const handleAddPeripheral = async (newPeripheralData: any) => {
    try {
      const url = editingPeripheral
      ? `/api/accessories/${editingPeripheral.id}/`
      : "/api/accessories/";
      const method = editingPeripheral ? 'PUT' : 'POST';

      const requestBody = {
        details: newPeripheralData.details,
        status: newPeripheralData.status,
        type: newPeripheralData.type,
        sell_price: newPeripheralData.sell_price,
        purchase_price: newPeripheralData.purchase_price,
        quantity: newPeripheralData.quantity,
        notes: newPeripheralData.notes,
      
      };
    
      const response = await fetchWithAuth(url, {
        method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestBody)
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData.message || 'Неизвестная ошибка сервера';
        alert(`Ошибка: ${errorMessage}`);
        return;
      }

      const fetchUpdatedList = async () => {
        const res = await fetchWithAuth("/api/accessories/");
        const updated = await res.json();
        setPeripherals(updated);
      };
      await fetchUpdatedList();
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
      alert(
        `Ошибка соединения: ${
          error instanceof Error ? error.message : "Неизвестная ошибка"
        }`
      );
    }
  };

    
const handleDelete = async (id: string) => {
  if (window.confirm("Удалить?")) {
    try {
      console.log("Удаляем ID:", id);
      const response = await fetchWithAuth(`/api/accessories/${id}/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      console.log("Статус ответа:", response.status);


      if (response.ok) {
        setPeripherals(peripherals.filter(b => b.id !== id));
      } else {
        const contentType = response.headers.get("Content-Type");
        let errorMessage = "Неизвестная ошибка";

        try {
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } else {
            const errorText = await response.text();
            console.error("HTML-ответ сервера:", errorText);
            errorMessage = "Сервер вернул ошибку (не JSON)";
          }
        } catch (parseError) {
          console.error("Ошибка при разборе ответа:", parseError);
        }

        alert(`Ошибка при удалении: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      alert(
        `Ошибка соединения: ${
          error instanceof Error ? error.message : "Неизвестная ошибка"
        }`
      );
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
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="add-btn" onClick={() => setIsAdding(true)}>
          <Plus size={18} /> Добавить
        </button>
      </div>

      <div className="filter-container">
        <Filter className="icon" />
        <select className="filter-input" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">Выберите тип</option>
          <option value="keyboard">Клавиатура</option>
          <option value="monitor">Монитор</option>
          <option value="mouse">Мышь</option>
          <option value="wifi_adapter">Wi-fi адаптер</option>
          <option value="carpet">Коврик</option>
          <option value="image_cable">Кабель изображения</option>
          <option value="power_cable">Кабель питания</option>
        </select>
        <select className="filter-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Выберите наличие</option>
          <option value="in_stock">В наличии</option>
          <option value="ordered">Заказано</option>
          <option value="sold">Продано</option>
        </select>
        <input
          type="number"
          className="filter-input"
          placeholder="Цена продажи"
          value={sell_priceFilter}
          onChange={(e) => setsell_PriceFilter(e.target.value)}
        />
 
      </div>

      <div className="peripheral-list">
        {filteredPeripherals.map((peripheral) => (
          <div
            key={peripheral.id}
            className={`peripheral-card ${selectedPeripheral === peripheral.id ? "selected" : ""}`}
            onClick={() => setSelectedPeripheral(peripheral.id)}
          >
            <div className="title">{peripheral.details}</div>
            <div className="details">
              <span>Цена закупки: {peripheral.purchase_price} руб.</span>
              <span>Цена продажи: {peripheral.sell_price} руб.</span>
              <span>Наличие: {statusMapping[peripheral.status] || peripheral.status}</span>
              <span>Количество: {peripheral.quantity}</span>
              <span>Прибыль: {peripheral.sell_price - peripheral.purchase_price} руб.</span>
              <span>Тип: {typeMapping[peripheral.type] || peripheral.type}</span>
              <span className="notes"> Описание: {peripheral.notes}</span>
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

      {isAdding && (
        <AddPeripheralsForm
          onAdd={handleAddPeripheral}
          onClose={() => setIsAdding(false)}
          peripheralData={editingPeripheral}
        />
      )}
    </div>
  );
};

export default Peripherals;
