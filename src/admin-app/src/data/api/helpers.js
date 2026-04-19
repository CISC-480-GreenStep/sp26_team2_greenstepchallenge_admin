/**
 * Internal helpers used by every entity module.
 *
 * Kept separate so feature modules can stay focused on one table each
 * and so we can swap the error-handling strategy in one place.
 */

/**
 * Unwrap a Supabase response. Throws on error so callers can use
 * normal try/catch instead of inspecting `error` everywhere.
 *
 * @param {{ data: any, error: { message: string } | null }} response
 * @returns {any} The `data` payload.
 * @throws {Error} When Supabase returned a non-null error.
 */
export function unwrap({ data, error }) {
  if (error) throw new Error(error.message);
  return data;
}

/**
 * Clears legacy mock data left over from the localStorage-only era.
 * Wired to the Login page's "Reset Demo Data" button so a refresh
 * always starts from a known baseline.
 */
export function resetDemoData() {
  localStorage.removeItem("greenstep_admin_data");
}
