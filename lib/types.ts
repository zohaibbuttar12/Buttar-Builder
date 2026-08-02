// ─── Existing Types ───────────────────────────────────────────
export interface Project {
  id: string;
  name: string;
  description?: string;
  clientName: string;
  clientContact?: string;
  location: string;
  startDate: string;
  endDate?: string;
  estimatedBudget: number;
  plotSize?: string;
  status: "planning" | "active" | "on-hold" | "completed";
  projectType?: "construction" | "real-estate" | "mixed";
  totalLandCost?: number;
  totalConstructionCost?: number;
  taxesAndFees?: number;
  // ─── Land Sale → Construction linkage ───
  landSaleId?: string;          // set when this project was created from "Start Construction" on a Land Sale
  purchasedLandId?: string;     // the original purchased plot this project's land came from
  contractAmount?: number;      // Construction Revenue / Contract value agreed with the customer
  createdAt?: string;
}

export interface Labour {
  id: string; name: string; category: string; phone: string; address: string; createdAt?: string;
}

export interface WorkerCategory {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LabourPayment {
  id: string; labourId: string; labourName: string; projectId: string;
  workDescription: string; amount: number; date: string; createdAt?: string;
}

export interface Vendor {
  id: string; shopName: string; ownerName: string; materialType: string;
  phone: string; address: string; createdAt?: string;
}

export interface MaterialPurchase {
  id: string; projectId: string; vendorId: string; vendorName: string;
  materialType: string; quantity: number; unit: string; rate: number;
  total: number; date: string; createdAt?: string;
}

export interface Expense {
  id: string; projectId: string; category: string; description: string;
  vendorPerson: string; amount: number; date: string; createdAt?: string;
}

// ─── Investment Types ─────────────────────────────────────────
export interface Partner {
  id: string; name: string; phone: string; email?: string;
  cnic?: string; address?: string; notes?: string; createdAt?: string;
}

export interface ProjectPartner {
  id: string; projectId: string; partnerId: string; partnerName?: string;
  sharePercent: number; investedAmount: number; createdAt?: string;
}

export interface Property {
  id: string; projectId: string; plotNumber: string;
  propertyType: "plot" | "house" | "apartment" | "commercial";
  landArea: number; landUnit: string;
  landPurchasePrice: number; transferFees: number; purchaseDate: string;
  constructionType?: "none" | "grey-structure" | "fully-furnished";
  constructionArea?: number; constructionCostPerSqFt?: number;
  totalConstructionCost?: number;
  constructionStage?: "not-started" | "foundation" | "grey-structure" | "finishing" | "complete";
  totalCost?: number;
  status: "available" | "under-construction" | "ready" | "sold";
  notes?: string; createdAt?: string;
}

export interface Sale {
  id: string; projectId: string; propertyId: string; propertyLabel?: string;
  salePrice: number; saleDate: string; buyerName: string; buyerPhone?: string;
  paymentMode: "cash" | "installment" | "bank-transfer" | "cheque";
  notes?: string; propertyCost?: number; profit?: number; createdAt?: string;
}

export interface Stats {
  totalProjects: number; labourCost: number; materialCost: number;
  transportCost: number; totalExpenses: number; totalProjectCost: number;
}

export interface InvestmentStats {
  totalLandInvested: number; totalConstructionInvested: number;
  totalSaleRevenue: number; totalProfit: number;
  totalProperties: number; soldProperties: number; availableProperties: number;
}

// ─── Purchased Land Inventory Types ───────────────────────────
export interface PurchasedLand {
  id: string;
  plotName: string;
  plotNumber?: string;
  location?: string;
  owner?: string;
  totalArea: number;
  unit: "marla" | "kanal" | "sqft";
  purchasePrice: number;
  transferFee: number;
  totalCost?: number;          // computed
  costPerUnit?: number;        // computed
  usedArea?: number;           // computed (sum of assignments)
  availableArea?: number;      // computed
  purchaseDate?: string;
  status?: "available" | "partially_used" | "fully_used";
  notes?: string;
  documents?: { name: string; url: string }[];
  createdAt?: string;
}

export interface ProjectLandAssignment {
  id: string;
  projectId: string;
  purchasedLandId: string;
  plotName?: string;           // joined for display
  areaUsed: number;
  costPerUnitSnapshot?: number;
  landCost?: number;           // computed = areaUsed * costPerUnitSnapshot
  assignedDate?: string;
  notes?: string;
  createdAt?: string;
}

// ─── Land Sale (Purchased Land → Customer) Types ──────────────
export interface LandSale {
  id: string;
  purchasedLandId: string;
  plotName?: string;            // joined from purchased_lands for display
  plotNumber?: string;          // joined from purchased_lands for display
  plotLocation?: string;        // joined from purchased_lands for display
  customerName: string;
  customerPhone?: string;
  areaSold: number;
  unit: "marla" | "kanal" | "sqft";
  salePrice: number;
  costPerUnitSnapshot?: number;
  landPurchaseCost?: number;    // computed = areaSold * costPerUnitSnapshot
  landProfit?: number;          // computed = salePrice - landPurchaseCost
  purchaseDate?: string;        // snapshot of the plot's original purchase date
  saleDate: string;
  paymentMode?: "cash" | "installment" | "bank-transfer" | "cheque";
  notes?: string;
  constructionStatus: "no_construction" | "construction_started" | "in_progress" | "completed";
  projectId?: string;           // linked Construction Project, once started
  projectName?: string;         // joined for display
  createdAt?: string;
}
