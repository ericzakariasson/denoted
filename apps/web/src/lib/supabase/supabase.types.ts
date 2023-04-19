export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      page_publication: {
        Row: {
          created_at: string;
          id: string;
          ipfs_cid: string;
          page_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          ipfs_cid: string;
          page_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          ipfs_cid?: string;
          page_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
