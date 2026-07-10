// app/_components/DeleteModal.tsx
interface DeleteModalProps {
  isOpen: null | boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}
export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm">
        <h2 className="text-lg font-bold text-stone-900">{title}</h2>
        <p className="text-sm text-stone-500 mt-2">{description}</p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-200 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}