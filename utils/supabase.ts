import { createClient } from '@supabase/supabase-js';

const bucket = 'main-bucket';

export const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string,
);

export const uploadFile = async (file: File) => {
  const timestamp = Date.now();
  const newName = `/users/${timestamp}-${file.name}`;
  const { data } = await supabase.storage
    .from(bucket)
    .upload(newName, file, { cacheControl: '3600' });
  if (!data) throw new Error('File upload failed');

  return supabase.storage.from(bucket).getPublicUrl(newName).data.publicUrl;
};
