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
        console.log('Starting scheduled sync for @loi200812 at', new Date().toISOString());

        // Get environment variables
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Supabase configuration missing');
        }

        let syncResult = null;
        let downloadResult = null;

        // Step 1: Run Twitter sync
        try {
            console.log('Step 1: Running Twitter sync...');
            
            const syncResponse = await fetch(`${supabaseUrl}/functions/v1/twitter-sync`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });

            if (syncResponse.ok) {
                syncResult = await syncResponse.json();
                console.log('Twitter sync completed:', syncResult.data || syncResult);
            } else {
                const errorText = await syncResponse.text();
                console.error('Twitter sync failed:', errorText);
                syncResult = { error: errorText };
            }
        } catch (error) {
            console.error('Twitter sync error:', error.message);
            syncResult = { error: error.message };
        }

        // Step 2: Run media download (only if sync was successful or had some results)
        if (syncResult && !syncResult.error) {
            try {
                console.log('Step 2: Running media download...');
                
                // Wait a moment before starting download
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                const downloadResponse = await fetch(`${supabaseUrl}/functions/v1/media-downloader`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                });

                if (downloadResponse.ok) {
                    downloadResult = await downloadResponse.json();
                    console.log('Media download completed:', downloadResult.data || downloadResult);
                } else {
                    const errorText = await downloadResponse.text();
                    console.error('Media download failed:', errorText);
                    downloadResult = { error: errorText };
                }
            } catch (error) {
                console.error('Media download error:', error.message);
                downloadResult = { error: error.message };
            }
        } else {
            console.log('Skipping media download due to sync issues');
            downloadResult = { skipped: 'Sync failed or no results' };
        }

        // Step 3: Update thread completion status
        try {
            console.log('Step 3: Updating thread completion status...');
            
            const threadsResponse = await fetch(
                `${supabaseUrl}/rest/v1/threads?select=*`,
                {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (threadsResponse.ok) {
                const threads = await threadsResponse.json();
                
                for (const thread of threads) {
                    // Count actual tweets for this thread
                    const tweetsResponse = await fetch(
                        `${supabaseUrl}/rest/v1/tweets?select=id&thread_id=eq.${thread.thread_id}`,
                        {
                            headers: {
                                'Authorization': `Bearer ${serviceRoleKey}`,
                                'apikey': serviceRoleKey,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                    
                    if (tweetsResponse.ok) {
                        const tweets = await tweetsResponse.json();
                        const actualCount = tweets.length;
                        
                        if (actualCount !== thread.total_tweets || (actualCount >= 9 && !thread.complete)) {
                            // Update thread with correct counts
                            await fetch(
                                `${supabaseUrl}/rest/v1/threads?thread_id=eq.${thread.thread_id}`,
                                {
                                    method: 'PATCH',
                                    headers: {
                                        'Authorization': `Bearer ${serviceRoleKey}`,
                                        'apikey': serviceRoleKey,
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        total_tweets: actualCount,
                                        complete: actualCount >= 9,
                                        updated_at: new Date().toISOString()
                                    })
                                }
                            );
                            
                            console.log(`Updated thread ${thread.title}: ${actualCount} tweets, complete: ${actualCount >= 9}`);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error updating thread completion status:', error.message);
        }

        const result = {
            data: {
                success: true,
                timestamp: new Date().toISOString(),
                sync_result: syncResult,
                download_result: downloadResult,
                message: 'Scheduled synchronization completed'
            }
        };

        console.log('Scheduled sync completed successfully');
        
        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Scheduled sync error:', error);

        const errorResponse = {
            error: {
                code: 'SCHEDULED_SYNC_FAILED',
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