export function useAdmin() {
  return new URLSearchParams(window.location.search).has("admin");
}