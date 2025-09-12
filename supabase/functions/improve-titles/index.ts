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
        console.log('Starting thread titles improvement');

        // Get environment variables
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Supabase configuration missing');
        }

        // Get threads with generic titles
        const threadsResponse = await fetch(
            `${supabaseUrl}/rest/v1/threads?title=eq.Thread&select=*`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!threadsResponse.ok) {
            throw new Error('Failed to fetch threads');
        }

        const threads = await threadsResponse.json();
        console.log(`Found ${threads.length} threads with generic titles`);

        let updatedCount = 0;

        for (const thread of threads) {
            try {
                // Get the first tweet of this thread
                const firstTweetResponse = await fetch(
                    `${supabaseUrl}/rest/v1/tweets?thread_id=eq.${thread.thread_id}&position=like.1/%&select=content&limit=1`,
                    {
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (!firstTweetResponse.ok) {
                    console.error(`Failed to get first tweet for thread ${thread.thread_id}`);
                    continue;
                }

                const firstTweets = await firstTweetResponse.json();
                if (firstTweets.length === 0) {
                    console.error(`No first tweet found for thread ${thread.thread_id}`);
                    continue;
                }

                const firstTweet = firstTweets[0];
                let newTitle = "Thread";
                let newTheme = "";

                // Extract meaningful title from content
                const content = firstTweet.content;
                
                // Define title extraction patterns for specific thread IDs
                if (thread.thread_id === '1965340919877828668') {
                    newTitle = "Pression Hiérarchique : Le Risque Interne de la Nouvelle Loi";
                    newTheme = "Risques internes et abus hiérarchiques";
                } else if (thread.thread_id === '1965008944583295264') {
                    newTitle = "Loi sur l'Accès à l'Information: Un Défi Humain";
                    newTheme = "Protection et valorisation des agents publics";
                } else if (thread.thread_id === '1964569466165199357') {
                    newTitle = "Loi sur la Protection des Lanceurs d'Alerte";
                    newTheme = "Mode d'emploi pour la protection des lanceurs d'alerte";
                } else if (thread.thread_id === '1964294494389445022') {
                    newTitle = "Dénoncer la Corruption sans Risque";
                    newTheme = "Protection légale pour lutter contre la corruption";
                } else if (thread.thread_id === '1963873549451497618') {
                    newTitle = "Loi sur l'Accès à l'Information : Mode d'Emploi";
                    newTheme = "Guide pratique pour exercer le droit à l'information";
                } else if (thread.thread_id === '1963559543666884997') {
                    newTitle = "Deux Lois Transforment la Relation État-Citoyens";
                    newTheme = "Transparence et protection des citoyens";
                } else {
                    // Generic extraction logic
                    // Remove emojis, hashtags and URLs for title extraction
                    let cleanContent = content
                        .replace(/[🔎📘📢🧵🇸🇳👇👆📌✅❌⚠️💡🎯]/g, '') // Remove emojis
                        .replace(/https?:\/\/[^\s]+/g, '') // Remove URLs
                        .replace(/#\w+/g, '') // Remove hashtags
                        .replace(/\d+\/\d+/g, '') // Remove position indicators
                        .trim();
                    
                    // Try to extract title from various patterns
                    let titleMatch = cleanContent.match(/^([^\n:]+):?/);
                    if (titleMatch && titleMatch[1].length > 10 && titleMatch[1].length < 80) {
                        newTitle = titleMatch[1].trim();
                    } else {
                        // Try to get first meaningful sentence
                        const sentences = cleanContent.split(/[.!?\n]/);
                        for (const sentence of sentences) {
                            if (sentence.trim().length > 15 && sentence.trim().length < 100) {
                                newTitle = sentence.trim();
                                break;
                            }
                        }
                    }
                    
                    // Extract theme from hashtags or keywords
                    if (content.includes('#TransparenceSN') || content.includes('transparence')) {
                        newTheme = "Transparence institutionnelle";
                    } else if (content.includes('#AntiCorruptionSN') || content.includes('corruption')) {
                        newTheme = "Lutte contre la corruption";
                    } else if (content.includes('lanceur') || content.includes('alerte')) {
                        newTheme = "Protection des lanceurs d'alerte";
                    } else if (content.includes('information') || content.includes('accès')) {
                        newTheme = "Accès à l'information publique";
                    } else if (content.includes('#Sénégal')) {
                        newTheme = "Modernisation institutionnelle du Sénégal";
                    }
                }

                // Update the thread with new title and theme
                const updateResponse = await fetch(
                    `${supabaseUrl}/rest/v1/threads?thread_id=eq.${thread.thread_id}`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            title: newTitle,
                            theme: newTheme,
                            updated_at: new Date().toISOString()
                        })
                    }
                );

                if (updateResponse.ok) {
                    updatedCount++;
                    console.log(`Updated thread ${thread.thread_id}: "${newTitle}"`);
                } else {
                    console.error(`Failed to update thread ${thread.thread_id}`);
                }

            } catch (error) {
                console.error(`Error processing thread ${thread.thread_id}:`, error.message);
            }
        }

        const result = {
            data: {
                success: true,
                updated_threads: updatedCount,
                total_processed: threads.length,
                message: 'Thread titles improvement completed',
                timestamp: new Date().toISOString()
            }
        };

        console.log(`Thread titles improvement completed: ${updatedCount} updated`);

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Thread titles improvement error:', error);

        const errorResponse = {
            error: {
                code: 'TITLE_IMPROVEMENT_FAILED',
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