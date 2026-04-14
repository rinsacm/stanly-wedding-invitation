import Invitation from "../components/Invitation";

export default function Home() {
  return (
    <main>
      <Invitation couple={{ a: "Stanly", b: "Anisha" }} />
    </main>
  );
}
