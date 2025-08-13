"use client";

type Props = {
  onFile: (files: FileList) => void;
  label: string;
};

export default function FileUpload({ onFile, label }: Props) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition">
      <label className="text-gray-600 font-medium">{label}</label>
      <input
        type="file"
        accept=".csv,.xlsx"
        onChange={(e) => e.target.files && onFile(e.target.files)}
        className="file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 cursor-pointer"
      />
    </div>
  );
}
