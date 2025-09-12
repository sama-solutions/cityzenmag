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
        console.log('Starting media cleanup and re-download process');

        // Get environment variables
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Supabase configuration missing');
        }

        // Step 1: Clear existing media files from database
        console.log('Clearing existing media files from database...');
        const deleteResponse = await fetch(
            `${supabaseUrl}/rest/v1/media_files`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!deleteResponse.ok) {
            console.error('Failed to clear media files');
        } else {
            console.log('Successfully cleared existing media files');
        }

        // Step 2: Get all tweets with media URLs
        const tweetsResponse = await fetch(
            `${supabaseUrl}/rest/v1/tweets?select=*&media_urls=not.is.null`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!tweetsResponse.ok) {
            throw new Error('Failed to fetch tweets with media');
        }

        const tweets = await tweetsResponse.json();
        console.log(`Found ${tweets.length} tweets with media`);

        let downloadedCount = 0;
        let errorCount = 0;

        // Step 3: Download each media file with correct naming
        for (const tweet of tweets) {
            if (!tweet.media_urls || tweet.media_urls.length === 0) {
                continue;
            }

            for (const mediaUrl of tweet.media_urls) {
                try {
                    console.log(`Downloading media: ${mediaUrl}`);

                    // Download the media file
                    const mediaResponse = await fetch(mediaUrl);
                    
                    if (!mediaResponse.ok) {
                        console.error(`Failed to download media: ${mediaUrl}`);
                        errorCount++;
                        continue;
                    }

                    const mediaBuffer = await mediaResponse.arrayBuffer();
                    const mediaData = new Uint8Array(mediaBuffer);
                    
                    // Get content type
                    const contentType = mediaResponse.headers.get('content-type') || 'image/jpeg';
                    
                    // Generate CORRECT filename
                    const urlParts = new URL(mediaUrl);
                    let originalFilename = urlParts.pathname.split('/').pop() || 'media';
                    
                    // Remove extension from original filename if it exists
                    originalFilename = originalFilename.replace(/\.[^/.]+$/, '');
                    
                    // Determine proper extension based on content type
                    const extension = contentType.includes('png') ? '.png' : 
                                    contentType.includes('gif') ? '.gif' :
                                    contentType.includes('webp') ? '.webp' : '.jpg';
                    
                    const timestamp = new Date().getTime();
                    const filename = `${tweet.tweet_id}_${timestamp}_${originalFilename}${extension}`;
                    const storagePath = `media/${filename}`;

                    // Upload to Supabase Storage
                    const uploadResponse = await fetch(
                        `${supabaseUrl}/storage/v1/object/twitter-media/${storagePath}`,
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
                        console.error(`Storage upload failed: ${errorText}`);
                        errorCount++;
                        continue;
                    }

                    // Get public URL
                    const publicUrl = `${supabaseUrl}/storage/v1/object/public/twitter-media/${storagePath}`;

                    // Save media file record to database
                    const mediaFileData = {
                        original_url: mediaUrl,
                        local_path: storagePath,
                        filename: filename,
                        file_type: contentType,
                        file_size: mediaData.length,
                        tweet_id: tweet.tweet_id
                    };

                    const insertResponse = await fetch(
                        `${supabaseUrl}/rest/v1/media_files`,
                        {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${serviceRoleKey}`,
                                'apikey': serviceRoleKey,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(mediaFileData)
                        }
                    );

                    if (insertResponse.ok) {
                        downloadedCount++;
                        console.log(`Successfully downloaded and stored: ${filename}`);
                        console.log(`Public URL: ${publicUrl}`);
                    } else {
                        console.error('Failed to save media file record to database');
                        errorCount++;
                    }

                    // Small delay to avoid overwhelming the server
                    await new Promise(resolve => setTimeout(resolve, 100));

                } catch (error) {
                    console.error(`Error processing media ${mediaUrl}:`, error.message);
                    errorCount++;
                }
            }
        }

        const result = {
            data: {
                success: true,
                downloaded: downloadedCount,
                errors: errorCount,
                total_processed: downloadedCount + errorCount,
                message: 'Media cleanup and re-download completed',
                timestamp: new Date().toISOString()
            }
        };

        console.log('Media cleanup and re-download process completed');
        console.log(`Downloaded: ${downloadedCount}, Errors: ${errorCount}`);

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Media cleanup error:', error);

        const errorResponse = {
            error: {
                code: 'MEDIA_CLEANUP_FAILED',
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