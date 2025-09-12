Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        console.log('Starting media re-download with correct names');

        // Get environment variables
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Supabase configuration missing');
        }

        // Get all media files that need re-downloading
        const mediaResponse = await fetch(
            `${supabaseUrl}/rest/v1/media_files?select=*`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!mediaResponse.ok) {
            throw new Error('Failed to fetch media files');
        }

        const mediaFiles = await mediaResponse.json();
        console.log(`Found ${mediaFiles.length} media files to re-download`);

        let downloadedCount = 0;
        let errorCount = 0;

        for (const media of mediaFiles) {
            try {
                console.log(`Re-downloading: ${media.original_url}`);

                // Download the media file from original URL
                const mediaResponse = await fetch(media.original_url);
                
                if (!mediaResponse.ok) {
                    console.error(`Failed to download media: ${media.original_url}`);
                    errorCount++;
                    continue;
                }

                const mediaBuffer = await mediaResponse.arrayBuffer();
                const mediaData = new Uint8Array(mediaBuffer);
                
                // Get content type
                const contentType = mediaResponse.headers.get('content-type') || 'image/jpeg';
                
                // Upload with the corrected filename from database
                const uploadResponse = await fetch(
                    `${supabaseUrl}/storage/v1/object/twitter-media/${media.local_path}`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'Content-Type': contentType,
                            'x-upsert': 'true'
                        },
                        body: mediaData
                    }
                );

                if (!uploadResponse.ok) {
                    const errorText = await uploadResponse.text();
                    console.error(`Storage upload failed for ${media.filename}: ${errorText}`);
                    errorCount++;
                    continue;
                }

                downloadedCount++;
                console.log(`Successfully re-uploaded: ${media.filename}`);
                
                // Small delay to avoid overwhelming the server
                await new Promise(resolve => setTimeout(resolve, 100));

            } catch (error) {
                console.error(`Error processing media ${media.original_url}:`, error.message);
                errorCount++;
            }
        }

        const result = {
            data: {
                success: true,
                downloaded: downloadedCount,
                errors: errorCount,
                total_processed: downloadedCount + errorCount,
                message: 'Media re-download with correct names completed',
                timestamp: new Date().toISOString()
            }
        };

        console.log('Media re-download completed');
        console.log(`Downloaded: ${downloadedCount}, Errors: ${errorCount}`);

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Media re-download error:', error);

        const errorResponse = {
            error: {
                code: 'MEDIA_REDOWNLOAD_FAILED',
                message: error.message,
                timestamp: new Date().toISOString()
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});