export type FarmInfo = {
  farmName: string;
  ownerName: string;
  location: string;
  recordYear: string;
  veterinarySupervisor: string;
};

export type ServiceType = "Natural" | "Artificial Insemination";

export type FertilityRecord = {
  id: string;
  doeTag: string;
  breed: string;
  serviceDate: string; // ISO yyyy-mm-dd
  buckTag: string;
  serviceType: ServiceType;
  expectedKiddingDate: string;
  actualKiddingDate: string;
  kidsBorn: number;
  maleKids: number;
  femaleKids: number;
  kidsAlive: number;
  remarks: string;
  createdAt: string;
  updatedAt: string;
};

export type Credentials = {
  username: string;
  password: string;
};