import { createRoot } from "react-dom/client";
import { installPreviewNavigation } from "./lib/preview";
import App from "./App";
import "./index.css";

installPreviewNavigation();
createRoot(document.getElementById("root")!).render(<App />);
