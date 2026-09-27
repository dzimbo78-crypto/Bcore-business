import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowUpRight,
  Eye,
  EyeOff,
  ImagePlus,
  LogOut,
  Mail,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Brand } from "@/components/layout/Navbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { isStandalonePreview } from "@/lib/preview";

type Product = {
  id: number;
  title: string;
  description: string | null;
  imageBase64: string | null;
  location: string | null;
  minOrder: string | null;
  price: string | null;
  currency: string | null;
  category: string | null;
  active: boolean;
};
type OfferForm = {
  title: string;
  description: string;
  imageBase64: string;
  location: string;
  minOrder: string;
  price: string;
  currency: string;
  category: string;
  active: boolean;
};
const empty: OfferForm = {
  title: "",
  description: "",
  imageBase64: "",
  location: "",
  minOrder: "",
  price: "",
  currency: "EUR",
  category: "",
  active: true,
};
const fields = [
  ["title", "Nazwa oferty", "np. Okna aluminiowe na wymiar", 180],
  ["price", "Cena", "np. Na zapytanie", 100],
  ["location", "Lokalizacja", "np. Gdańsk, Polska", 200],
  ["minOrder", "Minimalne zamówienie", "np. 10 sztuk", 100],
  ["category", "Kategoria", "np. Okna, Technologie, Surowce", 100],
] as const;
const message = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "Nie udało się wykonać operacji. Spróbuj ponownie.";

