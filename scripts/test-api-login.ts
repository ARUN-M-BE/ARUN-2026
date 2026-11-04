async function inspectDashboardPortfolio() {
  const email = "arun@arun-m.in";
  const password = "Admin@123";

  const res = await fetch("https://api.arun-m.in/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const cookies = res.headers.getSetCookie ? res.headers.getSetCookie() : [res.headers.get("set-cookie")];
  const cookieHeader = cookies.map((c: any) => c?.split(";")[0]).filter(Boolean).join("; ");

  const pageRes = await fetch("https://api.arun-m.in/api/projects/portfolio", {
    headers: { Cookie: cookieHeader },
  });
  console.log("api/projects/portfolio status:", pageRes.status);
  console.log("api/projects/portfolio response:", await pageRes.text());
}

inspectDashboardPortfolio().catch(console.error);
