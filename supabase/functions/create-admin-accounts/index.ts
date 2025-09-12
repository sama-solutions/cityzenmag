Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
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

        // Comptes admin de test à créer
        const adminAccounts = [
            {
                email: 'admin@cityzenmag.sn',
                password: 'CityzenMag2025!',
                full_name: 'Administrateur Principal',
                role: 'super_admin'
            },
            {
                email: 'editor@cityzenmag.sn', 
                password: 'Editor2025!',
                full_name: 'Éditeur en Chef',
                role: 'admin'
            },
            {
                email: 'content@cityzenmag.sn',
                password: 'Content2025!',
                full_name: 'Gestionnaire de Contenu',
                role: 'editor'
            }
        ];

        const results = [];

        for (const account of adminAccounts) {
            try {
                // Créer l'utilisateur dans Supabase Auth
                const authResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: account.email,
                        password: account.password,
                        email_confirm: true,
                        user_metadata: {
                            full_name: account.full_name,
                            role: account.role
                        }
                    })
                });

                if (!authResponse.ok) {
                    const errorText = await authResponse.text();
                    console.error(`Erreur création auth pour ${account.email}:`, errorText);
                    
                    // Si l'utilisateur existe déjà, on continue
                    if (errorText.includes('already registered') || errorText.includes('email_exists')) {
                        results.push({
                            email: account.email,
                            status: 'exists',
                            message: 'Utilisateur déjà existant'
                        });
                        continue;
                    }
                    
                    throw new Error(`Erreur création auth: ${errorText}`);
                }

                const authUser = await authResponse.json();
                console.log(`Utilisateur auth créé:`, authUser.email);

                // Créer l'entrée dans admin_users
                const adminResponse = await fetch(`${supabaseUrl}/rest/v1/admin_users`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({
                        user_id: authUser.id,
                        email: account.email,
                        full_name: account.full_name,
                        role: account.role,
                        permissions: getPermissionsByRole(account.role),
                        is_active: true
                    })
                });

                if (!adminResponse.ok) {
                    const errorText = await adminResponse.text();
                    console.error(`Erreur création admin_users pour ${account.email}:`, errorText);
                    
                    // Si l'entrée existe déjà, on met à jour
                    if (errorText.includes('duplicate') || errorText.includes('unique')) {
                        const updateResponse = await fetch(`${supabaseUrl}/rest/v1/admin_users?user_id=eq.${authUser.id}`, {
                            method: 'PATCH',
                            headers: {
                                'Authorization': `Bearer ${serviceRoleKey}`,
                                'apikey': serviceRoleKey,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                full_name: account.full_name,
                                role: account.role,
                                permissions: getPermissionsByRole(account.role),
                                is_active: true
                            })
                        });
                        
                        if (updateResponse.ok) {
                            results.push({
                                email: account.email,
                                password: account.password,
                                role: account.role,
                                status: 'updated',
                                message: 'Compte mis à jour avec succès'
                            });
                        }
                        continue;
                    }
                    
                    throw new Error(`Erreur création admin_users: ${errorText}`);
                }

                const adminUser = await adminResponse.json();
                console.log(`Admin user créé:`, adminUser[0]?.email);

                results.push({
                    email: account.email,
                    password: account.password,
                    role: account.role,
                    status: 'created',
                    message: 'Compte créé avec succès'
                });

            } catch (error) {
                console.error(`Erreur pour ${account.email}:`, error);
                results.push({
                    email: account.email,
                    status: 'error',
                    message: error.message
                });
            }
        }

        return new Response(JSON.stringify({ 
            success: true,
            message: 'Création des comptes admin terminée',
            accounts: results
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Erreur générale:', error);

        const errorResponse = {
            success: false,
            error: {
                code: 'CREATE_ADMIN_ACCOUNTS_ERROR',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

function getPermissionsByRole(role: string): string[] {
    switch (role) {
        case 'super_admin':
            return [
                'manage_users',
                'manage_categories', 
                'manage_content',
                'manage_settings',
                'manage_menus',
                'view_analytics',
                'delete_content',
                'publish_content'
            ];
        case 'admin':
            return [
                'manage_categories',
                'manage_content', 
                'manage_settings',
                'view_analytics',
                'publish_content'
            ];
        case 'editor':
            return [
                'manage_content',
                'view_analytics',
                'publish_content'
            ];
        default:
            return ['view_analytics'];
    }
}
