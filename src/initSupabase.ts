import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
export const SUPABASE_URL = process.env["supabaseUrl"]!!;
export const SUPABASE_KEY = process.env["supabaseKey"]!!;
// Better put your these secret keys in .env file
console.log(SUPABASE_KEY,SUPABASE_URL)
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  localStorage: AsyncStorage as any,
  detectSessionInUrl: false, // Prevents Supabase from evaluating window.location.href, breaking mobile
});
// async function ok() {
//   console.log(await supabase.from("now_playing").select("*"), "ok");
// }
// ok()
