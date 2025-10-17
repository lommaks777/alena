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
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { answers, result } = req.body;
        console.log('Received submission:', { answers, result });
        
        // Check if Supabase is configured
        if (!supabase) {
            console.warn('Supabase not configured. Skipping database storage.');
            return res.status(200).json({ 
                message: 'Answers received (database not configured)',
                warning: 'Supabase credentials not found'
            });
        }
        
        // Extract data from answers
        const name = answers.q0 || 'Anonymous';
        const concern = answers.q10 || null;
        
        // Prepare data for Supabase
        const quizData = {
            name: name,
            result: result,
            answers: answers,
            concern: concern,
            created_at: new Date().toISOString()
        };
        
        // Insert into Supabase
        const { data, error } = await supabase
            .from('quiz_responses')
            .insert([quizData])
            .select();
        
        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
        
        console.log('Successfully saved to Supabase:', data);
        
        res.status(200).json({ 
            message: 'Answers submitted successfully',
            data: data[0]
        });
    } catch (error) {
        console.error('Error submitting answers:', error);
        res.status(500).json({ 
            message: 'Internal Server Error',
            error: error.message 
        });
    }
}