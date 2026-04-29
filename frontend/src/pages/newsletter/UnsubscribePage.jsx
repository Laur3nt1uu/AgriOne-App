import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MailCheck, MailX } from "lucide-react";
import LandingLayout from "../../components/landing/LandingLayout";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import { api } from "../../api/endpoints";
import { Button } from "../../ui/button";

export default function UnsubscribePage() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [state, setState] = useState({ status: "loading", message: "" });

  useEffect(() => {
    let active = true;

    async function unsubscribe() {
      try {
        await api.newsletter.unsubscribe(token);
        if (!active) return;
        setState({
          status: "success",
          message: "Ai fost dezabonat de la newsletter-ul AgriOne.",
        });
      } catch {
        if (!active) return;
        setState({
          status: "error",
          message: "Linkul de dezabonare este invalid sau a expirat.",
        });
      }
    }

    unsubscribe();

    return () => {
      active = false;
    };
  }, [token]);

  const isSuccess = state.status === "success";
  const Icon = isSuccess ? MailCheck : MailX;

  return (
    <LandingLayout>
      <LandingNavbar />

      <section className="relative min-h-[70vh] px-4 sm:px-6 lg:px-8 pt-32 pb-20 flex items-center">
        <div className="max-w-xl mx-auto text-center">
          <div className="mx-auto mb-6 w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Icon className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {state.status === "loading" ? "Se proceseaza cererea..." : isSuccess ? "Dezabonare finalizata" : "Dezabonare nereusita"}
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-8">
            {state.status === "loading"
              ? "Te rugam sa astepti cateva secunde."
              : state.message}
          </p>
          <Button variant="primary" onClick={() => navigate("/")}>
            Inapoi la AgriOne
          </Button>
        </div>
      </section>

      <LandingFooter />
    </LandingLayout>
  );
}
