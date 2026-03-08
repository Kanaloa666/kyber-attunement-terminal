const $ = (id) => document.getElementById(id);

function staticGlitch() {
  const el = $("static");
  el.classList.remove("on");
  void el.offsetWidth;
  el.classList.add("on");
  setTimeout(() => el.classList.remove("on"), 500);
}

function go(pageToShow) {
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => page.classList.add("hidden"));
  $(pageToShow).classList.remove("hidden");
}

function randId() {
  const a = Math.random().toString(36).slice(2, 6).toUpperCase();
  const b = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BSP-${a}${b}`;
}

document.addEventListener("DOMContentLoaded", () => {
  $("sessionId").textContent = randId();

  go("p1");

  $("beginBtn").addEventListener("click", () => {
    staticGlitch();
    go("p2");
  });

  $("resetBtn").addEventListener("click", () => {
    staticGlitch();
    go("p1");
  });
});
