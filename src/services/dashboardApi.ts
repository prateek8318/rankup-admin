import { appConfig } from '@/services/appConfig';
import toast from "react-hot-toast";

const BASE_URL = appConfig.apiBaseUrl;

interface DashboardParams {
  page: number;
  rowsPerPage: number;
  searchQuery: string;
}

export const getDashboardTotals = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/dashboard/totals`,
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
      const errorMessage = result.ErrorMessage || result.message || "Failed to fetch dashboard totals";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    return result;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong!";
    console.error("Dashboard Totals API Error:", err);
    toast.error(message);
    throw new Error(message);
  }
};

export const getDashboardOverview = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/dashboard/overview`,
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
      const errorMessage = result.ErrorMessage || result.message || "Failed to fetch dashboard overview";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    return result;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong!";
    console.error("Dashboard Overview API Error:", err);
    toast.error(message);
    throw new Error(message);
  }
};

export const getDashboardStats = async ({ page = 1, rowsPerPage = 10, searchQuery = "" }: Partial<DashboardParams> = {}) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/dashboard/stats?search=${searchQuery}&page=${page}&limit=${rowsPerPage}`,
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
      const errorMessage = result.ErrorMessage || result.message || "Failed to fetch dashboard stats";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    if (result.Success === false) {
      const errorMessage = result.ErrorMessage || "Failed to fetch dashboard stats";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    return result;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong!";
    console.error("Dashboard Stats API Error:", err);
    toast.error(message);
    throw new Error(message);
  }
};

export const getUsersCount = async () => {
  const token = localStorage.getItem("token");
  try {
    const url = '/api/admin/users/count';

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = "Failed to fetch users count";
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.ErrorMessage || errorData.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    const result = await res.json();
    console.log('Users Count API Response:', result); // Debug log
    
    // Handle the actual API response structure: {success, data, message, timestamp}
    if (result.success && result.data) {
      return result.data; // Return the data object which contains totalUsers
    }
    
    return result;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong!";
    console.error("Users Count API Error:", err);
    toast.error(message);
    throw new Error(message);
  }
};

export const getCMSList = async ({ page = 1, limit = 10, search = "", language = "", languages = "" }: { page?: number; limit?: number; search?: string; language?: string; languages?: string } = {}) => {
  const token = localStorage.getItem("token");
  try {
    let url = 'http://192.168.1.41:5009/api/cms';
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (search) params.append('search', search);
    if (language) params.append('language', language);
    if (languages) params.append('languages', languages);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();

    if (!res.ok) {
      const errorMessage = result.ErrorMessage || result.message || "Failed to fetch CMS list";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    return result;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong!";
    console.error("CMS List API Error:", err);
    toast.error(message);
    throw new Error(message);
  }
};

export const getCMSContent = async (key: string, language: string = "en") => {
  const token = localStorage.getItem("token");
  try {
    const url = `http://192.168.1.41:5008/api/cms/${key}?language=${language}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();

    if (!res.ok) {
      const errorMessage = result.ErrorMessage || result.message || "Failed to fetch CMS content";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    return result;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong!";
    console.error("CMS Content API Error:", err);
    toast.error(message);
    throw new Error(message);
  }
};

export const getCMSKeys = async () => {
  const token = localStorage.getItem("token");
  try {
    const url = 'http://192.168.1.41:5008/api/cms/keys';
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();

    if (!res.ok) {
      const errorMessage = result.ErrorMessage || result.message || "Failed to fetch CMS keys";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    return result;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong!";
    console.error("CMS Keys API Error:", err);
    toast.error(message);
    throw new Error(message);
  }
};

export const createCMS = async (data: unknown) => {
  const token = localStorage.getItem("token");
  try {
    const url = 'http://192.168.1.41:5008/api/cms';
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });
    const result = await res.json();

    if (!res.ok) {
      const errorMessage = result.ErrorMessage || result.message || "Failed to create CMS content";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    toast.success("CMS content created successfully!");
    return result;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong!";
    console.error("Create CMS API Error:", err);
    toast.error(message);
    throw new Error(message);
  }
};

export const updateCMS = async (id: string, data: unknown) => {
  const token = localStorage.getItem("token");
  try {
    const url = `http://192.168.1.41:5008/api/cms/${id}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });
    const result = await res.json();

    if (!res.ok) {
      const errorMessage = result.ErrorMessage || result.message || "Failed to update CMS content";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    toast.success("CMS content updated successfully!");
    return result;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong!";
    console.error("Update CMS API Error:", err);
    toast.error(message);
    throw new Error(message);
  }
};

export const deleteCMS = async (id: string) => {
  const token = localStorage.getItem("token");
  try {
    const url = `http://192.168.1.41:5008/api/cms/${id}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();

    if (!res.ok) {
      const errorMessage = result.ErrorMessage || result.message || "Failed to delete CMS content";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    toast.success("CMS content deleted successfully!");
    return result;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong!";
    console.error("Delete CMS API Error:", err);
    toast.error(message);
    throw new Error(message);
  }
};

export const updateCMSStatus = async (id: string, status: boolean) => {
  const token = localStorage.getItem("token");
  try {
    const url = `http://192.168.1.41:5008/api/cms/${id}/status`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive: status })
    });
    const result = await res.json();

    if (!res.ok) {
      const errorMessage = result.ErrorMessage || result.message || "Failed to update CMS status";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    toast.success("CMS status updated successfully!");
    return result;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong!";
    console.error("Update CMS Status API Error:", err);
    toast.error(message);
    throw new Error(message);
  }
};

export const getExams = async ({ page = 1, limit = 10, search = "" }: { page?: number; limit?: number; search?: string } = {}) => {
  const token = localStorage.getItem("token");
  try {
    let url = '/api/admin/exams';
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (search) params.append('search', search);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();

    if (!res.ok) {
      const errorMessage = result.ErrorMessage || result.message || "Failed to fetch exams";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    return result;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong!";
    console.error("Exams API Error:", err);
    toast.error(message);
    throw new Error(message);
  }
};

export const getExamsCount = async () => {
  const token = localStorage.getItem("token");
  try {
    const url = '/api/admin/exams/count';
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();

    if (!res.ok) {
      const errorMessage = result.ErrorMessage || result.message || "Failed to fetch exams count";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    return result;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong!";
    console.error("Exams Count API Error:", err);
    toast.error(message);
    throw new Error(message);
  }
};

export const getUsers = async ({ page = 1, limit = 10, search = "" }: { page?: number; limit?: number; search?: string } = {}) => {
  const token = localStorage.getItem("token");
  try {
    let url = '/api/admin/users';
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (search) params.append('search', search);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();

    if (!res.ok) {
      const errorMessage = result.ErrorMessage || result.message || "Failed to fetch users";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    return result;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong!";
    console.error("Users API Error:", err);
    toast.error(message);
    throw new Error(message);
  }
};

export const getAllDeashboard = async ({ page, rowsPerPage, searchQuery }: DashboardParams) => {
  return getDashboardStats({ page, rowsPerPage, searchQuery });
};
