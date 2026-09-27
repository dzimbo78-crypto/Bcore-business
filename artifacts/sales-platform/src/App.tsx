import { lazy, Suspense, useEffect } from "react";
import {
  Switch,
  Route,
  Router as WouterRouter,
  Redirect,
  useLocation,
} from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider, useLanguage } from "@/i18n/context";
import { MotionPreferences } from "@/components/MotionPreferences";
import { advisory, serviceMeta } from "@/data/advisory";
import { previewRouter } from "@/lib/preview";
import Home from "./pages/home";
import Service from "./pages/service";
import ONas from "./pages/o-nas";
import Kontakt from "./pages/kontakt";
import NotFound from "./pages/not-found";
const Admin = lazy(() => import("./pages/admin"));
const queryClient = new QueryClient();
function RouteEffects() {
  const [location] = useLocation(),
    { lang } = useLanguage();
  useEffect(() => {
    document.documentElement.lang = lang;
    const index = serviceMeta.findIndex((s) => s.path === location);
    const title =
      index >= 0
        ? advisory[lang].services[index].title
        : location === "/kontakt"
          ? advisory[lang].nav[3]
          : location === "/o-nas"
            ? advisory[lang].nav[2]
            : "Advisory & Brokerage";
    document.title = `B-CORE — ${title}`;
    const description = document.querySelector('meta[name="description"]');
    if (description)
      description.setAttribute(
        "content",
        index >= 0
          ? advisory[lang].services[index].desc
          : advisory[lang].heroDesc,
      );
  }, [location, lang]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (window.location.hash) {
        document
          .getElementById(window.location.hash.slice(1))
          ?.scrollIntoView();
      } else window.scrollTo({ top: 0, behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [location]);
  return null;
}
function Router() {
  return (
    <>
      <RouteEffects />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/nieruchomosci">{() => <Service id="property" />}</Route>
        <Route path="/doradztwo-biznesowe">
          {() => <Service id="business" />}
        </Route>
        <Route path="/rozwiazania-dla-biznesu">
          {() => <Service id="solutions" />}
        </Route>
        <Route path="/konstrukcje-stalowe">
          {() => <Service id="steel" />}
        </Route>
        <Route path="/produkty">
          {() => <Redirect to="/rozwiazania-dla-biznesu" />}
        </Route>
        <Route path="/oczyszczalnie">
          {() => <Redirect to="/rozwiazania-dla-biznesu" />}
        </Route>
        <Route path="/okna-drzwi">
          {() => <Redirect to="/rozwiazania-dla-biznesu" />}
        </Route>
        <Route path="/tapicerstwo-jachtowe">
          {() => <Redirect to="/kontakt" />}
        </Route>
        <Route path="/projekty-biznesowe">
          {() => <Redirect to="/doradztwo-biznesowe" />}
        </Route>
        <Route path="/gielda-towarow">
          {() => <Redirect to="/rozwiazania-dla-biznesu" />}
        </Route>
        <Route path="/admin">
          {() => (
            <Suspense
              fallback={
                <div className="p-12" role="status">
                  Loading…
                </div>
              }
            >
              <Admin />
            </Suspense>
          )}
        </Route>
        <Route path="/o-nas" component={ONas} />
        <Route path="/kontakt" component={Kontakt} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <MotionPreferences>
            <WouterRouter
              hook={previewRouter?.hook}
              searchHook={previewRouter?.searchHook}
              base={import.meta.env.BASE_URL.replace(/\/$/, "")}
            >
              <Router />
            </WouterRouter>
            <Toaster />
          </MotionPreferences>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
