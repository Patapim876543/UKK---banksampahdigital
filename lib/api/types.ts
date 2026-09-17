export interface ApiResponse<T = any> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  errors?: any;
  timestamp?: string;
}

// ================= APP MAKER =================
export interface RegisterAppMakerDto {
  email: string;
  password: string;
  namaSiswa: string;
  kelas: string;
  namaApp: string;
}

export interface LoginAppMakerDto {
  email: string;
  password: string;
}

export interface AppMakerProfile {
  id: number;
  email: string;
  namaSiswa: string;
  kelas: string;
  namaApp: string;
  appKey: string;
  totalNasabah?: number;
  totalKategori?: number;
  totalHadiah?: number;
  totalTransaksiSetor?: number;
  totalTransaksiPenukaran?: number;
  createdAt?: string;
}

export interface AppMakerAuthData {
  appKey: string;
  token: string;
  profile?: AppMakerProfile;
}

// ================= USER & AUTH =================
export type UserRole = "NASABAH" | "ADMIN";

export interface RegisterNasabahDto {
  username: string;
  password: string;
  namaLengkap: string;
  alamat: string;
  nomorTelepon: string;
  foto?: File | string | null;
}

export interface RegisterAdminDto {
  username: string;
  password: string;
  namaUnit: string;
  namaPengelola: string;
  nomorTelepon: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface NasabahProfile {
  id: number;
  username: string;
  namaLengkap: string;
  alamat: string;
  nomorTelepon: string;
  foto?: string | null;
  totalPoin: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminProfile {
  id: number;
  username: string;
  namaUnit: string;
  namaPengelola: string;
  nomorTelepon: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponseData {
  role: UserRole;
  token: string;
  profile: NasabahProfile | AdminProfile;
}

export interface CurrentUserSession {
  role: UserRole;
  token: string;
  profile: NasabahProfile | AdminProfile;
}

// ================= KATEGORI SAMPAH =================
export type JenisSampah = "PLASTIK" | "KERTAS" | "LOGAM" | "KACA" | "ORGANIK" | "LAINNYA";

export interface KategoriSampah {
  id: number;
  nama: string;
  jenis: JenisSampah | string;
  hargaPerKg: number;
  poinPerKg: number;
  deskripsi?: string;
  foto?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateKategoriSampahDto {
  nama: string;
  jenis: string;
  hargaPerKg: number;
  poinPerKg: number;
  deskripsi?: string;
  foto?: File | string | null;
}

export interface UpdateKategoriSampahDto {
  nama?: string;
  jenis?: string;
  hargaPerKg?: number;
  poinPerKg?: number;
  deskripsi?: string;
  foto?: File | string | null;
}

// ================= SETOR SAMPAH =================
export type StatusSetor = "MENUNGGU_KONFIRMASI" | "DIVERIFIKASI" | "DITOLAK" | "SELESAI";

export interface ItemSetorDto {
  kategoriId: number;
  beratEstimasi: number;
  keterangan?: string;
}

export interface CreateSetorSampahDto {
  tanggalSetor?: string;
  catatan?: string;
  items: ItemSetorDto[];
}

export interface VerifyItemSetorDto {
  itemId: number;
  beratRiil: number;
}

export interface VerifySetorSampahDto {
  status: "DIVERIFIKASI" | "DITOLAK";
  catatanAdmin?: string;
  items?: VerifyItemSetorDto[];
}

export interface ItemSetoran {
  id: number;
  kategoriId: number;
  kategori?: KategoriSampah;
  beratEstimasi: number;
  beratRiil?: number | null;
  poinEstimasi?: number;
  poinRiil?: number | null;
  keterangan?: string;
}

export interface Setoran {
  id: number;
  kodeSetor?: string;
  nasabahId: number;
  nasabah?: NasabahProfile;
  tanggalSetor: string;
  status: StatusSetor;
  catatan?: string;
  catatanAdmin?: string;
  totalBeratEstimasi: number;
  totalBeratRiil?: number | null;
  totalPoinEstimasi: number;
  totalPoinRiil?: number | null;
  items: ItemSetoran[];
  createdAt?: string;
  updatedAt?: string;
}

// ================= HADIAH / REWARDS =================
export interface Hadiah {
  id: number;
  nama: string;
  poinDibutuhkan: number;
  stok: number;
  deskripsi?: string;
  foto?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateHadiahDto {
  nama: string;
  poinDibutuhkan: number;
  stok: number;
  deskripsi?: string;
  foto?: File | string | null;
}

export interface UpdateHadiahDto {
  nama?: string;
  poinDibutuhkan?: number;
  stok?: number;
  deskripsi?: string;
  foto?: File | string | null;
}

// ================= PENUKARAN POIN =================
export type StatusPenukaran = "MENUNGGU" | "DIPROSES" | "SELESAI" | "DITOLAK";

export interface CreatePenukaranPoinDto {
  hadiahId: number;
}

export interface PenukaranPoin {
  id: number;
  kodePenukaran?: string;
  nasabahId: number;
  nasabah?: NasabahProfile;
  hadiahId: number;
  hadiah?: Hadiah;
  poinDigunakan: number;
  status: StatusPenukaran;
  tanggalPengajuan: string;
  tanggalSelesai?: string | null;
  catatan?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ================= REKAPITULASI & DASHBOARD =================
export interface RekapRincianJenis {
  jenis: string;
  totalBerat: number;
  totalPoin: number;
  totalNominal?: number;
}

export interface RekapBulanan {
  bulan: string;
  totalBerat: number;
  totalPoin: number;
  totalNominal?: number;
  rincianJenis: RekapRincianJenis[];
  totalPenukaran?: number;
  totalPoinDitukar?: number;
}

export interface DashboardSummaryNasabah {
  totalPoin: number;
  totalSetoranSelesai: number;
  totalPenukaran: number;
  totalBeratKg: number;
  setoranTerbaru?: Setoran[];
  penukaranTerbaru?: PenukaranPoin[];
}

export interface DashboardStatsAdmin {
  totalNasabah: number;
  totalSetoranPending: number;
  totalBeratTerkumpul: number;
  totalPoinBeredar: number;
  totalPoinDitukar: number;
  transaksiTerbaru?: Setoran[];
}
