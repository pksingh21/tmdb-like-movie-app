import axios from "axios";
import { SUPABASE_URL } from "../../initSupabase";
const instance = axios.create({
  baseURL: SUPABASE_URL,
});

export default instance;
