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
        const settingKey = pathParts[pathParts.length - 1];

        switch (method) {
            case 'GET':
                // Récupérer tous les paramètres ou un paramètre spécifique
                let getUrl = `${supabaseUrl}/rest/v1/site_settings`;
                if (settingKey && settingKey !== 'admin-settings') {
                    getUrl += `?key=eq.${settingKey}`;
                }
                
                const getResponse = await fetch(getUrl, {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey
                    }
                });
                
                const settings = await getResponse.json();
                return new Response(JSON.stringify({ data: settings }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            case 'PUT':
                // Mettre à jour un paramètre
                if (!settingKey || settingKey === 'admin-settings') {
                    throw new Error('Clé de paramètre manquante');
                }

                const updateData = await req.json();
                const updateResponse = await fetch(`${supabaseUrl}/rest/v1/site_settings?key=eq.${settingKey}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({
                        value: updateData.value,
                        updated_by: userId
                    })
                });

                if (!updateResponse.ok) {
                    const errorText = await updateResponse.text();
                    throw new Error(`Erreur mise à jour paramètre: ${errorText}`);
                }

                const updatedSetting = await updateResponse.json();
                return new Response(JSON.stringify({ data: updatedSetting[0] }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            case 'POST':
                // Créer un nouveau paramètre
                const createData = await req.json();
                const createResponse = await fetch(`${supabaseUrl}/rest/v1/site_settings`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({
                        ...createData,
                        updated_by: userId
                    })
                });

                if (!createResponse.ok) {
                    const errorText = await createResponse.text();
                    throw new Error(`Erreur création paramètre: ${errorText}`);
                }

                const createdSetting = await createResponse.json();
                return new Response(JSON.stringify({ data: createdSetting[0] }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            default:
                throw new Error('Méthode non supportée');
        }

    } catch (error) {
        console.error('Erreur admin-settings:', error);

        const errorResponse = {
            error: {
                code: 'ADMIN_SETTINGS_ERROR',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});