const { createClient } = require('@supabase/supabase-js')

const connectionString = process.env.DATABASE_URL;
const anonKey = process.env.ANON_KEY;

if (!connectionString || !anonKey) {
    console.error('Supabase URL or Key is missing.');
}
console.log(connectionString)
console.log(anonKey)
const supabase = createClient(connectionString, anonKey);
//test
module.exports = supabase;