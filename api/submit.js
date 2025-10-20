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
        const { answers, result, isPartial = false, currentQuestion, sessionId } = req.body;
        console.log('Received submission:', { answers, result, isPartial, currentQuestion, sessionId });
        
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
            is_partial: isPartial,
            current_question: currentQuestion || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        let responseData;
        
        // If we have a sessionId, update the existing record
        if (sessionId) {
            const { data, error } = await supabase
                .from('quiz_responses')
                .update({
                    name: name,
                    answers: answers,
                    result: result,
                    is_partial: isPartial,
                    current_question: currentQuestion || null,
                    updated_at: new Date().toISOString(),
                    ...(concern && { concern: concern })
                })
                .eq('id', sessionId)
                .select();
            
            if (error) {
                console.error('Supabase update error:', error);
                throw error;
            }
            
            responseData = data[0];
            console.log('Successfully updated in Supabase:', responseData);
        } else {
            // Create a new record
            const { data, error } = await supabase
                .from('quiz_responses')
                .insert([quizData])
                .select();
            
            if (error) {
                console.error('Supabase insert error:', error);
                throw error;
            }
            
            responseData = data[0];
            console.log('Successfully saved to Supabase:', responseData);
        }
        
        res.status(200).json({ 
            message: isPartial ? 'Partial answers saved' : 'Answers submitted successfully',
            data: responseData,
            sessionId: responseData.id
        });
    } catch (error) {
        console.error('Error submitting answers:', error);
        res.status(500).json({ 
            message: 'Internal Server Error',
            error: error.message 
        });
    }
}