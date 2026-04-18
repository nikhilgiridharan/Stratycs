import type { LineItemCategory } from "@/types";

type SeedRow = {
  category: LineItemCategory;
  name: string;
  unit: string;
  default_price: number;
  taxable: boolean;
};

/** Pre-loaded HVAC price book for new businesses */
export const HVAC_SEED_ITEMS: SeedRow[] = [
  // Equipment
  { category: "Equipment", name: "AC Unit (2-ton)", unit: "ea", default_price: 1100, taxable: true },
  { category: "Equipment", name: "AC Unit (3-ton)", unit: "ea", default_price: 1400, taxable: true },
  { category: "Equipment", name: "AC Unit (4-ton)", unit: "ea", default_price: 1700, taxable: true },
  { category: "Equipment", name: "Furnace (80k BTU)", unit: "ea", default_price: 900, taxable: true },
  { category: "Equipment", name: "Air Handler", unit: "ea", default_price: 750, taxable: true },
  { category: "Equipment", name: "Thermostat (smart)", unit: "ea", default_price: 180, taxable: true },
  { category: "Equipment", name: "Thermostat (standard)", unit: "ea", default_price: 65, taxable: true },
  // Labor
  { category: "Labor", name: "Installation Labor (per hour)", unit: "hr", default_price: 95, taxable: false },
  { category: "Labor", name: "Diagnostic / Service Call", unit: "ea", default_price: 120, taxable: false },
  { category: "Labor", name: "Refrigerant Recharge", unit: "ea", default_price: 200, taxable: false },
  { category: "Labor", name: "Duct Sealing (per vent)", unit: "ea", default_price: 45, taxable: false },
  { category: "Labor", name: "System Tune-Up", unit: "ea", default_price: 150, taxable: false },
  // Refrigerant
  { category: "Refrigerant", name: "R-410A (per lb)", unit: "lb", default_price: 35, taxable: true },
  { category: "Refrigerant", name: "R-22 (per lb)", unit: "lb", default_price: 75, taxable: true },
  // Materials
  { category: "Materials", name: "Filter (standard)", unit: "ea", default_price: 15, taxable: true },
  { category: "Materials", name: "Filter (HEPA)", unit: "ea", default_price: 45, taxable: true },
  { category: "Materials", name: "Capacitor", unit: "ea", default_price: 85, taxable: true },
  { category: "Materials", name: "Contactor", unit: "ea", default_price: 65, taxable: true },
  { category: "Materials", name: "Drain Pan", unit: "ea", default_price: 55, taxable: true },
  // Permits
  { category: "Permits", name: "City Permit Fee", unit: "ea", default_price: 75, taxable: false },
  { category: "Permits", name: "Inspection Fee", unit: "ea", default_price: 50, taxable: false },
];