export default function Admin() {
  const [admin, setAdmin] = useState<boolean | null>(null),
    [password, setPassword] = useState("");
  const [error, setError] = useState(""),
    [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]),
    [contact, setContact] = useState<{
      recipient: string;
      configured: boolean;
    } | null>(null);
  const [open, setOpen] = useState(false),
    [editing, setEditing] = useState<number | null>(null),
    [deleting, setDeleting] = useState<number | null>(null);
  const [form, setForm] = useState<OfferForm>(empty);
  const fileInput = useRef<HTMLInputElement>(null);

  const request = useCallback(
    async <T,>(path: string, options: RequestInit = {}): Promise<T> => {
      const response = await fetch(`${import.meta.env.BASE_URL}api${path}`, {
        ...options,
        credentials: "same-origin",
        signal: AbortSignal.timeout(20000),
        headers: { "Content-Type": "application/json", ...options.headers },
      });
      if (response.status === 401) {
        if (path !== "/admin/login") setAdmin(false);
        throw new Error(
          path === "/admin/login"
            ? "Nieprawidłowe hasło."
            : "Sesja wygasła. Zaloguj się ponownie.",
        );
      }
      if (response.status === 429)
        throw new Error(
          "Zbyt wiele prób. Odczekaj kilkanaście minut i spróbuj ponownie.",
        );
      if (!response.ok)
        throw new Error(
          response.status === 400
            ? "Sprawdź wpisane dane i rozmiar zdjęcia."
            : "Nie udało się wykonać operacji. Sprawdź połączenie i konfigurację serwera.",
        );
      return response.json();
    },
    [],
  );
  useEffect(() => {
    if (isStandalonePreview) {
      setAdmin(false);
      return;
    }
    request<{ admin: boolean }>("/admin/me")
      .then((data) => setAdmin(data.admin === true))
      .catch(() => setAdmin(false));
  }, [request]);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [offers, status] = await Promise.all([
        request<Product[]>("/products/all"),
        request<{ recipient: string; configured: boolean }>(
          "/admin/contact-status",
        ),
      ]);
      if (!Array.isArray(offers))
        throw new Error("Nieprawidłowa odpowiedź serwera.");
      setProducts(offers);
      setContact(status);
      setError("");
    } catch (e) {
      setError(message(e));
    } finally {
      setLoading(false);
    }
  }, [request]);
  useEffect(() => {
    if (admin) void load();
  }, [admin, load]);
  const login = async (event: FormEvent) => {
    event.preventDefault();
    if (isStandalonePreview) return;
    setBusy(true);
    setError("");
    try {
      await request("/admin/login", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      setPassword("");
      setAdmin(true);
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  };
  const logout = async () => {
    setBusy(true);
    try {
      await request("/admin/logout", { method: "POST" });
      setAdmin(false);
      setProducts([]);
      setContact(null);
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  };
  const edit = (product?: Product) => {
    setEditing(product?.id ?? null);
    setFormError("");
    setForm(
      product
        ? (Object.fromEntries(
            Object.keys(empty).map((key) => [
              key,
              product[key as keyof Product] ?? empty[key as keyof OfferForm],
            ]),
          ) as OfferForm)
        : { ...empty },
    );
    setOpen(true);
  };
  const imageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setFormError("Wybierz zdjęcie JPG, PNG lub WEBP o rozmiarze do 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, imageBase64: String(reader.result) }));
      setFormError("");
    };
    reader.onerror = () => setFormError("Nie udało się odczytać zdjęcia.");
    reader.readAsDataURL(file);
  };
  const save = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setFormError("");
    try {
      await request(editing ? `/products/${editing}` : "/products", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(form),
      });
      setOpen(false);
      await load();
    } catch (e) {
      setFormError(message(e));
    } finally {
      setBusy(false);
    }
  };
  const mutate = async (product: Product, remove = false) => {
    setBusy(true);
    setError("");
    try {
      await request(`/products/${product.id}`, {
        method: remove ? "DELETE" : "PUT",
        ...(remove
          ? {}
          : { body: JSON.stringify({ ...product, active: !product.active }) }),
      });
      setDeleting(null);
      await load();
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bcore-site admin-site">
      <header className="admin-header">
        <Brand />
        {admin ? (
          <button className="text-link" disabled={busy} onClick={logout}>
            <LogOut size={17} />
            Wyloguj
          </button>
        ) : (
          <Link href="/" className="text-link">
            <ArrowLeft size={17} />
            Wróć do strony
          </Link>
        )}
      </header>
      {admin === null ? (
        <main className="admin-login">
          <p role="status">Sprawdzanie sesji…</p>
        </main>
      ) : !admin ? (
        <main className="admin-login">
          <p className="eyebrow">B-CORE / ADMINISTRATION</p>
          <h1>
            Twoje centrum
            <br />
            <span>możliwości.</span>
          </h1>
          <p>Zarządzaj ofertami w sekcji „Rozwiązania dla biznesu”.</p>
          {isStandalonePreview ? (
            <div className="admin-notice">
              To podgląd projektu. Logowanie i zapis ofert będą dostępne po
              uruchomieniu serwera oraz bazy danych zgodnie z instrukcją w
              paczce.
            </div>
          ) : (
            <form onSubmit={login} className="admin-form">
              <label>
                Hasło administratora
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  maxLength={1024}
                />
              </label>
              {error && (
                <p role="alert" className="admin-error">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="button button-copper"
                disabled={busy}
              >
                {busy ? "Logowanie…" : "Zaloguj się"}
                <ArrowUpRight size={18} />
              </button>
            </form>
          )}
        </main>
      ) : (
        <main className="admin-content container">
          <div className="admin-top">
            <div>
              <p className="eyebrow">BUSINESS SOLUTIONS</p>
              <h1>Oferty i możliwości</h1>
              <p>
                {products.length} ofert ·{" "}
                {products.filter((p) => p.active).length} widocznych na stronie
              </p>
            </div>
            <button className="button button-copper" onClick={() => edit()}>
              <Plus size={18} />
              Dodaj ofertę
            </button>
          </div>
          <section className="admin-contact">
            <Mail size={22} />
            <div>
              <h2>Wiadomości z formularza</h2>
              <p>{contact?.recipient || "Sprawdzanie konfiguracji…"}</p>
              <small>
                {contact
                  ? contact.configured
                    ? "Ustawienia poczty są dostępne. Dostarczanie wiadomości sprawdzisz po wysłaniu zapytania ze strony."
                    : "Uzupełnij RESEND_API_KEY i RESEND_FROM_EMAIL w ustawieniach Rendera."
                  : ""}{" "}
                Adres odbiorczy zmienisz przez CONTACT_TO_EMAIL.
              </small>
            </div>
            <Link href="/kontakt" className="text-link">
              Otwórz formularz
              <ArrowUpRight size={18} />
            </Link>
          </section>
          {error && (
            <div className="admin-error" role="alert">
              {error}
              <button className="text-link" onClick={load}>
                Spróbuj ponownie
              </button>
            </div>
          )}
          {loading ? (
            <p className="admin-notice" role="status">
              Wczytywanie ofert…
            </p>
          ) : products.length === 0 ? (
            <div className="admin-empty">
              <ImagePlus size={32} />
              <h2>Miejsce na Twoją pierwszą ofertę</h2>
              <p>
                Dodaj zdjęcie, opis i kategorię. Sam decydujesz, kiedy oferta
                będzie publiczna.
              </p>
              <button className="text-link" onClick={() => edit()}>
                Dodaj ofertę
                <Plus size={18} />
              </button>
            </div>
          ) : (
            <div className="admin-offers">
              {products.map((product) => (
                <article key={product.id} className="admin-offer">
                  <div className="admin-thumbnail">
                    {product.imageBase64 ? (
                      <img src={product.imageBase64} alt={product.title} />
                    ) : (
                      <ImagePlus size={25} />
                    )}
                  </div>
                  <div className="admin-offer-copy">
                    <span className="eyebrow">
                      {product.active ? "PUBLICZNA" : "UKRYTA"}
                      {product.category ? ` / ${product.category}` : ""}
                    </span>
                    <h2>{product.title}</h2>
                    {product.description && <p>{product.description}</p>}
                    <small>
                      {[
                        product.price &&
                          `${product.price} ${product.currency || ""}`,
                        product.location,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </small>
                  </div>
                  <div className="admin-offer-actions">
                    <button
                      disabled={busy}
                      title={product.active ? "Ukryj ofertę" : "Pokaż ofertę"}
                      aria-label={
                        product.active
                          ? `Ukryj: ${product.title}`
                          : `Pokaż: ${product.title}`
                      }
                      onClick={() => mutate(product)}
                    >
                      {product.active ? (
                        <Eye size={18} />
                      ) : (
                        <EyeOff size={18} />
                      )}
                    </button>
                    <button
                      onClick={() => edit(product)}
                      title="Edytuj ofertę"
                      aria-label={`Edytuj: ${product.title}`}
                    >
                      <Pencil size={17} />
                    </button>
                    <button
                      disabled={busy}
                      onClick={() => setDeleting(product.id)}
                      title="Usuń ofertę"
                      aria-label={`Usuń: ${product.title}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                  {deleting === product.id && (
                    <div className="admin-delete">
                      <span>Usunąć ofertę „{product.title}”?</span>
                      <button
                        disabled={busy}
                        onClick={() => mutate(product, true)}
                      >
                        Usuń
                      </button>
                      <button onClick={() => setDeleting(null)}>Anuluj</button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
          <Link href="/rozwiazania-dla-biznesu#oferty" className="text-link">
            Zobacz oferty na stronie
            <ArrowUpRight size={18} />
          </Link>
        </main>
      )}
      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!busy) setOpen(value);
        }}
      >
        <DialogContent className="admin-editor">
          <DialogTitle>{editing ? "Edytuj ofertę" : "Nowa oferta"}</DialogTitle>
          <DialogDescription>
            Dodaj szczegóły i zdecyduj o widoczności oferty.
          </DialogDescription>
          <form onSubmit={save} className="admin-form">
            <div className="admin-upload">
              {form.imageBase64 ? (
                <>
                  <img src={form.imageBase64} alt="Podgląd zdjęcia oferty" />
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => setForm((f) => ({ ...f, imageBase64: "" }))}
                  >
                    Usuń zdjęcie
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                >
                  <ImagePlus size={30} />
                  <span>Dodaj zdjęcie</span>
                  <small>JPG, PNG lub WEBP · do 5 MB</small>
                </button>
              )}
              <input
                ref={fileInput}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={imageChange}
                aria-label="Zdjęcie oferty"
                className="sr-only"
              />
            </div>
            {fields.map(([key, label, placeholder, max]) => (
              <label key={key}>
                {label}
                {key === "title" ? " *" : ""}
                <input
                  value={form[key]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  placeholder={placeholder}
                  required={key === "title"}
                  maxLength={max}
                />
              </label>
            ))}
            <label>
              Waluta
              <select
                value={form.currency}
                onChange={(e) =>
                  setForm((f) => ({ ...f, currency: e.target.value }))
                }
              >
                {["EUR", "PLN", "DKK", "GBP", "USD", ""].map((currency) => (
                  <option key={currency} value={currency}>
                    {currency || "Nie dotyczy"}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Opis
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={5}
                maxLength={10000}
                placeholder="Opisz rozwiązanie, dostępność i warunki współpracy."
              />
            </label>
            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) =>
                  setForm((f) => ({ ...f, active: e.target.checked }))
                }
              />
              Widoczna na stronie
            </label>
            {formError && (
              <p className="admin-error" role="alert">
                {formError}
              </p>
            )}
            <div className="admin-editor-actions">
              <button
                type="button"
                className="text-link"
                disabled={busy}
                onClick={() => setOpen(false)}
              >
                Anuluj
              </button>
              <button
                type="submit"
                className="button button-copper"
                disabled={busy}
              >
                {busy ? "Zapisywanie…" : "Zapisz ofertę"}
                <ArrowUpRight size={18} />
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
