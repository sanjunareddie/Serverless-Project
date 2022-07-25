exports.sentiment_analysis = async (req, res) => {
    console.log("METHOD: " + req.method);
    if(req.method == "OPTIONS") {
        res.set('Access-Control-Allow-Origin','*');
        res.set('Access-Control-Allow-Methods','*'),
        res.set('Access-Control-Allow-Headers','*'),
        res.set('Access-Control-Max-Age','3600')
        return res.status(204).send();
    } else {
        res.set('Access-Control-Allow-Origin', '*');
    }
    
    console.log("BODY: " + req.body);
    const admin = require('firebase-admin');

    if(!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.applicationDefault()
        });
    } else {
        admin.app();
    }

    const db = admin.firestore();
    const FEEDBACK_COLLECTION = 'customer_feedback';

    const { email, feedback } = req.body;
    console.log("email: " + email);
    console.log("feedback: " + feedback);

    try {
        if (email && feedback && email.length > 0 && feedback.length > 0) {
            // Performing sentiment analysis
            const language = require('@google-cloud/language');
            const client = new language.LanguageServiceClient();
            const document = { content: feedback, type: 'PLAIN_TEXT'};

            const [result] = await client.analyzeSentiment({document});
            const sentimentScore = result.documentSentiment.score;

            let polarity = "Neutral";
            if(sentimentScore > 0.34) {
                polarity = "Positive";
            } else if(sentimentScore < -0.34) {
                polarity = "Negative";
            } else {
                polarity = "Neutral";
            }

            // Adding feedback into the database
            const feedbackData = {
                email: email,
                feedback: feedback,
                sentiment_score: sentimentScore,
                polarity: polarity
            };

            await db.collection(FEEDBACK_COLLECTION).doc(email).set(feedbackData);

            return res.status(200).send({
                message: "Feedback added successfully!",
                success: true,
                feedback: feedbackData
            });
        } else {
            return res.status(400).send({ 
                message: "Bad Request", 
                success: false 
            });
        }
    } catch (error) {
        return res.status(500).json({ 
            message: "Internal server error!", 
            success: false,
            error: error
        });
    }
};