import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "../context/LanguageContext";
import { useCallStories } from "../hooks/queries";
import { useShareStory } from "../hooks/mutations";
import { extractError } from "../lib/api";
import Avatar from "./ui/Avatar";
import Spinner from "./ui/Spinner";
import { formatDate } from "../lib/format";

export default function CallStories({ callId, canShare }: { callId: number; canShare: boolean }) {
  const { t, lang } = useLanguage();
  const { data: stories = [] } = useCallStories(callId);
  const share = useShareStory(callId);

  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    setError(null);
    const fd = new FormData();
    fd.append("body", body);
    if (image) fd.append("image", image);
    share.mutate(fd, {
      onSuccess: () => {
        toast.success(t("stories.success"));
        setOpen(false);
        setBody("");
        setImage(null);
        setPreview(null);
      },
      onError: (err) => setError(extractError(err)),
    });
  };

  return (
    <div className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">{t("stories.title")}</h2>
        {canShare && !open && (
          <button onClick={() => setOpen(true)} className="btn-secondary text-sm">
            ✍️ {t("stories.share")}
          </button>
        )}
      </div>

      {canShare && open && (
        <div className="card mb-4 space-y-2 p-4">
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <textarea
            className="input"
            rows={3}
            placeholder={t("stories.placeholder")}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <label className="block text-sm text-gray-500">
            {t("stories.photo")}
            <input
              type="file"
              accept="image/*"
              className="mt-1 block text-xs"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setImage(f);
                setPreview(f ? URL.createObjectURL(f) : null);
              }}
            />
          </label>
          {preview && <img src={preview} alt="" className="h-28 rounded-lg object-cover" />}
          <div className="flex justify-end gap-2">
            <button onClick={() => setOpen(false)} className="btn-ghost">
              {t("common.cancel")}
            </button>
            <button onClick={submit} disabled={!body || share.isPending} className="btn-primary">
              {share.isPending ? <Spinner className="h-4 w-4 text-white" /> : t("stories.submit")}
            </button>
          </div>
        </div>
      )}

      {stories.length === 0 ? (
        <p className="text-sm text-gray-400">{t("stories.empty")}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {stories.map((s) => (
            <div key={s.id} className="card overflow-hidden">
              {s.image && <img src={s.image} alt="" className="h-40 w-full object-cover" />}
              <div className="p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">“{s.body}”</p>
                <div className="mt-3 flex items-center gap-2">
                  <Avatar name={s.author?.name ?? "?"} src={s.author?.avatar} size={28} />
                  <span className="text-xs font-medium">{s.author?.name}</span>
                  <span className="text-xs text-gray-400">· {formatDate(s.created_at, lang)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
