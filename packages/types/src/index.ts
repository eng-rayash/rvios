// ─────────────────────────────────────────────────────────────
// @rvios/types — Shared TypeScript interfaces for all RVIOS apps
// ─────────────────────────────────────────────────────────────

// ── Enums ─────────────────────────────────────────────────────

export enum UserRole {
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
}

export enum PostStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export enum ServiceStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum ContactStatus {
  UNREAD = "UNREAD",
  READ = "READ",
  REPLIED = "REPLIED",
}

export enum MediaType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  DOCUMENT = "DOCUMENT",
}

// ── Auth ──────────────────────────────────────────────────────

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

// ── User ──────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  role?: UserRole;
}

// ── Post (Blog Article) ───────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  _count?: { posts: number };
}

export interface Post {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  description: string;
  content: string; // JSON or markdown
  metaDescription: string;
  keywords: string[];
  tags: string[];
  heroImageUrl?: string;
  heroImageAlt?: string;
  readingTime: number;
  status: PostStatus;
  featured: boolean;
  views: number;
  category?: Category;
  categoryId: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostDto {
  title: string;
  titleEn?: string;
  slug: string;
  description: string;
  content: string;
  metaDescription: string;
  keywords: string[];
  tags: string[];
  heroImageUrl?: string;
  heroImageAlt?: string;
  readingTime?: number;
  status?: PostStatus;
  featured?: boolean;
  categoryId: string;
}

export interface UpdatePostDto extends Partial<CreatePostDto> {}

// ── Category ─────────────────────────────────────────────────

export interface CreateCategoryDto {
  name: string;
  nameEn: string;
  slug: string;
}

// ── Service ──────────────────────────────────────────────────

export interface Service {
  id: string;
  title: string;
  titleEn: string;
  slug: string;
  description: string;
  descriptionEn: string;
  icon: string;
  features: string[];
  order: number;
  status: ServiceStatus;
  createdAt: string;
}

export interface CreateServiceDto {
  title: string;
  titleEn: string;
  slug: string;
  description: string;
  descriptionEn: string;
  icon?: string;
  features?: string[];
  order?: number;
  status?: ServiceStatus;
}

export interface UpdateServiceDto extends Partial<CreateServiceDto> {}

// ── Project ──────────────────────────────────────────────────

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  technologies: string[];
  url?: string;
  featured: boolean;
  order: number;
  createdAt: string;
}

export interface CreateProjectDto {
  title: string;
  description: string;
  imageUrl?: string;
  technologies?: string[];
  url?: string;
  featured?: boolean;
  order?: number;
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {}

// ── Media ─────────────────────────────────────────────────────

export interface Media {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  type: MediaType;
  uploadedAt: string;
}

// ── Contact ──────────────────────────────────────────────────

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
}

export interface CreateContactDto {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}

export interface UpdateContactStatusDto {
  status: ContactStatus;
}

// ── Settings ─────────────────────────────────────────────────

export interface Setting {
  id: string;
  key: string;
  value: string;
  type: "STRING" | "JSON" | "BOOLEAN" | "NUMBER";
  label?: string;
}

export interface UpdateSettingDto {
  value: string;
}

// ── Owner Profile ─────────────────────────────────────────────

export interface OwnerProfile {
  id: string;
  name: string;
  title: string;
  titleEn: string;
  bio: string;
  bioEn: string;
  avatarUrl?: string;
  skills: string[];
  links: Record<string, string>; // { github, linkedin, twitter, ... }
  resumeUrl?: string;
  updatedAt: string;
}

export interface UpdateOwnerProfileDto {
  name?: string;
  title?: string;
  titleEn?: string;
  bio?: string;
  bioEn?: string;
  avatarUrl?: string;
  skills?: string[];
  links?: Record<string, string>;
  resumeUrl?: string;
}

// ── API Response Wrappers ─────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
}
