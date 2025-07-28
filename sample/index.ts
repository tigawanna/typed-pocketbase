import 'dotenv/config';
import { TypedPocketBase, eq, or , } from '../src/index.js';
import { Schema } from './types/pb-types.js';

export const pb = new TypedPocketBase<Schema>(process.env.PB_URL);

const email = process.env.PB_TYPEGEN_EMAIL;
const password = process.env.PB_TYPEGEN_PASSWORD;
if (!email || !password) {
  throw new Error('Missing environment variables: PB_TYPEGEN_EMAIL or PB_TYPEGEN_PASSWORD');
}
await pb.from("_superusers").authWithPassword(email, password);

const watchlist = await pb.from('watchlist_items')
.getList(1, 10,{
    filter: or(eq('media_type', "movie"),eq("added_by","admin")),
})
.then((res) => {
    return res.items;
})
.catch((err) => {
    console.error('Error fetching watchlist:', err);
});

console.log('Watchlist:', watchlist);

// select type is generating an array of literal strings instrad of just ieteral strings and single relations are being generated as arrays too
