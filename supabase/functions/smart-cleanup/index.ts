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
        console.log('Starting smart cleanup of existing data...');

        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Required environment variables not found');
        }

        // Step 1: Get all threads and their tweets
        const threadsResponse = await fetch(`${supabaseUrl}/rest/v1/threads?select=*`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
            }
        });
        const threads = await threadsResponse.json();
        
        const tweetsResponse = await fetch(`${supabaseUrl}/rest/v1/tweets?select=*&order=date_posted.asc`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
            }
        });
        const tweets = await tweetsResponse.json();

        console.log(`Processing ${threads.length} threads with ${tweets.length} tweets`);

        // Step 2: Group tweets by thread
        const threadMap = new Map();
        threads.forEach(thread => {
            threadMap.set(thread.thread_id, {
                ...thread,
                tweets: []
            });
        });

        tweets.forEach(tweet => {
            if (threadMap.has(tweet.thread_id)) {
                threadMap.get(tweet.thread_id).tweets.push(tweet);
            }
        });

        // Step 3: Clean up threads - keep only substantial threads (5+ tweets) and limit to 9 tweets
        const cleanThreads = [];
        const cleanTweets = [];
        const threadsToDelete = [];
        const tweetsToDelete = [];

        for (const [threadId, threadData] of threadMap) {
            const threadTweets = threadData.tweets;
            
            // Skip threads with too few tweets
            if (threadTweets.length < 5) {
                console.log(`Marking thread ${threadId} for deletion (${threadTweets.length} tweets)`);
                threadsToDelete.push(threadId);
                tweetsToDelete.push(...threadTweets.map(t => t.tweet_id));
                continue;
            }

            // Sort tweets chronologically and take first 9
            threadTweets.sort((a, b) => new Date(a.date_posted) - new Date(b.date_posted));
            const finalTweets = threadTweets.slice(0, 9);
            
            // Mark excess tweets for deletion
            const excessTweets = threadTweets.slice(9);
            if (excessTweets.length > 0) {
                console.log(`Thread ${threadId}: keeping 9 tweets, deleting ${excessTweets.length} excess tweets`);
                tweetsToDelete.push(...excessTweets.map(t => t.tweet_id));
            }

            // Update thread data
            const updatedThread = {
                ...threadData,
                total_tweets: finalTweets.length,
                complete: finalTweets.length === 9
            };
            delete updatedThread.tweets;
            
            cleanThreads.push(updatedThread);
            
            // Update tweet positions
            finalTweets.forEach((tweet, index) => {
                const updatedTweet = {
                    ...tweet,
                    position: `${index + 1}/9`
                };
                cleanTweets.push(updatedTweet);
            });
        }

        console.log(`Will keep ${cleanThreads.length} threads with ${cleanTweets.length} tweets`);
        console.log(`Will delete ${threadsToDelete.length} threads and ${tweetsToDelete.length} tweets`);

        // Step 4: Delete excess data
        if (tweetsToDelete.length > 0) {
            // Delete tweets in batches to avoid URL length limits
            const batchSize = 50;
            for (let i = 0; i < tweetsToDelete.length; i += batchSize) {
                const batch = tweetsToDelete.slice(i, i + batchSize);
                const deleteQuery = batch.map(id => `tweet_id.eq.${id}`).join(',');
                
                await fetch(`${supabaseUrl}/rest/v1/tweets?or=(${deleteQuery})`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                    }
                });
                console.log(`Deleted batch of ${batch.length} tweets`);
            }
        }

        if (threadsToDelete.length > 0) {
            const deleteQuery = threadsToDelete.map(id => `thread_id.eq.${id}`).join(',');
            await fetch(`${supabaseUrl}/rest/v1/threads?or=(${deleteQuery})`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                }
            });
            console.log(`Deleted ${threadsToDelete.length} threads`);
        }

        // Step 5: Update remaining threads
        for (const thread of cleanThreads) {
            await fetch(`${supabaseUrl}/rest/v1/threads?thread_id=eq.${thread.thread_id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    total_tweets: thread.total_tweets,
                    complete: thread.complete
                })
            });
        }

        // Step 6: Update remaining tweets
        for (const tweet of cleanTweets) {
            await fetch(`${supabaseUrl}/rest/v1/tweets?tweet_id=eq.${tweet.tweet_id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    position: tweet.position
                })
            });
        }

        // Step 7: Clean up duplicate media files
        const mediaResponse = await fetch(`${supabaseUrl}/rest/v1/media_files?select=*`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
            }
        });
        const mediaFiles = await mediaResponse.json();
        
        // Find duplicates by URL
        const urlMap = new Map();
        const duplicates = [];
        
        mediaFiles.forEach(media => {
            if (urlMap.has(media.file_url)) {
                duplicates.push(media.id);
            } else {
                urlMap.set(media.file_url, media.id);
            }
        });

        if (duplicates.length > 0) {
            const deleteQuery = duplicates.map(id => `id.eq.${id}`).join(',');
            await fetch(`${supabaseUrl}/rest/v1/media_files?or=(${deleteQuery})`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                }
            });
            console.log(`Deleted ${duplicates.length} duplicate media files`);
        }

        const result = {
            data: {
                success: true,
                cleaned_threads: cleanThreads.length,
                cleaned_tweets: cleanTweets.length,
                deleted_threads: threadsToDelete.length,
                deleted_tweets: tweetsToDelete.length,
                deleted_duplicate_media: duplicates.length,
                message: 'Smart cleanup successful',
                timestamp: new Date().toISOString()
            }
        };

        console.log('Smart cleanup completed:', result);
        
        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Smart cleanup error:', error);
        
        const errorResponse = {
            error: {
                code: 'SMART_CLEANUP_FAILED',
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
