// Vercel serverless function with Supabase integration
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
}

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Check if Supabase is configured
        if (!supabase) {
            console.warn('Supabase not configured. Returning empty stats.');
            return res.status(200).json({
                totalResponses: 0,
                resultsDistribution: {},
                answersDistribution: {},
                warning: 'Supabase credentials not found'
            });
        }

        // Fetch all quiz responses from Supabase
        const { data: allResponses, error } = await supabase
            .from('quiz_responses')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        const totalResponses = allResponses?.length || 0;

        // Calculate results distribution (A, B, C, D)
        const resultsDistribution = (allResponses || []).reduce((acc, entry) => {
            const result = entry.result;
            if (result) {
                acc[result] = (acc[result] || 0) + 1;
            }
            return acc;
        }, {});

        // Calculate answers distribution for each question
        const answersDistribution = (allResponses || []).reduce((acc, entry) => {
            const answers = entry.answers || {};
            
            for (const [question, answer] of Object.entries(answers)) {
                // Skip q0 (name) and q10 (text concern)
                if (question === 'q0' || question === 'q10') continue;
                
                if (!acc[question]) {
                    acc[question] = { A: 0, B: 0, C: 0, D: 0 };
                }
                
                if (answer && ['A', 'B', 'C', 'D'].includes(answer)) {
                    acc[question][answer] = (acc[question][answer] || 0) + 1;
                }
            }
            return acc;
        }, {});

        // Get recent responses (last 10)
        const recentResponses = (allResponses || []).slice(0, 10).map(r => ({
            id: r.id,
            name: r.name,
            result: r.result,
            created_at: r.created_at
        }));

        res.status(200).json({
            totalResponses,
            resultsDistribution,
            answersDistribution,
            recentResponses
        });

    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ 
            message: 'Internal Server Error',
            error: error.message 
        });
    }
}