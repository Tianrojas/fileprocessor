
import { loadUser } from './user.js';
import { setupUpload } from './upload.js';

window.addEventListener("load", async () => {
  const user = await loadUser();

  if (!user) return;

  document.getElementById("loading").style.display = "none";
  document.getElementById("app").style.display = "block";

  document.getElementById("welcome").innerText =
    `Hello ${user.first_name || "User"} from Catalyst APP. Your role is ${user.role || "Unknown"}`;

  setupUpload();
});

