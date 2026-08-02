import ProjectReportDashboard from "@/components/reports/ProjectReportDashboard"

export default function ProjectReportPage({ params }: { params: { id: string } }) {
  return <ProjectReportDashboard projectId={params.id} />
}
