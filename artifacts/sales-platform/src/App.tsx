import { lazy, Suspense, useEffect } from "react";
import { Switch, Route, Redirect, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider, useLanguage } from "@/i18n/context";
import { DisplayPreferences } from "@/components/DisplayPreferences";
import { MotionPreferences } from "@/components/MotionPreferences";
import { advisory, serviceMeta } from "@/data/advisory";
import { NavigationRouter } from "@/components/NavigationMotion";
import { PageLayout } from "@/components/layout/PageLayout";
import LegalPage from "./pages/legal";
import { legalCopy } from "@/data/legal";
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
            : location === "/polityka-prywatnosci"
              ? legalCopy[lang].privacy
              : location === "/regulamin"
                ? legalCopy[lang].terms
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
  return null;
}
function Router() {
  const [location] = useLocation();
  const routes = (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/nieruchomosci">{() => <Service id="property" />}</Route>
      <Route path="/doradztwo-biznesowe">
        {() => <Service id="business" />}
      </Route>
      <Route path="/rozwiazania-dla-biznesu">
        {() => <Service id="solutions" />}
      </Route>
      <Route path="/konstrukcje-stalowe">{() => <Service id="steel" />}</Route>
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
      <Route path="/polityka-prywatnosci">
        {() => <LegalPage type="privacy" />}
      </Route>
      <Route path="/regulamin">{() => <LegalPage type="terms" />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
  return (
    <>
      <RouteEffects />
      {location === "/admin" ? routes : <PageLayout>{routes}</PageLayout>}
    </>
  );
}
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <DisplayPreferences>
            <MotionPreferences>
              <NavigationRouter>
                <Router />
              </NavigationRouter>
              <Toaster />
            </MotionPreferences>
          </DisplayPreferences>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
