export type UserRole = 'customer' | 'admin'
export type BookingStatus =
	| 'pending'
	| 'confirmed'
	| 'cancelled'
	| 'completed'

export interface Database {
	public: {
		Tables: {
			users: {
				Row: {
					user_id: string
					auth_user_id: string | null
					name: string
					email: string
					phone: string | null
					role: UserRole
					created_at: string
					updated_at: string
				}
				Insert: {
					user_id?: string
					auth_user_id?: string | null
					name: string
					email: string
					phone?: string | null
					role?: UserRole
					created_at?: string
					updated_at?: string
				}
				Update: {
					user_id?: string
					auth_user_id?: string | null
					name?: string
					email?: string
					phone?: string | null
					role?: UserRole
					created_at?: string
					updated_at?: string
				}
				Relationships: [
					{
						foreignKeyName: 'users_auth_user_id_fkey'
						columns: ['auth_user_id']
						isOneToOne: true
						referencedRelation: 'users'
						referencedColumns: ['id']
					},
				]
			}
			services: {
				Row: {
					service_id: string
					name: string
					description: string
					price: number
					created_at: string
				}
				Insert: {
					service_id?: string
					name: string
					description: string
					price: number
					created_at?: string
				}
				Update: {
					service_id?: string
					name?: string
					description?: string
					price?: number
					created_at?: string
				}
				Relationships: []
			}
			bookings: {
				Row: {
					booking_id: string
					user_id: string
					service_id: string
					description: string | null
					booking_date: string
					status: BookingStatus
					created_at: string
					updated_at: string
				}
				Insert: {
					booking_id?: string
					user_id: string
					service_id: string
					description?: string | null
					booking_date?: string
					status?: BookingStatus
					created_at?: string
					updated_at?: string
				}
				Update: {
					booking_id?: string
					user_id?: string
					service_id?: string
					description?: string | null
					booking_date?: string
					status?: BookingStatus
					created_at?: string
					updated_at?: string
				}
				Relationships: [
					{
						foreignKeyName: 'bookings_user_id_fkey'
						columns: ['user_id']
						isOneToOne: false
						referencedRelation: 'users'
						referencedColumns: ['user_id']
					},
					{
						foreignKeyName: 'bookings_service_id_fkey'
						columns: ['service_id']
						isOneToOne: false
						referencedRelation: 'services'
						referencedColumns: ['service_id']
					},
				]
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			is_admin: {
				Args: Record<PropertyKey, never>
				Returns: boolean
			}
		}
		Enums: {
			user_role: UserRole
			booking_status: BookingStatus
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
}
