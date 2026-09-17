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
  namaLengkap?: string;
  namaNasabah?: string;
  alamat: string;
  nomorTelepon?: string;
  telp?: string;
  foto?: File | string | null;
}

export interface RegisterAdminDto {
  username: string;
  password: string;
  namaUnit: string;
  namaPengelola: string;
  nomorTelepon?: string;
  telp?: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface NasabahProfile {
  id: string | number;
  userId?: string | number;
  username: string;
  namaLengkap: string;
  namaNasabah?: string;
  alamat: string;
  nomorTelepon: string;
  telp?: string;
  foto?: string | null;
  totalPoin: number;
  saldoPoin?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminProfile {
  id: string | number;
  userId?: string | number;
  username: string;
  namaUnit: string;
  namaPengelola: string;
  nomorTelepon: string;
  telp?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponseData {
  role: UserRole;
  token: string;
  profile: NasabahProfile | AdminProfile;
  nasabah?: any;
  adminBank?: any;
}

export interface CurrentUserSession {
  role: UserRole;
  token: string;
  profile: NasabahProfile | AdminProfile;
}

// ================= KATEGORI SAMPAH =================
export type JenisSampah = "PLASTIK" | "KERTAS" | "LOGAM" | "KACA" | "ORGANIK" | "LAINNYA" | "plastik" | "kertas" | "logam" | "kaca";

export interface KategoriSampah {
  id: string | number;
  nama: string;
  namaKategori?: string;
  jenis: JenisSampah | string;
  hargaPerKg: number;
  poinPerKg: number;
  deskripsi?: string;
  foto?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateKategoriSampahDto {
  nama?: string;
  namaKategori?: string;
  jenis: string;
  hargaPerKg: number;
  poinPerKg: number;
  deskripsi?: string;
  foto?: File | string | null;
}

export interface UpdateKategoriSampahDto {
  nama?: string;
  namaKategori?: string;
  jenis?: string;
  hargaPerKg?: number;
  poinPerKg?: number;
  deskripsi?: string;
  foto?: File | string | null;
}

// ================= SETOR SAMPAH =================
export type StatusSetor = "MENUNGGU_KONFIRMASI" | "DIVERIFIKASI" | "DITOLAK" | "SELESAI" | "menunggu_konfirmasi" | "diverifikasi" | "ditolak" | "selesai";

export interface ItemSetorDto {
  kategoriId?: string | number;
  kategoriSampahId?: string | number;
  beratEstimasi?: number;
  beratKg?: number;
  keterangan?: string;
}

export interface CreateSetorSampahDto {
  tanggalSetor?: string;
  tanggal?: string;
  catatan?: string;
  items: ItemSetorDto[];
}

export interface VerifyItemSetorDto {
  itemId?: string | number;
  kategoriSampahId?: string | number;
  beratRiil?: number;
  beratKgReal?: number;
}

export interface VerifySetorSampahDto {
  status: "DIVERIFIKASI" | "DITOLAK" | "diverifikasi" | "ditolak" | string;
  catatanAdmin?: string;
  items?: VerifyItemSetorDto[];
  itemsReal?: VerifyItemSetorDto[];
}

export interface ItemSetoran {
  id: string | number;
  kategoriId: string | number;
  kategoriSampahId?: string | number;
  kategori?: KategoriSampah;
  kategoriSampah?: KategoriSampah;
  beratEstimasi: number;
  beratKg?: number;
  beratRiil?: number | null;
  beratKgReal?: number | null;
  poinEstimasi?: number;
  subtotalPoin?: number;
  poinRiil?: number | null;
  keterangan?: string;
}

export interface Setoran {
  id: string | number;
  kodeSetor?: string;
  nasabahId: string | number;
  nasabah?: NasabahProfile;
  tanggalSetor: string;
  tanggal?: string;
  status: StatusSetor;
  catatan?: string;
  catatanAdmin?: string;
  totalBeratEstimasi: number;
  totalBeratKg?: number;
  totalBeratRiil?: number | null;
  totalPoinEstimasi: number;
  totalPoin?: number;
  totalPoinRiil?: number | null;
  items: ItemSetoran[];
  detailSetors?: any[];
  createdAt?: string;
  updatedAt?: string;
}

// ================= HADIAH / REWARDS =================
export interface Hadiah {
  id: string | number;
  nama: string;
  namaHadiah?: string;
  poinDibutuhkan: number;
  stok: number;
  deskripsi?: string;
  foto?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateHadiahDto {
  nama?: string;
  namaHadiah?: string;
  poinDibutuhkan: number;
  stok: number;
  deskripsi?: string;
  foto?: File | string | null;
}

export interface UpdateHadiahDto {
  nama?: string;
  namaHadiah?: string;
  poinDibutuhkan?: number;
  stok?: number;
  deskripsi?: string;
  foto?: File | string | null;
}

// ================= PENUKARAN POIN =================
export type StatusPenukaran = "MENUNGGU" | "DIPROSES" | "SELESAI" | "DITOLAK" | "diproses" | "selesai" | "ditolak";

export interface CreatePenukaranPoinDto {
  hadiahId: string | number;
}

export interface PenukaranPoin {
  id: string | number;
  kodePenukaran?: string;
  nasabahId: string | number;
  nasabah?: NasabahProfile;
  hadiahId: string | number;
  hadiah?: Hadiah;
  poinDigunakan: number;
  poinTerpakai?: number;
  status: StatusPenukaran;
  tanggalPengajuan: string;
  tanggal?: string;
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
  periode?: string;
  totalBerat: number;
  totalPoin: number;
  totalNominal?: number;
  rincianJenis: RekapRincianJenis[];
  totalPenukaran?: number;
  totalPoinDitukar?: number;
  rekapitulasiTonase?: any;
  breakdownJenisSampah?: any;
  rekapitulasiPenukaranPoin?: any;
}

export interface DashboardSummaryNasabah {
  totalPoin: number;
  saldoPoin?: number;
  totalSetoranSelesai: number;
  totalPengajuanSetor?: number;
  totalPenukaran: number;
  totalPenukaranHadiah?: number;
  totalBeratKg: number;
  totalPoinDiperoleh?: number;
  setoranTerbaru?: Setoran[];
  setorTerakhir?: any[];
  penukaranTerbaru?: PenukaranPoin[];
  penukaranTerakhir?: any[];
}

export interface DashboardStatsAdmin {
  totalNasabah: number;
  totalKategoriSampah?: number;
  totalTransaksiSetor?: number;
  totalHadiah?: number;
  totalSetoranPending: number;
  totalBeratTerkumpul: number;
  totalBeratSampahKg?: number;
  totalPoinBeredar: number;
  totalPoinTersalurkan?: number;
  totalPoinDitukar: number;
  transaksiTerbaru?: Setoran[];
}
