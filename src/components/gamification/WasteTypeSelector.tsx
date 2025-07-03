import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface WasteType {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export const wasteTypes: WasteType[] = [
  {
    id: 'plastic_bottle',
    name: 'Bouteille plastique',
    icon: '🍼',
    color: 'bg-blue-100 text-blue-800',
    description: 'Bouteilles d\'eau, sodas, etc.'
  },
  {
    id: 'cigarette_butt',
    name: 'Mégot de cigarette',
    icon: '🚬',
    color: 'bg-orange-100 text-orange-800',
    description: 'Mégots et filtres'
  },
  {
    id: 'food_packaging',
    name: 'Emballage alimentaire',
    icon: '🥡',
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Sachets, boîtes, contenants'
  },
  {
    id: 'glass',
    name: 'Verre',
    icon: '🍺',
    color: 'bg-green-100 text-green-800',
    description: 'Bouteilles, verres cassés'
  },
  {
    id: 'metal_can',
    name: 'Canette métal',
    icon: '🥤',
    color: 'bg-gray-100 text-gray-800',
    description: 'Canettes, boîtes de conserve'
  },
  {
    id: 'paper',
    name: 'Papier',
    icon: '📄',
    color: 'bg-purple-100 text-purple-800',
    description: 'Papiers, journaux, cartons'
  },
  {
    id: 'organic',
    name: 'Déchets organiques',
    icon: '🍌',
    color: 'bg-emerald-100 text-emerald-800',
    description: 'Restes alimentaires'
  },
  {
    id: 'electronics',
    name: 'Électronique',
    icon: '📱',
    color: 'bg-indigo-100 text-indigo-800',
    description: 'Téléphones, composants'
  },
  {
    id: 'textile',
    name: 'Textile',
    icon: '👕',
    color: 'bg-pink-100 text-pink-800',
    description: 'Vêtements, chaussures'
  },
  {
    id: 'other',
    name: 'Autre',
    icon: '🗑️',
    color: 'bg-slate-100 text-slate-800',
    description: 'Autres types de déchets'
  }
];

interface WasteTypeSelectorProps {
  selectedTypes: string[];
  onSelectionChange: (types: string[]) => void;
  multiple?: boolean;
  className?: string;
}

const WasteTypeSelector = ({ 
  selectedTypes, 
  onSelectionChange, 
  multiple = true,
  className 
}: WasteTypeSelectorProps) => {
  const handleTypeClick = (typeId: string) => {
    if (multiple) {
      if (selectedTypes.includes(typeId)) {
        onSelectionChange(selectedTypes.filter(id => id !== typeId));
      } else {
        onSelectionChange([...selectedTypes, typeId]);
      }
    } else {
      onSelectionChange([typeId]);
    }
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {wasteTypes.map((type) => {
          const isSelected = selectedTypes.includes(type.id);
          
          return (
            <Button
              key={type.id}
              variant={isSelected ? "default" : "outline"}
              className={`h-auto p-3 text-left hover:scale-105 transition-transform ${
                isSelected ? 'bg-green-600 hover:bg-green-700' : 'hover:bg-green-50'
              }`}
              onClick={() => handleTypeClick(type.id)}
            >
              <div className="w-full">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{type.icon}</span>
                  <span className="font-medium text-sm">{type.name}</span>
                </div>
                <p className="text-xs opacity-75">{type.description}</p>
              </div>
            </Button>
          );
        })}
      </div>
      
      {selectedTypes.length > 0 && (
        <div className="mt-3">
          <p className="text-sm text-gray-600 mb-2">Types sélectionnés :</p>
          <div className="flex flex-wrap gap-1">
            {selectedTypes.map((typeId) => {
              const type = wasteTypes.find(t => t.id === typeId);
              if (!type) return null;
              
              return (
                <Badge key={typeId} variant="secondary" className="text-xs">
                  {type.icon} {type.name}
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WasteTypeSelector;