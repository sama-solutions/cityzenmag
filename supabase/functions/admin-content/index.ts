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
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Configuration Supabase manquante');
        }

        // Vérifier l'authentification utilisateur
        const authHeader = req.headers.get('authorization');
        if (!authHeader) {
            throw new Error('Token d\'authentification manquant');
        }

        const token = authHeader.replace('Bearer ', '');
        
        // Vérifier le token et obtenir l'utilisateur
        const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'apikey': serviceRoleKey
            }
        });

        if (!userResponse.ok) {
            throw new Error('Token invalide');
        }

        const userData = await userResponse.json();
        const userId = userData.id;

        // Vérifier si l'utilisateur est administrateur
        const adminCheckResponse = await fetch(`${supabaseUrl}/rest/v1/admin_users?user_id=eq.${userId}&is_active=eq.true`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey
            }
        });

        const adminData = await adminCheckResponse.json();
        if (!adminData || adminData.length === 0) {
            throw new Error('Accès non autorisé - droits administrateur requis');
        }

        const method = req.method;
        const url = new URL(req.url);
        const pathParts = url.pathname.split('/');
        const threadId = pathParts[pathParts.length - 1];

        switch (method) {
            case 'GET':
                // Récupérer tous les contenus avec leurs catégories et statuts
                const getResponse = await fetch(`${supabaseUrl}/rest/v1/threads?order=created_at.desc`, {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey
                    }
                });
                
                const threads = await getResponse.json();
                
                // Récupérer les catégories
                const categoriesResponse = await fetch(`${supabaseUrl}/rest/v1/categories`, {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey
                    }
                });
                const categories = await categoriesResponse.json();
                
                // Récupérer les statuts
                const statusResponse = await fetch(`${supabaseUrl}/rest/v1/content_status`, {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey
                    }
                });
                const statuses = await statusResponse.json();
                
                // Enrichir les threads avec les données de catégorie et statut
                const enrichedThreads = threads.map(thread => {
                    const category = categories.find(c => c.id === thread.category_id);
                    const status = statuses.find(s => s.id === thread.status_id);
                    return {
                        ...thread,
                        category: category || null,
                        status: status || null
                    };
                });
                
                return new Response(JSON.stringify({ 
                    data: {
                        threads: enrichedThreads,
                        categories,
                        statuses
                    }
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            case 'PUT':
                // Mettre à jour un thread
                if (!threadId || threadId === 'admin-content') {
                    throw new Error('ID de thread manquant');
                }

                const updateData = await req.json();
                const updateResponse = await fetch(`${supabaseUrl}/rest/v1/threads?thread_id=eq.${threadId}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({
                        ...updateData,
                        updated_by: userId
                    })
                });

                if (!updateResponse.ok) {
                    const errorText = await updateResponse.text();
                    throw new Error(`Erreur mise à jour thread: ${errorText}`);
                }

                const updatedThread = await updateResponse.json();
                return new Response(JSON.stringify({ data: updatedThread[0] }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            case 'DELETE':
                // Supprimer un thread (soft delete en changeant le statut)
                if (!threadId || threadId === 'admin-content') {
                    throw new Error('ID de thread manquant');
                }

                // Récupérer l'ID du statut "supprimé"
                const deletedStatusResponse = await fetch(`${supabaseUrl}/rest/v1/content_status?slug=eq.deleted`, {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey
                    }
                });
                
                const deletedStatuses = await deletedStatusResponse.json();
                if (!deletedStatuses || deletedStatuses.length === 0) {
                    throw new Error('Statut "supprimé" non trouvé');
                }
                
                const deletedStatusId = deletedStatuses[0].id;
                
                const deleteResponse = await fetch(`${supabaseUrl}/rest/v1/threads?thread_id=eq.${threadId}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        status_id: deletedStatusId,
                        updated_by: userId
                    })
                });

                if (!deleteResponse.ok) {
                    const errorText = await deleteResponse.text();
                    throw new Error(`Erreur suppression thread: ${errorText}`);
                }

                return new Response(JSON.stringify({ data: { success: true } }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            default:
                throw new Error('Méthode non supportée');
        }

    } catch (error) {
        console.error('Erreur admin-content:', error);

        const errorResponse = {
            error: {
                code: 'ADMIN_CONTENT_ERROR',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});