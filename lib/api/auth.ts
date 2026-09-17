import { apiClient, setStoredToken, removeStoredToken } from "./httpClient";
import { buildFormData } from "./formDataHelper";
import {
  ApiResponse,
  RegisterNasabahDto,
  RegisterAdminDto,
  LoginDto,
  AuthResponseData,
  NasabahProfile,
  AdminProfile,
} from "./types";

export function extractProfile(data: any): NasabahProfile | AdminProfile {
  if (!data) return {} as any;
  if (data.role === "NASABAH" && data.nasabah) {
    return {
      ...data.nasabah,
      username: data.username || data.nasabah.username || "",
      namaLengkap: data.nasabah.namaNasabah || data.nasabah.namaLengkap || data.username || "",
      namaNasabah: data.nasabah.namaNasabah || data.nasabah.namaLengkap || "",
      alamat: data.nasabah.alamat || "",
      nomorTelepon: data.nasabah.telp || data.nasabah.nomorTelepon || "",
      telp: data.nasabah.telp || data.nasabah.nomorTelepon || "",
      totalPoin: Number(data.nasabah.saldoPoin ?? data.nasabah.totalPoin ?? 0),
      saldoPoin: Number(data.nasabah.saldoPoin ?? data.nasabah.totalPoin ?? 0),
    };
  } else if (data.role === "ADMIN" && data.adminBank) {
    return {
      ...data.adminBank,
      username: data.username || data.adminBank.username || "",
      namaUnit: data.adminBank.namaUnit || "",
      namaPengelola: data.adminBank.namaPengelola || "",
      nomorTelepon: data.adminBank.telp || data.adminBank.nomorTelepon || "",
      telp: data.adminBank.telp || data.adminBank.nomorTelepon || "",
    };
  }
  return (data.profile || data) as any;
}

export async function registerNasabah(payload: RegisterNasabahDto): Promise<ApiResponse<NasabahProfile>> {
  const wireData: any = {
    username: payload.username,
    password: payload.password,
    namaNasabah: payload.namaNasabah || payload.namaLengkap,
    alamat: payload.alamat,
    telp: payload.telp || payload.nomorTelepon,
  };

  let body: any = wireData;
  if (payload.foto instanceof File) {
    body = buildFormData({ ...wireData, foto: payload.foto }, "foto");
  }

  const res = await apiClient.post<any>("/api/v1/auth/nasabah/register", body);
  const profile = extractProfile(res.data) as NasabahProfile;
  return {
    ...res,
    data: profile,
  };
}

export async function registerAdmin(payload: RegisterAdminDto): Promise<ApiResponse<AdminProfile>> {
  const wireData = {
    username: payload.username,
    password: payload.password,
    namaUnit: payload.namaUnit,
    namaPengelola: payload.namaPengelola,
    telp: payload.telp || payload.nomorTelepon,
  };

  const res = await apiClient.post<any>("/api/v1/auth/admin/register", wireData);
  const profile = extractProfile(res.data) as AdminProfile;
  return {
    ...res,
    data: profile,
  };
}

export async function login(payload: LoginDto): Promise<ApiResponse<AuthResponseData>> {
  const res = await apiClient.post<any>("/api/v1/auth/login", payload);
  if (res.data?.token) {
    setStoredToken(res.data.token);
  }
  const profile = extractProfile(res.data);
  const authData: AuthResponseData = {
    role: res.data.role,
    token: res.data.token,
    profile,
    nasabah: res.data.nasabah,
    adminBank: res.data.adminBank,
  };
  return {
    ...res,
    data: authData,
  };
}

export async function getMe(): Promise<ApiResponse<{ role: "NASABAH" | "ADMIN"; profile: NasabahProfile | AdminProfile }>> {
  const res = await apiClient.get<any>("/api/v1/auth/me");
  const profile = extractProfile(res.data);
  return {
    ...res,
    data: {
      role: res.data.role,
      profile,
    },
  };
}

export function logout(): void {
  removeStoredToken();
}
