import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import myImage from '../images/1.png';
import '@/styles/ReadyBuilds.scss';
import { Plus, Filter, Search, Trash, Edit } from "lucide-react";
import AddBuildForm from '../components/AddBuildForm';
import { fetchWithAuth } from "../api";

interface Component {
  id: string;
  type: string;
  status: string;
  details: string;
  quantity: number;
  purchase_price?: string;
  delivery_price?: string;
}

interface Build {
  id: string;
  name: string;
  status: string;

  components: {
    in_build_quantity: number;
    component_data: Component;
  }[];
  build_price: string | null;
  sell_price: string | null;
  build_date?: string | null;
  sell_date?: string | null;
  description?: string;
}

const ReadyBuilds: React.FC = () => {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingBuild, setEditingBuild] = useState<Build | undefined>(undefined); 
  const [searchQuery, setSearchQuery] = useState('');
  const [sell_priceFilter, setSell_priceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Загрузка сборок
  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        const response = await  fetchWithAuth('/api/ready_builds');
        console.log('Response status:', response.status);
        if (!response.ok) throw new Error('Ошибка загрузки сборок');
        const data = await response.json();
        console.log('Data:', data); 
        
        setBuilds(data.map((item: any) => ({
          id: item.id,
          name: item.name,
          status: item.status,
          sell_price: item.sell_price,
          build_price: item.build_price,
          components: item.components.map((comp: any) => ({
            in_build_quantity: comp.in_build_quantity,
            component_data: comp.component_data
          })),
          build_date: item.build_date,
          sell_date: item.sell_date,
          description: item.description
        })));
      } catch (error) {
        console.error("Ошибка загрузки сборок:", error);
      }
    };
    fetchBuilds();
  }, []);

  // Загрузка компонентов
  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await fetchWithAuth('/api/components');
        if (!response.ok) throw new Error('Ошибка загрузки компонентов');
        const data = await response.json();
        
        setComponents(data.map((comp: any) => ({
          id: comp.id,
          type: comp.type,
          status: comp.status,
          details: comp.details,
          quantity: comp.quantity
        })));
      } catch (error) {
        console.error("Ошибка загрузки компонентов:", error);
      }
    };
    fetchComponents();
  }, []);

  // Фильтрация сборок
  const filteredBuilds = builds.filter(build => {
    const matchesSearch = build.name.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPrice = !sell_priceFilter || 
      (build.sell_price && parseFloat(build.sell_price) <= parseFloat(sell_priceFilter));
    const matchesStatus = !statusFilter || build.status === statusFilter;
    
    return matchesSearch && matchesPrice && matchesStatus;
  });

  // Удаление сборки
  const handleDelete = async (id: string) => {
    if (window.confirm("Удалить сборку?")) {
      try {
        const response = await fetchWithAuth(`/api/ready_builds/${id}/`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
  
        if (response.ok) {
          setBuilds(builds.filter(b => b.id !== id));
        } else {
          const errorData = await response.json();
          console.error("Ошибка сервера:", errorData);
          alert(`Ошибка при удалении: ${errorData.message || "Неизвестная ошибка"}`);
        }
      } catch (error) {
        console.error("Ошибка при удалении:", error);
      }
    }
  };
  

  // Редактирование сборки
  const handleEdit = (build: Build) => {
    setEditingBuild(build);
    setIsAdding(true);
  };

 // Добавление/обновление сборки
const handleAddOrUpdate = async (newBuildData: any) => {
  try {
    const url = editingBuild 
      ? `/api/ready_builds/${editingBuild.id}/`
      : "/api/ready_builds/";
    const method = editingBuild ? "PUT" : "POST";

    const requestBody = {
      name: newBuildData.name,
      status: newBuildData.status,
      sell_price: newBuildData.sell_price,
      components: newBuildData.components.map((comp: any) => ({
        in_build_quantity: comp.quantity,
        component: comp.component,  
      })),
    };
    


    const response = await fetchWithAuth(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.text();

    if (response.ok) {
      const savedBuild = JSON.parse(responseData);

      setBuilds(prev => {
        if (editingBuild) {
          return prev.map(b => b.id === savedBuild.id
            ? { ...savedBuild, components: savedBuild.components || [] }
            : b
          );
        } else {
          return [...prev, { ...savedBuild, components: savedBuild.components || [] }];
        }
      });

      setIsAdding(false);
      setEditingBuild(undefined);
    } else {
      try {
        const errorData = JSON.parse(responseData);
        alert(`Ошибка: ${errorData.message || "Неизвестная ошибка сервера"}`);
      } catch {
        alert(`Ошибка ${response.status}: ${responseData}`);
      }
    }
  } catch (error) {
    console.error("Ошибка при сохранении:", error);
    alert(`Ошибка соединения: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`);
  }
};

  
  // Расчет прибыли для сборки
  const calculateProfit = (build: Build) => {
    if (!build.sell_price || !build.build_price) return 0;
    return parseFloat(build.sell_price) - parseFloat(build.build_price);
  };

  return (
    <div className='ready-builds-page'>
      <h1>Готовые сборки</h1>

      <div className="top-bar">
        <div className="search-container">
          <Search className="icon" />
          <input 
            type="text" 
            placeholder="Поиск..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
          />
        </div>
        <button className="add-btn" onClick={() => setIsAdding(true)}>
          <Plus size={18} /> Добавить
        </button>
      </div>

      <div className="filter-container">
        <Filter className="icon" />
        <input 
          type="number" 
          className="filter-input" 
          placeholder="Макс цена продажи" 
          value={sell_priceFilter} 
          onChange={e => setSell_priceFilter(e.target.value)} 
        />
        <select 
          className="filter-input" 
          value={statusFilter} 
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">Все статусы</option>
          <option value="in_stock">В наличии</option>
          <option value="sold">Продано</option>
        </select>
      </div>

      <div className="builds-list">
        {filteredBuilds.map((build) => (
          <div key={build.id} className="build-card">
            <ProductCard
              name={build.name}
              status={build.status === 'in_stock' ? 'В наличии' : 'Продано'}
              build_price={build.build_price}
              sell_price={build.sell_price}
              profit={calculateProfit(build)}
              components={build.components}
              imageUrl={myImage}
            />
            <div className="actions">
              <button className="edit-btn" onClick={() => handleEdit(build)}>
                <Edit size={16} />
              </button>
              <button className="delete-btn" onClick={() => handleDelete(build.id)}>
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <AddBuildForm
          onAdd={handleAddOrUpdate}
          onClose={() => {
            setIsAdding(false);
            setEditingBuild(undefined);
          }}
          components={components}
          buildData={editingBuild}
        />
      )}
    </div>
  );
};

export default ReadyBuilds;