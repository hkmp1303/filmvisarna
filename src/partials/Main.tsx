import { Outlet } from "react-router-dom";
import type { User } from '../utilities/types';

interface MainProps {
  user: User | null;
  setUser: (user: User | null) => void;
}
export default function Main({ user, setUser }: MainProps) {
  return (
    <main>
      <Outlet context={{ user, setUser }} />
    </main>
  );
}