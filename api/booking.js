// Vercel serverless function for consultation booking submissions
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Telegram Bot configuration
const TELEGRAM_BOT_TOKEN = '7329587114:AAFS0uK7roRVwwHB9c9w4-W6eKJlAaOUZkY';
const TELEGRAM_CHAT_ID = '684726097';

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
        const { name, contact, source, timestamp } = req.body;
        
        console.log('Received booking request:', { name, contact, source, timestamp });
        
        // Validate required fields
        if (!name || !contact) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                error: 'Name and contact are required'
            });
        }
        
        // Prepare data for storage
        const bookingData = {
            name: name,
            contact: contact,
            source: source || 'landing-page',
            status: 'pending',
            created_at: timestamp || new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        let savedData = null;
        
        // Store in Supabase if configured
        if (supabase) {
            try {
                const { data, error } = await supabase
                    .from('consultation_bookings')
                    .insert([bookingData])
                    .select();
                
                if (error) {
                    console.error('Supabase insert error:', error);
                    // Continue even if Supabase fails - we still want to send Telegram notification
                } else {
                    savedData = data[0];
                    console.log('Successfully saved to Supabase:', savedData?.id);
                }
            } catch (dbError) {
                console.error('Database error:', dbError);
                // Continue to Telegram notification
            }
        } else {
            console.warn('Supabase not configured. Skipping database storage.');
        }
        
        // Send Telegram notification
        try {
            const telegramMessage = `🆕 Новая заявка на консультацию!

👤 Имя: ${name}
📱 Контакт: ${contact}
📍 Источник: ${source || 'landing-page'}
🕐 Время: ${new Date(timestamp || Date.now()).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}

${savedData ? `🔑 ID в базе: ${savedData.id}` : ''}`;

            const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
            
            const telegramResponse = await fetch(telegramUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: telegramMessage,
                    parse_mode: 'HTML'
                })
            });
            
            if (!telegramResponse.ok) {
                const errorData = await telegramResponse.json();
                console.error('Telegram notification failed:', errorData);
            } else {
                console.log('Telegram notification sent successfully');
            }
        } catch (telegramError) {
            console.error('Error sending Telegram notification:', telegramError);
            // Don't fail the request if Telegram fails
        }
        
        res.status(200).json({ 
            message: 'Booking received successfully',
            data: savedData,
            success: true
        });
        
    } catch (error) {
        console.error('Error processing booking:', error);
        res.status(500).json({ 
            message: 'Internal Server Error',
            error: error.message,
            success: false
        });
    }
}
