import { useState } from "react";
import { toast } from "sonner";
import Modal from "./ui/Modal";
import Spinner from "./ui/Spinner";
import { useLanguage } from "../context/LanguageContext";

interface AiResult {
  text: string;
  source: string;
}

interface Props {
  label: string;
  title: string;
  generate: () => Promise<AiResult>;
  className?: string;
}

// Button that runs an AI generation and shows the result in a modal.
export default function AiTextButton({ label, title, generate, className = "btn-secondary" }: Props) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [isTemplate, setIsTemplate] = useState(false);

  const run = async () => {
    setOpen(true);
    setLoading(true);
    setText("");
    try {
      const res = await generate();
      setText(res.text);
      setIsTemplate(res.source === "template");
    } catch {
      setText("⚠️");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    toast.success(t("ai.copied"));
  };

  return (
    <>
      <button type="button" onClick={run} className={`${className} text-sm`}>
        ✨ {label}
      </button>

      <Modal open={open} onClose={() => setOpen(false)} maxWidth="max-w-lg">
        <h2 className="mb-3 text-lg font-bold">✨ {title}</h2>
        {loading ? (
          <div className="flex items-center gap-2 py-8 text-sm text-gray-500">
            <Spinner className="h-5 w-5" /> {t("ai.thinking")}
          </div>
        ) : (
          <>
            <textarea
              readOnly
              value={text}
              rows={12}
              className="input w-full whitespace-pre-wrap font-mono text-xs"
            />
            {isTemplate && <p className="mt-2 text-xs text-gray-400">{t("ai.templateNote")}</p>}
            <div className="mt-3 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="btn-ghost">
                {t("ai.close")}
              </button>
              <button onClick={copy} className="btn-primary">
                {t("ai.copy")}
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
