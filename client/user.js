
export async function loadUser() {
  try {
    const res = await fetch("/server/project_rainfall_function/me");

    if (res.status === 401) {
      window.location.replace("/__catalyst/auth/login");
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    window.location.replace("/__catalyst/auth/login");
    return null;
  }
}
