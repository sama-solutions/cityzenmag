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
        console.log('Starting media filename correction');

        // Get environment variables
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Supabase configuration missing');
        }

        // Get all media files with problematic filenames
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
        console.log(`Found ${mediaFiles.length} media files to check`);

        let correctedCount = 0;
        let errorCount = 0;

        for (const media of mediaFiles) {
            try {
                // Check if filename has double extension
                if (media.filename.includes('.jpg.jpg') || media.filename.includes('.png.png') || 
                    media.filename.includes('.gif.gif') || media.filename.includes('.webp.webp')) {
                    
                    // Correct the filename by removing the double extension
                    const correctedFilename = media.filename.replace(/\.(jpg|png|gif|webp)\.(jpg|png|gif|webp)$/, '.$2');
                    const correctedLocalPath = media.local_path.replace(/\.(jpg|png|gif|webp)\.(jpg|png|gif|webp)$/, '.$2');
                    
                    console.log(`Correcting: ${media.filename} -> ${correctedFilename}`);
                    
                    // Update the database record
                    const updateResponse = await fetch(
                        `${supabaseUrl}/rest/v1/media_files?id=eq.${media.id}`,
                        {
                            method: 'PATCH',
                            headers: {
                                'Authorization': `Bearer ${serviceRoleKey}`,
                                'apikey': serviceRoleKey,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                filename: correctedFilename,
                                local_path: correctedLocalPath
                            })
                        }
                    );

                    if (updateResponse.ok) {
                        correctedCount++;
                        console.log(`Successfully corrected filename for media ID: ${media.id}`);
                    } else {
                        console.error(`Failed to update media ID: ${media.id}`);
                        errorCount++;
                    }
                }
                
            } catch (error) {
                console.error(`Error processing media ${media.id}:`, error.message);
                errorCount++;
            }
        }

        const result = {
            data: {
                success: true,
                corrected: correctedCount,
                errors: errorCount,
                total_checked: mediaFiles.length,
                message: 'Media filename correction completed',
                timestamp: new Date().toISOString()
            }
        };

        console.log('Media filename correction completed');
        console.log(`Corrected: ${correctedCount}, Errors: ${errorCount}`);

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Media filename correction error:', error);

        const errorResponse = {
            error: {
                code: 'FILENAME_CORRECTION_FAILED',
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