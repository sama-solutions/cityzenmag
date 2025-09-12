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
        const categoryId = pathParts[pathParts.length - 1];

        switch (method) {
            case 'GET':
                // Récupérer toutes les catégories
                const getResponse = await fetch(`${supabaseUrl}/rest/v1/categories?order=display_order.asc`, {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey
                    }
                });
                
                const categories = await getResponse.json();
                return new Response(JSON.stringify({ data: categories }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            case 'POST':
                // Créer une nouvelle catégorie
                const createData = await req.json();
                const createResponse = await fetch(`${supabaseUrl}/rest/v1/categories`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({
                        ...createData,
                        created_by: userId
                    })
                });

                if (!createResponse.ok) {
                    const errorText = await createResponse.text();
                    throw new Error(`Erreur création catégorie: ${errorText}`);
                }

                const createdCategory = await createResponse.json();
                return new Response(JSON.stringify({ data: createdCategory[0] }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            case 'PUT':
                // Mettre à jour une catégorie
                if (!categoryId || categoryId === 'admin-categories') {
                    throw new Error('ID de catégorie manquant');
                }

                const updateData = await req.json();
                const updateResponse = await fetch(`${supabaseUrl}/rest/v1/categories?id=eq.${categoryId}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify(updateData)
                });

                if (!updateResponse.ok) {
                    const errorText = await updateResponse.text();
                    throw new Error(`Erreur mise à jour catégorie: ${errorText}`);
                }

                const updatedCategory = await updateResponse.json();
                return new Response(JSON.stringify({ data: updatedCategory[0] }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            case 'DELETE':
                // Supprimer une catégorie
                if (!categoryId || categoryId === 'admin-categories') {
                    throw new Error('ID de catégorie manquant');
                }

                const deleteResponse = await fetch(`${supabaseUrl}/rest/v1/categories?id=eq.${categoryId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey
                    }
                });

                if (!deleteResponse.ok) {
                    const errorText = await deleteResponse.text();
                    throw new Error(`Erreur suppression catégorie: ${errorText}`);
                }

                return new Response(JSON.stringify({ data: { success: true } }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            default:
                throw new Error('Méthode non supportée');
        }

    } catch (error) {
        console.error('Erreur admin-categories:', error);

        const errorResponse = {
            error: {
                code: 'ADMIN_CATEGORIES_ERROR',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});