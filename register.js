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
        password,
        options: {
          data: { name } // metadata opcional
        }
      });

    if (authError) {
      console.error("Error en signUp:", authError);
      return showMsg(authError.message || "Error al registrar en Auth", true);
    }

    const uid = authData.user?.id; // UUID de auth.users

    // =============================
    // 2. Insertar datos extra en tabla 'users'
    //    OJO: no mandamos 'id' (es SERIAL)
    //    y password_hash es solo un placeholder
    // =============================
    const { error: insertError } = await supabase
      .from("users")
      .insert({
        // id: lo genera el SERIAL
        name: name,
        email: email,
        password_hash: "managed_by_supabase_auth",
        role: "cliente",
        // puedes dejar plan/area/etc como NULL
      });

    if (insertError) {
      console.error("Error al insertar en users:", insertError);
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

  function showMsg(text, danger = false) {
    msg.textContent = text;
    msg.className = "alert " + (danger ? "danger" : "success");
    msg.style.display = "block";
  }
});
