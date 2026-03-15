import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

export default function NotFoundPage() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="text-8xl font-extrabold text-primary/20 mb-4">404</div>
        <h1 className="text-2xl font-bold mb-2">Pagina nu a fost gasita</h1>
        <p className="text-muted-foreground mb-8">
          Pagina pe care o cauti nu exista sau a fost mutata.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="ghost" onClick={() => nav(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Inapoi
          </Button>
          <Button variant="primary" onClick={() => nav("/")}>
            <Home className="w-4 h-4 mr-2" />
            Acasa
          </Button>
        </div>
      </Motion.div>
    </div>
  );
}
