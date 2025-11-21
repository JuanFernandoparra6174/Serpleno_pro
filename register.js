
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://emdqrzcktxccxnmtodro.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtZHFyemNrdHhjY3hubXRvZHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2Njk4NjEsImV4cCI6MjA3OTI0NTg2MX0.lTy-cWj0Q7IE6J4FEwFvIr4A9HjWwsN1KUUqoujonXg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
/* =======================================================
   REGISTER — Frontend
======================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const msg = document.getElementById("regMsg");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    msg.style.display = "none";

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!name || !email || !password) {
      return showMsg("Completa todos los campos", true);
    }

    try {
      const res = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const j = await res.json();

      if (!j.ok) {
        return showMsg(j.error || "No se pudo registrar", true);
      }

      showMsg("Registro exitoso. Redirigiendo...", false);

      // Redirige al login
      setTimeout(() => {
        window.location.href = "/login.html";
      }, 1200);

    } catch (err) {
      showMsg("Error de conexión con el servidor", true);
    }
  });

  function showMsg(text, danger = false) {
    msg.textContent = text;
    msg.className = "alert " + (danger ? "danger" : "success");
    msg.style.display = "block";
  }
});

