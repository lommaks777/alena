// Vercel serverless function
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
        const newAnswers = req.body;
        
        // For now, just return success - we'll handle storage later
        console.log('Received answers:', newAnswers);
        
        res.status(200).json({ 
            message: 'Answers submitted successfully',
            data: newAnswers
        });
    } catch (error) {
        console.error('Error submitting answers:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}