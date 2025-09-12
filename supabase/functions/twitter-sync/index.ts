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
        console.log('Starting Twitter sync for @loi200812');

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

        // Get recent tweets with all fields we need
        const tweetsResponse = await fetch(
            `https://api.twitter.com/2/users/${userId}/tweets?` +
            `max_results=100&` +
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

        // Process each thread
        for (const [conversationId, threadTweets] of threadGroups) {
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
                processed_threads: processedThreads,
                processed_tweets: processedTweets,
                total_conversations: threadGroups.size,
                timestamp: new Date().toISOString()
            }
        };

        console.log('Twitter sync completed successfully');
        console.log(`Processed ${processedThreads} new threads and ${processedTweets} new tweets`);

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