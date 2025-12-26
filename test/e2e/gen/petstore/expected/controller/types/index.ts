// Auto-generated shared types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

export interface Pet {
  id: string
  name: string
  tag?: string
  status?: 'available' | 'pending' | 'sold'
}

export interface CreatePetRequest {
  name: string
  tag?: string
}

export interface UpdatePetRequest {
  name?: string
  tag?: string
  status?: 'available' | 'pending' | 'sold'
}

export interface Photo {
  id: string
  url: string
  caption?: string
}

export interface UploadPhotoRequest {
  url: string
  caption?: string
}

export interface UserProfile {
  id: string
  username: string
  email?: string
  avatar?: string
}

export interface Event {
  type: string
  data: Record<string, unknown>
  timestamp?: string
}
