import { useState } from "react";
import { User, LogOut } from "lucide-react";
import apiService from "@/services/api";

interface Props {
  onLogout: () => void;
}

export default function ProfileMenu({ onLogout }: Props) {
  const [open, setOpen] = useState(false);
  const user = apiService.getCurrentUser();

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
        <User className="h-6 w-6" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border rounded shadow-md z-50">
          <div className="p-3 border-b">
            <p className="font-semibold">{user?.fullName}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <button
            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
            onClick={() => {
              apiService.logout();
              onLogout();
            }}
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
