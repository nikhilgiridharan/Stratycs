import type { LineItemCategory } from "@/types";

type SeedRow = {
  category: LineItemCategory;
  name: string;
  unit: string;
  default_price: number;
  taxable: boolean;
};

export const HVAC_SEED_ITEMS: SeedRow[] = [
  // Equipment — AC tonnage
  { category: "Equipment", name: "AC Unit 1.5 Ton", unit: "ea", default_price: 4200, taxable: true },
  { category: "Equipment", name: "AC Unit 2 Ton", unit: "ea", default_price: 4600, taxable: true },
  { category: "Equipment", name: "AC Unit 2.5 Ton", unit: "ea", default_price: 5000, taxable: true },
  { category: "Equipment", name: "AC Unit 3 Ton", unit: "ea", default_price: 5400, taxable: true },
  { category: "Equipment", name: "AC Unit 3.5 Ton", unit: "ea", default_price: 5800, taxable: true },
  { category: "Equipment", name: "AC Unit 4 Ton", unit: "ea", default_price: 6200, taxable: true },
  { category: "Equipment", name: "AC Unit 5 Ton", unit: "ea", default_price: 7000, taxable: true },
  { category: "Equipment", name: "Heat Pump (standard)", unit: "ea", default_price: 6500, taxable: true },
  { category: "Equipment", name: "Air Handler", unit: "ea", default_price: 2200, taxable: true },
  { category: "Equipment", name: "Gas Furnace 80%", unit: "ea", default_price: 1800, taxable: true },
  { category: "Equipment", name: "Gas Furnace 96%", unit: "ea", default_price: 2400, taxable: true },
  { category: "Equipment", name: "Condenser (replacement)", unit: "ea", default_price: 3200, taxable: true },
  { category: "Equipment", name: "Thermostat — Standard", unit: "ea", default_price: 150, taxable: true },
  { category: "Equipment", name: "Thermostat — Smart/Wi‑Fi", unit: "ea", default_price: 280, taxable: true },
  // Labor
  { category: "Labor", name: "Standard Install (full day)", unit: "ea", default_price: 1200, taxable: false },
  { category: "Labor", name: "Emergency Call", unit: "ea", default_price: 199, taxable: false },
  { category: "Labor", name: "Diagnostic Fee", unit: "ea", default_price: 99, taxable: false },
  { category: "Labor", name: "After‑Hours Rate (per hr)", unit: "hr", default_price: 185, taxable: false },
  { category: "Labor", name: "Helper Rate (per hr)", unit: "hr", default_price: 95, taxable: false },
  { category: "Labor", name: "Startup & Commissioning", unit: "ea", default_price: 250, taxable: false },
  // Refrigerant
  { category: "Refrigerant", name: "R‑410A (per lb)", unit: "lb", default_price: 85, taxable: true },
  { category: "Refrigerant", name: "R‑22 (per lb)", unit: "lb", default_price: 175, taxable: true },
  { category: "Refrigerant", name: "R‑32 (per lb)", unit: "lb", default_price: 95, taxable: true },
  // Materials
  { category: "Materials", name: "Copper Line Set (per ft)", unit: "ft", default_price: 12, taxable: true },
  { category: "Materials", name: "Disconnect Box", unit: "ea", default_price: 85, taxable: true },
  { category: "Materials", name: "Whip / Flex Conduit", unit: "ea", default_price: 45, taxable: true },
  { category: "Materials", name: "Drain Line (per ft)", unit: "ft", default_price: 4, taxable: true },
  { category: "Materials", name: "1\" Filter (standard)", unit: "ea", default_price: 18, taxable: true },
  { category: "Materials", name: "Run Capacitor", unit: "ea", default_price: 65, taxable: true },
  { category: "Materials", name: "Start Capacitor", unit: "ea", default_price: 55, taxable: true },
  { category: "Materials", name: "Contactor 30A", unit: "ea", default_price: 45, taxable: true },
  // Permits
  { category: "Permits", name: "City Permit", unit: "ea", default_price: 250, taxable: false },
  { category: "Permits", name: "County Permit", unit: "ea", default_price: 175, taxable: false },
  // Misc
  { category: "Misc", name: "Disposal Fee", unit: "ea", default_price: 75, taxable: true },
  { category: "Misc", name: "Travel Charge", unit: "ea", default_price: 65, taxable: true },
  { category: "Misc", name: "Warranty Upgrade (10yr parts)", unit: "ea", default_price: 350, taxable: true },
  { category: "Misc", name: "Ductwork Modification (est.)", unit: "ea", default_price: 450, taxable: true },
  { category: "Misc", name: "Pad / Stand", unit: "ea", default_price: 120, taxable: true },
];
