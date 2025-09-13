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
        // Parse request body
        const body = await req.json().catch(() => ({}));
        const mode = body.mode || 'latest'; // 'latest', 'full', or 'batch'
        const limit = body.limit || (mode === 'latest' ? 20 : 100);
        const batchSize = body.batchSize || 10;
        
        console.log(`Starting Twitter sync for @loi200812 (mode: ${mode}, limit: ${limit})`);

        // Get environment variables
        const twitterBearerToken = Deno.env.get('TWITTER_BEARER_TOKEN');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!twitterBearerToken || !supabaseUrl || !serviceRoleKey) {
            throw new Error('Required environment variables not found');
        }

        const username = 'loi200812';
        
        // Get user ID from Twitter API
        const userResponse = await fetch(`https://api.twitter.com/2/users/by/username/${username}`, {
            headers: {
                'Authorization': `Bearer ${twitterBearerToken}`
            }
        });

        if (!userResponse.ok) {
            const errorText = await userResponse.text();
            throw new Error(`Failed to get user ID: ${errorText}`);
        }

        const userData = await userResponse.json();
        const userId = userData.data.id;
        console.log(`Found user ID: ${userId} for @${username}`);

        // Get tweets with all fields we need (adjust limit based on mode)
        const maxResults = Math.min(limit, 100); // Twitter API limit is 100
        const tweetsResponse = await fetch(
            `https://api.twitter.com/2/users/${userId}/tweets?` +
            `max_results=${maxResults}&` +
            `tweet.fields=created_at,public_metrics,conversation_id,in_reply_to_user_id&` +
            `media.fields=url,type,width,height&` +
            `expansions=attachments.media_keys`,
            {
                headers: {
                    'Authorization': `Bearer ${twitterBearerToken}`
                }
            }
        );

        if (!tweetsResponse.ok) {
            const errorText = await tweetsResponse.text();
            throw new Error(`Failed to fetch tweets: ${errorText}`);
        }

        const tweetsData = await tweetsResponse.json();
        const tweets = tweetsData.data || [];
        const mediaIncludes = tweetsData.includes?.media || [];
        
        console.log(`Retrieved ${tweets.length} tweets`);

        // Group tweets by thread (conversation_id)
        const threadGroups = new Map();
        
        for (const tweet of tweets) {
            const conversationId = tweet.conversation_id;
            
            if (!threadGroups.has(conversationId)) {
                threadGroups.set(conversationId, []);
            }
            threadGroups.get(conversationId).push(tweet);
        }

        console.log(`Found ${threadGroups.size} conversation threads`);

        let processedThreads = 0;
        let processedTweets = 0;
        let processedMedia = 0;

        // Filter threads based on mode
        let threadsToProcess = Array.from(threadGroups.entries());
        
        if (mode === 'latest') {
            // Sort by most recent tweet in each thread and take only the first one
            threadsToProcess.sort(([, tweetsA], [, tweetsB]) => {
                const latestA = Math.max(...tweetsA.map(t => new Date(t.created_at).getTime()));
                const latestB = Math.max(...tweetsB.map(t => new Date(t.created_at).getTime()));
                return latestB - latestA;
            });
            threadsToProcess = threadsToProcess.slice(0, 1);
            console.log(`Mode 'latest': Processing only the most recent thread`);
        } else if (mode === 'batch') {
            threadsToProcess = threadsToProcess.slice(0, batchSize);
            console.log(`Mode 'batch': Processing ${threadsToProcess.length} threads`);
        }

        // Process each thread
        for (const [conversationId, threadTweets] of threadsToProcess) {
            try {
                // Sort tweets by creation time
                threadTweets.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                
                // Extract hashtags and determine thread theme
                let allHashtags = [];
                let threadTitle = 'Thread';
                let threadTheme = '';
                
                for (const tweet of threadTweets) {
                    const hashtags = tweet.text.match(/#\w+/g) || [];
                    allHashtags.push(...hashtags);
                    
                    if (tweet.text.includes('#LaSuite')) {
                        threadTitle = 'La Suite - Action et Transparence';
                        threadTheme = 'Modernisation et transparence institutionnelle';
                    } else if (tweet.text.includes('#LaQuestionQuiDérange')) {
                        threadTitle = 'La Question qui Dérange';
                        threadTheme = 'Stratégie constructive pour la modernisation';
                    }
                }
                
                // Remove duplicates from hashtags
                allHashtags = [...new Set(allHashtags)];
                
                // Check if thread already exists
                const existingThreadResponse = await fetch(
                    `${supabaseUrl}/rest/v1/threads?thread_id=eq.${conversationId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                const existingThreads = await existingThreadResponse.json();
                
                if (existingThreads.length === 0) {
                    // Create new thread record
                    const threadData = {
                        thread_id: conversationId,
                        title: threadTitle,
                        theme: threadTheme,
                        description: threadTweets[0]?.text.substring(0, 200) + '...',
                        date_created: threadTweets[0]?.created_at,
                        hashtags: allHashtags,
                        total_tweets: threadTweets.length,
                        complete: threadTweets.length >= 9
                    };
                    
                    const createThreadResponse = await fetch(
                        `${supabaseUrl}/rest/v1/threads`,
                        {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${serviceRoleKey}`,
                                'apikey': serviceRoleKey,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(threadData)
                        }
                    );
                    
                    if (createThreadResponse.ok) {
                        processedThreads++;
                        console.log(`Created thread: ${threadTitle}`);
                    }
                }
                
                // Process tweets in this thread
                for (let i = 0; i < threadTweets.length; i++) {
                    const tweet = threadTweets[i];
                    
                    // Check if tweet already exists
                    const existingTweetResponse = await fetch(
                        `${supabaseUrl}/rest/v1/tweets?tweet_id=eq.${tweet.id}`,
                        {
                            headers: {
                                'Authorization': `Bearer ${serviceRoleKey}`,
                                'apikey': serviceRoleKey,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                    
                    const existingTweets = await existingTweetResponse.json();
                    
                    if (existingTweets.length === 0) {
                        // Extract media URLs
                        let mediaUrls = [];
                        if (tweet.attachments?.media_keys) {
                            for (const mediaKey of tweet.attachments.media_keys) {
                                const media = mediaIncludes.find(m => m.media_key === mediaKey);
                                if (media && media.url) {
                                    mediaUrls.push(media.url);
                                }
                            }
                        }
                        
                        // Detect position in thread (1/9, 2/9, etc.)
                        const positionMatch = tweet.text.match(/(\d+)\/(\d+)/);
                        let position = `${i + 1}/${threadTweets.length}`;
                        if (positionMatch) {
                            position = positionMatch[0];
                        }
                        
                        const tweetData = {
                            tweet_id: tweet.id,
                            thread_id: conversationId,
                            position: position,
                            content: tweet.text,
                            date_posted: tweet.created_at,
                            engagement: {
                                likes: tweet.public_metrics?.like_count || 0,
                                retweets: tweet.public_metrics?.retweet_count || 0,
                                replies: tweet.public_metrics?.reply_count || 0,
                                quotes: tweet.public_metrics?.quote_count || 0
                            },
                            media_urls: mediaUrls
                        };
                        
                        const createTweetResponse = await fetch(
                            `${supabaseUrl}/rest/v1/tweets`,
                            {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${serviceRoleKey}`,
                                    'apikey': serviceRoleKey,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(tweetData)
                            }
                        );
                        
                        if (createTweetResponse.ok) {
                            processedTweets++;
                            console.log(`Saved tweet ${position}: ${tweet.text.substring(0, 50)}...`);
                            
                            // Process media files for this tweet
                            if (mediaUrls.length > 0) {
                                for (const mediaUrl of mediaUrls) {
                                    try {
                                        // Check if media already exists
                                        const existingMediaResponse = await fetch(
                                            `${supabaseUrl}/rest/v1/media_files?original_url=eq.${encodeURIComponent(mediaUrl)}`,
                                            {
                                                headers: {
                                                    'Authorization': `Bearer ${serviceRoleKey}`,
                                                    'apikey': serviceRoleKey,
                                                    'Content-Type': 'application/json'
                                                }
                                            }
                                        );
                                        
                                        const existingMedia = await existingMediaResponse.json();
                                        
                                        if (existingMedia.length === 0) {
                                            // Create media file record
                                            const mediaData = {
                                                original_url: mediaUrl,
                                                local_path: `twitter-media/${tweet.id}/${Date.now()}.jpg`,
                                                filename: `${tweet.id}_${Date.now()}.jpg`,
                                                file_type: 'image/jpeg',
                                                file_size: 0, // Will be updated when downloaded
                                                tweet_id: tweet.id,
                                                downloaded_at: null // Will be updated when downloaded
                                            };
                                            
                                            const createMediaResponse = await fetch(
                                                `${supabaseUrl}/rest/v1/media_files`,
                                                {
                                                    method: 'POST',
                                                    headers: {
                                                        'Authorization': `Bearer ${serviceRoleKey}`,
                                                        'apikey': serviceRoleKey,
                                                        'Content-Type': 'application/json'
                                                    },
                                                    body: JSON.stringify(mediaData)
                                                }
                                            );
                                            
                                            if (createMediaResponse.ok) {
                                                processedMedia++;
                                                console.log(`Saved media: ${mediaUrl}`);
                                            }
                                        }
                                    } catch (mediaError) {
                                        console.error(`Error processing media ${mediaUrl}:`, mediaError.message);
                                    }
                                }
                            }
                        }
                    }
                }
                
            } catch (error) {
                console.error(`Error processing thread ${conversationId}:`, error.message);
            }
        }

        const result = {
            data: {
                success: true,
                mode: mode,
                processed_threads: processedThreads,
                processed_tweets: processedTweets,
                processed_media: processedMedia,
                total_conversations: threadGroups.size,
                threads_to_process: threadsToProcess.length,
                timestamp: new Date().toISOString()
            }
        };

        console.log('Twitter sync completed successfully');
        console.log(`Mode: ${mode} - Processed ${processedThreads} new threads, ${processedTweets} new tweets, and ${processedMedia} new media files`);

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Twitter sync error:', error);

        const errorResponse = {
            error: {
                code: 'TWITTER_SYNC_FAILED',
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