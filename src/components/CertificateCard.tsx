import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "../context/LanguageContext";
import { formatDate } from "../lib/format";
import type { Certificate } from "../types";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

export default function CertificateCard({ certificate }: { certificate: Certificate }) {
  const { t, lang } = useLanguage();
  const [copied, setCopied] = useState(false);

  const verifyUrl = `${window.location.origin}/sertifikat/${certificate.code}`;
  const pdfUrl = `${API}/certificates/${certificate.code}/pdf`;
  const linkedinUrl =
    `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME` +
    `&name=${encodeURIComponent(certificate.call?.title ?? "BIP TECH certificate")}` +
    `&organizationName=${encodeURIComponent(certificate.organization ?? "BIP TECH")}` +
    `&certUrl=${encodeURIComponent(verifyUrl)}&certId=${certificate.code}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    toast.success(t("cert.copied"));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-card dark:border-brand-900/40 dark:bg-gray-900">
      {/* Certificate visual */}
      <div className="border-8 border-brand-600 p-1">
        <div className="rounded-sm border border-brand-100 px-6 py-8 text-center dark:border-brand-900/40">
          <p className="text-xl font-extrabold tracking-widest text-brand-600">VOCA</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-gray-400">{t("cert.title")}</p>

          <p className="mt-6 text-sm text-gray-500">{t("cert.issuedTo")}</p>
          <p className="mt-1 text-2xl font-bold text-brand-700 dark:text-brand-300">
            {certificate.recipient ?? "—"}
          </p>

          <p className="mt-4 text-gray-700 dark:text-gray-300">
            {t("cert.participatedIn")} <strong>{certificate.call?.title}</strong>
          </p>
          {certificate.organization && (
            <p className="text-sm text-gray-500">
              {t("cert.organizedBy")} {certificate.organization}
            </p>
          )}

          <div className="mt-6 flex justify-between text-[11px] text-gray-400">
            <span>
              {t("cert.issued")}: {formatDate(certificate.issued_at, lang)}
            </span>
            <span>
              {t("cert.code")}: {certificate.code}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 border-t border-gray-100 p-4 dark:border-gray-800">
        <a href={pdfUrl} target="_blank" rel="noreferrer" className="btn-primary text-sm">
          ⬇ {t("cert.download")}
        </a>
        <a href={linkedinUrl} target="_blank" rel="noreferrer" className="btn-secondary text-sm">
          in {t("cert.addLinkedin")}
        </a>
        <button onClick={copyLink} className="btn-ghost text-sm">
          {copied ? `✓ ${t("cert.copied")}` : `🔗 ${t("cert.copyLink")}`}
        </button>
      </div>
    </div>
  );
}
