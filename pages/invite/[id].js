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
        setLoading(true);

        const res = await fetch(`/api/invite/${id}`);
        if (!res.ok) throw new Error("Invalid link");

        const data = await res.json();
        setGuest(data);
      } catch (e) {
        setInvalid(true);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading || !id) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading invitation...
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
