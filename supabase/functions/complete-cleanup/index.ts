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
        console.log('Starting complete database cleanup and rebuild');

        // Get environment variables
        const twitterBearerToken = Deno.env.get('TWITTER_BEARER_TOKEN');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!twitterBearerToken || !supabaseUrl || !serviceRoleKey) {
            throw new Error('Required environment variables not found');
        }

        // Step 1: Complete cleanup - delete all existing data
        console.log('Step 1: Cleaning up existing data...');
        
        // Delete all media files
        await fetch(`${supabaseUrl}/rest/v1/media_files`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });
        
        // Delete all tweets
        await fetch(`${supabaseUrl}/rest/v1/tweets`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });
        
        // Delete all threads
        await fetch(`${supabaseUrl}/rest/v1/threads`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Database cleanup completed');

        // Step 2: Fresh Twitter API call with proper thread detection
        console.log('Step 2: Fetching fresh data from Twitter...');
        
        const username = 'loi200812';
        
        // Get user ID
        const userResponse = await fetch(`https://api.twitter.com/2/users/by/username/${username}`, {
            headers: { 'Authorization': `Bearer ${twitterBearerToken}` }
        });
        
        const userData = await userResponse.json();
        const userId = userData.data.id;
        
        // Get tweets with comprehensive fields
        const tweetsResponse = await fetch(
            `https://api.twitter.com/2/users/${userId}/tweets?` +
            `max_results=100&` +
            `tweet.fields=created_at,public_metrics,conversation_id,in_reply_to_user_id,context_annotations&` +
            `media.fields=url,type,width,height&` +
            `expansions=attachments.media_keys`,
            {
                headers: { 'Authorization': `Bearer ${twitterBearerToken}` }
            }
        );
        
        const tweetsData = await tweetsResponse.json();
        const tweets = tweetsData.data || [];
        const mediaIncludes = tweetsData.includes?.media || [];
        
        console.log(`Retrieved ${tweets.length} tweets from Twitter`);

        // Step 3: Intelligent thread detection and organization
        console.log('Step 3: Organizing tweets into proper threads...');
        
        // Group by conversation and detect proper threads
        const threadGroups = new Map();
        
        for (const tweet of tweets) {
            const conversationId = tweet.conversation_id;
            
            if (!threadGroups.has(conversationId)) {
                threadGroups.set(conversationId, []);
            }
            threadGroups.get(conversationId).push(tweet);
        }
        
        console.log(`Found ${threadGroups.size} potential thread groups`);
        
        let processedThreads = 0;
        let processedTweets = 0;
        
        // Step 4: Process only threads with sufficient content (5+ tweets)
        for (const [conversationId, threadTweets] of threadGroups) {
            // Filter for substantial threads only
            if (threadTweets.length < 5) {
                console.log(`Skipping short thread ${conversationId} with ${threadTweets.length} tweets`);
                continue;
            }
            
            // Sort tweets chronologically
            threadTweets.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            
            // Analyze content to determine thread theme and title
            let threadTitle = 'Thread';
            let threadTheme = '';
            let allHashtags = [];
            
            // Extract meaningful information from tweets
            for (const tweet of threadTweets) {
                const hashtags = tweet.text.match(/#\w+/g) || [];
                allHashtags.push(...hashtags);
                
                // Detect specific thread types
                if (tweet.text.includes('#LaSuite')) {
                    threadTitle = 'La Suite - Action et Transparence';
                    threadTheme = 'Modernisation et transparence institutionnelle';
                } else if (tweet.text.includes('#LaQuestionQuiDérange')) {
                    threadTitle = 'La Question qui Dérange';
                    threadTheme = 'Stratégie constructive pour la modernisation';
                } else if (tweet.text.includes('#TransparenceSN')) {
                    threadTitle = 'Transparence Institutionnelle';
                    threadTheme = 'Transparence des institutions sénégalaises';
                } else if (tweet.text.includes('1/')) {
                    // Extract title from first tweet
                    const titleMatch = tweet.text.match(/^(.*?)(?:#|1\/|\bhttps?)/i);
                    if (titleMatch && titleMatch[1].trim().length > 5) {
                        threadTitle = titleMatch[1].trim().substring(0, 100);
                    }
                }
            }
            
            // Remove duplicate hashtags
            allHashtags = [...new Set(allHashtags)];
            
            // Take only the first 9 tweets for proper thread structure
            const finalTweets = threadTweets.slice(0, 9);
            
            // Create thread record
            const threadData = {
                thread_id: conversationId,
                title: threadTitle,
                theme: threadTheme,
                description: finalTweets[0]?.text.substring(0, 200) + '...',
                date_created: finalTweets[0]?.created_at,
                hashtags: allHashtags,
                total_tweets: finalTweets.length,
                complete: finalTweets.length === 9
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
            
            if (!createThreadResponse.ok) {
                console.error(`Failed to create thread ${conversationId}`);
                continue;
            }
            
            processedThreads++;
            console.log(`Created thread: ${threadTitle} (${finalTweets.length} tweets)`);
            
            // Process tweets for this thread
            for (let i = 0; i < finalTweets.length; i++) {
                const tweet = finalTweets[i];
                
                // Extract media URLs (unique only)
                let mediaUrls = [];
                if (tweet.attachments?.media_keys) {
                    for (const mediaKey of tweet.attachments.media_keys) {
                        const media = mediaIncludes.find(m => m.media_key === mediaKey);
                        if (media && media.url && !mediaUrls.includes(media.url)) {
                            mediaUrls.push(media.url);
                        }
                    }
                }
                
                // Determine position
                const positionMatch = tweet.text.match(/(\d+)\/(\d+)/);
                let position = `${i + 1}/${finalTweets.length}`;
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
                }
            }
        }

        const result = {
            data: {
                success: true,
                processed_threads: processedThreads,
                processed_tweets: processedTweets,
                message: 'Complete cleanup and rebuild successful',
                timestamp: new Date().toISOString()
            }
        };

        console.log(`Cleanup and rebuild completed: ${processedThreads} threads, ${processedTweets} tweets`);
        
        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Cleanup and rebuild error:', error);
        
        const errorResponse = {
            error: {
                code: 'CLEANUP_REBUILD_FAILED',
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