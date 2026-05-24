import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useAdminMentors } from "../hooks/queries";
import { useSaveMentor, useDeleteMentor } from "../hooks/mutations";
import { PageSpinner } from "../components/ui/Spinner";
import Avatar from "../components/ui/Avatar";
import Modal from "../components/ui/Modal";
import MentorForm from "../components/MentorForm";
import type { MentorAdmin } from "../types";

export default function AdminMentorsPage() {
  const { t } = useLanguage();
  const { data: mentors = [], isPending } = useAdminMentors();
  const del = useDeleteMentor();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<MentorAdmin | null>(null);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("adminMentors.title")}</h1>
        <button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="btn-primary"
        >
          + {t("adminMentors.add")}
        </button>
      </div>

      {isPending ? (
        <PageSpinner />
      ) : (
        <div className="card divide-y divide-gray-100 dark:divide-gray-800">
          {mentors.map((m) => (
            <div key={m.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <Avatar name={m.name} src={m.avatar} size={40} />
                <div>
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-xs text-gray-400">{m.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`chip ${
                    m.is_active
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                  }`}
                >
                  {m.is_active ? t("adminMentors.active") : t("adminMentors.pending")}
                </span>
                <ToggleActive mentor={m} />
                <button
                  onClick={() => {
                    setEditing(m);
                    setFormOpen(true);
                  }}
                  className="btn-ghost text-xs"
                >
                  {t("posts.edit")}
                </button>
                <button
                  onClick={() => confirm(`${t("posts.delete")}: ${m.name}?`) && del.mutate(m.id)}
                  className="btn-ghost text-xs text-rose-600"
                >
                  {t("posts.delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <Modal open onClose={() => setFormOpen(false)} maxWidth="max-w-lg">
          <h2 className="mb-4 text-lg font-bold">{editing ? t("posts.edit") : t("adminMentors.add")}</h2>
          <MentorForm
            mode="admin"
            initial={editing}
            onSuccess={() => setFormOpen(false)}
            onCancel={() => setFormOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}

function ToggleActive({ mentor }: { mentor: MentorAdmin }) {
  const { t } = useLanguage();
  const save = useSaveMentor(mentor.id);
  const toggle = () => {
    const fd = new FormData();
    fd.append("is_active", mentor.is_active ? "0" : "1");
    save.mutate(fd);
  };
  return (
    <button onClick={toggle} disabled={save.isPending} className="btn-ghost text-xs">
      {mentor.is_active ? t("adminMentors.deactivate") : t("adminMentors.activate")}
    </button>
  );
}
