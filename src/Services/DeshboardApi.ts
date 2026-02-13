import API_CONFIG from './apiConfig';
import toast from "react-hot-toast";

interface DashboardParams {
  page: number;
  rowsPerPage: number;
  searchQuery: string;
}

export const getAllDeashboard = async ({ page, rowsPerPage, searchQuery }: DashboardParams) => {
  const token = localStorage.getItem("token");
  try {
    console.log(searchQuery, "searchQuery");
    const res = await fetch(
      `${API_CONFIG.BASE_URL}/api/admin/dashboard/stats?search=${searchQuery}&page=${page}&limit=${rowsPerPage}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const result = await res.json();
    
    if (!res.ok) {
      const errorMessage = result.ErrorMessage || result.message || "Failed to fetch dashboard data";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
    
    if (result.Success === false) {
      const errorMessage = result.ErrorMessage || "Failed to fetch dashboard data";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
    
    return result;
  } catch (err: any) {
    console.error("Dashboard API Error:", err);
    toast.error(err.message || "Something went wrong!");
    throw new Error(err.message);
  }
};
