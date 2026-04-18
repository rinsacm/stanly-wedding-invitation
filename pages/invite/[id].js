import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CinematicInvitation from "../../components/CinematicInvitation";

export default function InvitePage() {
  const router = useRouter();
  const { id } = router.query;

  const [guest, setGuest] = useState(null);
  const [invalid, setInvalid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const timer = setTimeout(() => setLoading(false), 1600);

        const res = await fetch(`/api/invite/${id}`);
        if (!res.ok) throw new Error("Invalid link");

        const data = await res.json();
        setGuest(data);
        return () => clearTimeout(timer);
      } catch (e) {
        setInvalid(true);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);
  function Loader() {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#f7f0e8] relative overflow-hidden">
        <p className="font-wedding text-lg text-gray-700 text-center animate-pulse max-w-xs">
          Your invitation is being prepared...
        </p>

        <div className="mt-5 w-32 h-[2px] bg-[#d4a373] rounded-full animate-pulse"></div>

        <p className="text-xs text-gray-400 mt-4 text-center font-body">
          Please wait a moment ✨
        </p>
      </div>
    );
  }
  if (loading || !id) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (invalid || !guest) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        ❌ Invalid Invitation Link
      </div>
    );
  }

  return (
    <CinematicInvitation
      guestName={guest.name}
      guestData={guest}
      guestId={id}
    />
  );
}
