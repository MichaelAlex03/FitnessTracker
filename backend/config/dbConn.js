const { createClient } = require('@supabase/supabase-js')

const connectionString = process.env.DATABASE_URL;
const anonKey = process.env.ANON_KEY;

const supabase = createClient(connectionString, anonKey);

module.exports = supabase;