import { permanentRedirect } from "next/navigation";

export default function LegacyJobAgentTopicPage() {
  permanentRedirect("/applications/job_agent");
}
