import JobDetailContent from "@/components/jobs/JobDetailContent";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PublicJobDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <JobDetailContent
      id={Number(id)}
      mode="public"
    />
  );
}