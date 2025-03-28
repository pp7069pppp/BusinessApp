import { useStoreStore } from "@/lib/stores/store-store";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export function StoreSelector() {
  const { stores, currentStore, fetchStores, setCurrentStore } = useStoreStore();

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Store:</span>
      <Select
        value={currentStore?.id.toString()}
        onValueChange={(value) => setCurrentStore(parseInt(value))}
        disabled={stores.length === 0}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a store" />
        </SelectTrigger>
        <SelectContent>
          {stores.map((store) => (
            <SelectItem key={store.id} value={store.id.toString()}>
              {store.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}