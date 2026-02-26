"use client";

import { useRouter } from "next/navigation";
import VideoEditingRequestForm from "../../../components/form/VideoEditingRequestForm";

export default function VideoEditingRequestPage() {
  const router = useRouter();

  const handleClose = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 flex items-start justify-center">
      <div className="w-full max-w-2xl">
        <VideoEditingRequestForm onClose={handleClose} />
      </div>
    </div>
  );
}
