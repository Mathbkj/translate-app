var createClient = require("@supabase/supabase-js").createClient;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

module.exports = { supabase: createClient(supabaseUrl, supabaseKey) };
