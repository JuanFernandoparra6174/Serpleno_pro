
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// =============================
//  CONFIG SUPABASE
// =============================
const SUPABASE_URL = "https://emdqrzcktxccxnmtodro.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtZHFyemNrdHhjY3hubXRvZHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2Njk4NjEsImV4cCI6MjA3OTI0NTg2MX0.lTy-cWj0Q7IE6J4FEwFvIr4A9HjWwsN1KUUqoujonXg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =============================
//  REGISTER DIRECTO A SUPABASE
// =============================
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

    // =============================
    // 1. Crear usuario en AUTH
    // =============================
    const { data: authData, error: authError } =
      await supabase.auth.signUp({
        email,
        password
      });

    if (authError) {
      return showMsg(authError.message, true);
    }

    // UID del usuario
    const uid = authData.user.id;

    // =============================
    // 2. Insertar datos extra en tabla 'users'
    // =============================
    const { error: insertError } = await supabase
      .from("users")
      .insert({
        id: uid,
        name: name,
        email: email,
        role: "cliente",
      });

    if (insertError) {
      return showMsg("Error al guardar el usuario en la BD", true);
    }

    // =============================
    // 3. OK → redirigir
    // =============================
    showMsg("Registro exitoso. Redirigiendo...", false);

    setTimeout(() => {
      window.location.href = "/login.html";
    }, 1200);
  });

  // Helpers
  function showMsg(text, danger = false) {
    msg.textContent = text;
    msg.className = "alert " + (danger ? "danger" : "success");
    msg.style.display = "block";
  }
});


