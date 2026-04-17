import { useRouter } from "next/router";
import { useEffect, useState } from "react";
// import Invitation from "../../components/Invitation";
import CinematicInvitation from "../../components/CinematicInvitation";
export default function InvitePage() {
  const router = useRouter();
  const { id } = router.query;

  const [guest, setGuest] = useState(null);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/invite/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setGuest)
      .catch(() => setInvalid(true));
  }, [id]);

  if (invalid) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        ❌ Invalid Invitation Link
      </div>
    );
  }

  if (!guest) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <CinematicInvitation
      guestName={guest.name}
      guestData={guest}
      guestId={id} // ✅ THIS FIXES EVERYTHING
    />
  );
}
