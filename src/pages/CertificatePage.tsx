import { useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useCertificate } from "../hooks/queries";
import CertificateCard from "../components/CertificateCard";
import { PageSpinner } from "../components/ui/Spinner";

export default function CertificatePage() {
  const { code } = useParams();
  const { t } = useLanguage();
  const { data: certificate, isLoading, isError } = useCertificate(code);

  if (isLoading) return <PageSpinner />;
  if (isError || !certificate) {
    return <div className="py-24 text-center text-gray-500">{t("cert.notFound")}</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 animate-fade-in">
      <div className="mb-5 flex items-center justify-center gap-2 text-sm font-medium text-emerald-600">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
          ✓
        </span>
        {t("cert.verified")}
      </div>
      <CertificateCard certificate={certificate} />
    </div>
  );
}
