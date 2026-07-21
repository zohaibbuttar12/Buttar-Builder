"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Project, Labour, LabourPayment, Vendor, MaterialPurchase, Expense, Stats, Partner, ProjectPartner, Property, Sale, PurchasedLand, ProjectLandAssignment, LandSale } from "@/lib/types";

interface DataContextType {
  projects: Project[]; labours: Labour[]; labourPayments: LabourPayment[];
  vendors: Vendor[]; materialPurchases: MaterialPurchase[]; expenses: Expense[];
  partners: Partner[]; projectPartners: ProjectPartner[];
  properties: Property[]; sales: Sale[];
  purchasedLands: PurchasedLand[]; projectLandAssignments: ProjectLandAssignment[];
  landSales: LandSale[];
  stats: Stats; loading: boolean; error: string | null;
  addProject: (p: Omit<Project,"id">) => Promise<void>;
  updateProject: (id: string, p: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addLabour: (l: Omit<Labour,"id">) => Promise<void>;
  updateLabour: (id: string, l: Partial<Labour>) => Promise<void>;
  deleteLabour: (id: string) => Promise<void>;
  addLabourPayment: (p: Omit<LabourPayment,"id">) => Promise<void>;
  updateLabourPayment: (id: string, p: Partial<LabourPayment>) => Promise<void>;
  deleteLabourPayment: (id: string) => Promise<void>;
  addVendor: (v: Omit<Vendor,"id">) => Promise<void>;
  updateVendor: (id: string, v: Partial<Vendor>) => Promise<void>;
  deleteVendor: (id: string) => Promise<void>;
  addMaterialPurchase: (p: Omit<MaterialPurchase,"id">) => Promise<void>;
  updateMaterialPurchase: (id: string, p: Partial<MaterialPurchase>) => Promise<void>;
  deleteMaterialPurchase: (id: string) => Promise<void>;
  addExpense: (e: Omit<Expense,"id">) => Promise<void>;
  updateExpense: (id: string, e: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addPartner: (p: Omit<Partner,"id">) => Promise<void>;
  updatePartner: (id: string, p: Partial<Partner>) => Promise<void>;
  deletePartner: (id: string) => Promise<void>;
  addProjectPartner: (p: Omit<ProjectPartner,"id">) => Promise<void>;
  updateProjectPartner: (id: string, p: Partial<ProjectPartner>) => Promise<void>;
  deleteProjectPartner: (id: string) => Promise<void>;
  addProperty: (p: Omit<Property,"id">) => Promise<void>;
  updateProperty: (id: string, p: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  addSale: (s: Omit<Sale,"id">) => Promise<void>;
  updateSale: (id: string, s: Partial<Sale>) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  addPurchasedLand: (p: Omit<PurchasedLand,"id">) => Promise<void>;
  updatePurchasedLand: (id: string, p: Partial<PurchasedLand>) => Promise<void>;
  deletePurchasedLand: (id: string) => Promise<void>;
  addProjectLandAssignment: (a: Omit<ProjectLandAssignment,"id">) => Promise<void>;
  deleteProjectLandAssignment: (id: string) => Promise<void>;
  addLandSale: (s: Omit<LandSale,"id"|"constructionStatus">) => Promise<void>;
  updateLandSale: (id: string, s: Partial<LandSale>) => Promise<void>;
  deleteLandSale: (id: string) => Promise<void>;
  startConstructionFromLandSale: (landSaleId: string, projectData: Omit<Project,"id">) => Promise<Project>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

async function api(url: string, options?: RequestInit) {
  const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...options });
  if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || `HTTP ${res.status}`); }
  return res.json();
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [labours, setLabours] = useState<Labour[]>([]);
  const [labourPayments, setLabourPayments] = useState<LabourPayment[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [materialPurchases, setMaterialPurchases] = useState<MaterialPurchase[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [projectPartners, setProjectPartners] = useState<ProjectPartner[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [purchasedLands, setPurchasedLands] = useState<PurchasedLand[]>([]);
  const [projectLandAssignments, setProjectLandAssignments] = useState<ProjectLandAssignment[]>([]);
  const [landSales, setLandSales] = useState<LandSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const [p, l, lp, v, mp, e, par, pp, prop, s, pl, pla, ls] = await Promise.all([
        api("/api/projects"), api("/api/labours"), api("/api/labour-payments"),
        api("/api/vendors"), api("/api/material-purchases"), api("/api/expenses"),
        api("/api/partners"), api("/api/project-partners"),
        api("/api/properties"), api("/api/sales"),
        api("/api/purchased-lands"), api("/api/project-land-assignments"),
        api("/api/land-sales"),
      ]);
      setProjects(p); setLabours(l); setLabourPayments(lp); setVendors(v);
      setMaterialPurchases(mp); setExpenses(e); setPartners(par);
      setProjectPartners(pp); setProperties(prop); setSales(s);
      setPurchasedLands(pl); setProjectLandAssignments(pla); setLandSales(ls);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { refreshData(); }, [refreshData]);

  const stats: Stats = {
    totalProjects: projects.length,
    labourCost: labourPayments.reduce((s,p) => s+p.amount, 0),
    materialCost: materialPurchases.reduce((s,p) => s+p.total, 0),
    transportCost: expenses.filter(e => e.category==="transport").reduce((s,e) => s+e.amount, 0),
    totalExpenses: expenses.reduce((s,e) => s+e.amount, 0),
    totalProjectCost: labourPayments.reduce((s,p) => s+p.amount, 0) + materialPurchases.reduce((s,p) => s+p.total, 0) + expenses.reduce((s,e) => s+e.amount, 0),
  };

  // Generic CRUD factory
  function crud<T extends { id: string }>(setter: React.Dispatch<React.SetStateAction<T[]>>, base: string) {
    return {
      add: async (item: Omit<T,"id">) => { const c = await api(base, { method:"POST", body: JSON.stringify(item) }); setter(p => [c, ...p]); },
      update: async (id: string, item: Partial<T>) => { const u = await api(`${base}/${id}`, { method:"PUT", body: JSON.stringify(item) }); setter(p => p.map(x => x.id===id ? {...x,...u} : x)); },
      remove: async (id: string) => { await api(`${base}/${id}`, { method:"DELETE" }); setter(p => p.filter(x => x.id!==id)); },
    };
  }

  const pc = crud<Project>(setProjects, "/api/projects");
  const lc = crud<Labour>(setLabours, "/api/labours");
  const lpc = crud<LabourPayment>(setLabourPayments, "/api/labour-payments");
  const vc = crud<Vendor>(setVendors, "/api/vendors");
  const mpc = crud<MaterialPurchase>(setMaterialPurchases, "/api/material-purchases");
  const ec = crud<Expense>(setExpenses, "/api/expenses");
  const parc = crud<Partner>(setPartners, "/api/partners");
  const ppc = crud<ProjectPartner>(setProjectPartners, "/api/project-partners");
  const propc = crud<Property>(setProperties, "/api/properties");
  const plc = crud<PurchasedLand>(setPurchasedLands, "/api/purchased-lands");

  // Land assignments: add/remove also needs to refresh purchased land usage numbers,
  // since used_area/available_area on the plot are recalculated server-side by a DB trigger.
  const addProjectLandAssignment = async (a: Omit<ProjectLandAssignment,"id">) => {
    const c = await api("/api/project-land-assignments", { method:"POST", body: JSON.stringify(a) });
    setProjectLandAssignments(p => [c, ...p]);
    const updatedPlot = await api(`/api/purchased-lands/${a.purchasedLandId}`);
    setPurchasedLands(p => p.map(x => x.id === updatedPlot.id ? updatedPlot : x));
  };
  const deleteProjectLandAssignment = async (id: string) => {
    const assignment = projectLandAssignments.find(x => x.id === id);
    await api(`/api/project-land-assignments/${id}`, { method:"DELETE" });
    setProjectLandAssignments(p => p.filter(x => x.id !== id));
    if (assignment?.purchasedLandId) {
      const updatedPlot = await api(`/api/purchased-lands/${assignment.purchasedLandId}`);
      setPurchasedLands(p => p.map(x => x.id === updatedPlot.id ? updatedPlot : x));
    }
  };

  // Land sales: selling a portion of a purchased plot to a customer.
  // Also refreshes the purchased land's used/available area, since the
  // database recalculates that automatically when a land_sale is written.
  const addLandSale = async (s: Omit<LandSale,"id"|"constructionStatus">) => {
    const c = await api("/api/land-sales", { method:"POST", body: JSON.stringify(s) });
    setLandSales(p => [c, ...p]);
    const updatedPlot = await api(`/api/purchased-lands/${s.purchasedLandId}`);
    setPurchasedLands(p => p.map(x => x.id === updatedPlot.id ? updatedPlot : x));
  };
  const updateLandSale = async (id: string, s: Partial<LandSale>) => {
    const u = await api(`/api/land-sales/${id}`, { method:"PUT", body: JSON.stringify(s) });
    setLandSales(p => p.map(x => x.id===id ? {...x,...u} : x));
  };
  const deleteLandSale = async (id: string) => {
    const sale = landSales.find(x => x.id===id);
    await api(`/api/land-sales/${id}`, { method:"DELETE" });
    setLandSales(p => p.filter(x => x.id!==id));
    if (sale?.purchasedLandId) {
      const updatedPlot = await api(`/api/purchased-lands/${sale.purchasedLandId}`);
      setPurchasedLands(p => p.map(x => x.id === updatedPlot.id ? updatedPlot : x));
    }
  };

  // "Start Construction" / "Convert to Construction Project": creates a new
  // Construction Project carrying forward the Land Sale's customer/plot info,
  // and links the two records together in both directions.
  const startConstructionFromLandSale = async (landSaleId: string, projectData: Omit<Project,"id">) => {
    const project = await api("/api/projects", {
      method: "POST",
      body: JSON.stringify({ ...projectData, landSaleId }),
    });
    setProjects(p => [project, ...p]);
    const updatedSale = await api(`/api/land-sales/${landSaleId}`);
    setLandSales(p => p.map(x => x.id === landSaleId ? updatedSale : x));
    return project as Project;
  };

  // Sales need special handling (also updates property status)
  const addSale = async (s: Omit<Sale,"id">) => {
    const c = await api("/api/sales", { method:"POST", body: JSON.stringify(s) });
    setSales(p => [c, ...p]);
    setProperties(p => p.map(x => x.id===s.propertyId ? {...x, status:"sold"} : x));
  };
  const updateSale = async (id: string, s: Partial<Sale>) => {
    const u = await api(`/api/sales/${id}`, { method:"PUT", body: JSON.stringify(s) });
    setSales(p => p.map(x => x.id===id ? {...x,...u} : x));
  };
  const deleteSale = async (id: string) => {
    const sale = sales.find(s => s.id===id);
    await api(`/api/sales/${id}`, { method:"DELETE" });
    setSales(p => p.filter(x => x.id!==id));
    if (sale?.propertyId) setProperties(p => p.map(x => x.id===sale.propertyId ? {...x, status:"available"} : x));
  };

  return (
    <DataContext.Provider value={{
      projects, labours, labourPayments, vendors, materialPurchases, expenses,
      partners, projectPartners, properties, sales,
      stats, loading, error,
      addProject: pc.add, updateProject: pc.update, deleteProject: pc.remove,
      addLabour: lc.add, updateLabour: lc.update, deleteLabour: lc.remove,
      addLabourPayment: lpc.add, updateLabourPayment: lpc.update, deleteLabourPayment: lpc.remove,
      addVendor: vc.add, updateVendor: vc.update, deleteVendor: vc.remove,
      addMaterialPurchase: mpc.add, updateMaterialPurchase: mpc.update, deleteMaterialPurchase: mpc.remove,
      addExpense: ec.add, updateExpense: ec.update, deleteExpense: ec.remove,
      addPartner: parc.add, updatePartner: parc.update, deletePartner: parc.remove,
      addProjectPartner: ppc.add, updateProjectPartner: ppc.update, deleteProjectPartner: ppc.remove,
      addProperty: propc.add, updateProperty: propc.update, deleteProperty: propc.remove,
      addSale, updateSale, deleteSale,
      purchasedLands, projectLandAssignments, landSales,
      addPurchasedLand: plc.add, updatePurchasedLand: plc.update, deletePurchasedLand: plc.remove,
      addProjectLandAssignment, deleteProjectLandAssignment,
      addLandSale, updateLandSale, deleteLandSale, startConstructionFromLandSale,
      refreshData,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextType {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside DataProvider");
  return ctx;
}
