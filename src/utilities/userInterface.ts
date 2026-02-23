export interface User {
  userid: number;    // Matchar DB (int unsigned)
  email: string;     // Matchar DB
  firstname: string; // Matchar DB
  lastname: string;  // Matchar DB
  phone?: string;    // Matchar DB
  role?: 'visitor' | 'staff' | 'member'; // Matchar DB enum
}
