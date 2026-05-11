/**
 * @file support.js
 * @summary API endpoints for Issue Tickets and Badges.
 */

import { supabase } from "../supabase";
import { unwrap } from "./helpers";

export async function getIssueTickets() {
  return unwrap(await supabase.from("tickets").select("*").order("createdAt", { ascending: false }));
}

export async function getBadges() {
  return unwrap(await supabase.from("badges").select("*").order("name", { ascending: true }));
}
