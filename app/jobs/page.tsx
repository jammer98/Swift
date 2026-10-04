import JobsClient from "@/components/jobs-client";

type JobsSearchParams = {
  q?: string | string[];
  location?: string | string[];
};

export default function JobsPage({
  searchParams,
}: {
  searchParams?: JobsSearchParams;
}) {
  const q = Array.isArray(searchParams?.q) ? searchParams?.q[0] : searchParams?.q;
  const location = Array.isArray(searchParams?.location)
    ? searchParams?.location[0]
    : searchParams?.location;

  return <JobsClient initialQuery={q || ""} initialLocation={location || ""} />;
}
