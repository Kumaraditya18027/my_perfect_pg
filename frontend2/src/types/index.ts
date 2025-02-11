export interface Booking {
  pg: {
    name?: string;
    address?: string;
    picture?: string;
  };
  user: {
    name?: string;
    phone?: string;
    email?: string;
  };
  assignedMember: {
    name?: string;
    phone?: string;
    email?: string;
  };
  status?: string;
}

export interface User {
  uuid: string;
  name: string;
  username?: string;
  email: string;
  address?: string;
  phone?: string;
  adhaar?: string;
  avatar?: string;
  role: "pgowner" | "employee";
  isPGOwnerVerified: boolean;
}
export interface EmployeeFormData {
  name: string;
  email: string;
  username: string;
  password: string;
  role: string;
}

export interface OwnerCardProps {
  owner: User;
  userType: string | string[];
  activeOptionsOwnerId: string | null;
  setActiveOptionsOwnerId: (id: string | null) => void;
  openVerifyModal: (owner: User) => void;
}
