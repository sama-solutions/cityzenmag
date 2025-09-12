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
        console.log('Debugging Twitter API response...');

        // Get environment variables
        const twitterBearerToken = Deno.env.get('TWITTER_BEARER_TOKEN');
        
        if (!twitterBearerToken) {
            throw new Error('TWITTER_BEARER_TOKEN not found');
        }

        const username = 'loi200812';
        
        // Get user ID
        const userResponse = await fetch(`https://api.twitter.com/2/users/by/username/${username}`, {
            headers: { 'Authorization': `Bearer ${twitterBearerToken}` }
        });
        
        if (!userResponse.ok) {
            throw new Error(`Failed to get user: ${userResponse.status}`);
        }
        
        const userData = await userResponse.json();
        console.log('User data:', JSON.stringify(userData, null, 2));
        
        const userId = userData.data.id;
        
        // Get tweets - let's try more tweets and see what we get
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
        
        if (!tweetsResponse.ok) {
            throw new Error(`Failed to get tweets: ${tweetsResponse.status}`);
        }
        
        const tweetsData = await tweetsResponse.json();
        const tweets = tweetsData.data || [];
        
        console.log(`Retrieved ${tweets.length} tweets`);
        
        // Group by conversation to see thread sizes
        const threadGroups = new Map();
        
        for (const tweet of tweets) {
            const conversationId = tweet.conversation_id;
            
            if (!threadGroups.has(conversationId)) {
                threadGroups.set(conversationId, []);
            }
            threadGroups.get(conversationId).push(tweet);
        }
        
        console.log(`Found ${threadGroups.size} conversation groups`);
        
        // Analyze thread sizes
        const threadAnalysis = [];
        for (const [conversationId, threadTweets] of threadGroups) {
            threadAnalysis.push({
                conversation_id: conversationId,
                tweet_count: threadTweets.length,
                first_tweet_content: threadTweets[0]?.text?.substring(0, 100) + '...',
                created_at: threadTweets[0]?.created_at
            });
        }
        
        // Sort by tweet count descending
        threadAnalysis.sort((a, b) => b.tweet_count - a.tweet_count);
        
        const result = {
            data: {
                user_id: userId,
                total_tweets_retrieved: tweets.length,
                total_conversations: threadGroups.size,
                thread_analysis: threadAnalysis.slice(0, 10), // Top 10 largest threads
                success: true,
                timestamp: new Date().toISOString()
            }
        };

        console.log('Debug result:', JSON.stringify(result, null, 2));
        
        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Debug error:', error);
        
        const errorResponse = {
            error: {
                code: 'DEBUG_FAILED',
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
