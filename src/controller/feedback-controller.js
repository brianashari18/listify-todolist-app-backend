import feedbackService from "../service/feedback-service.js";


const sendFeedback = async (req, res, next) => {
    try {
        const result = await feedbackService.sendFeedback(req);
        res.status(201).json({
            data : result,
            message : "feedback sent",
        });
    }catch(e) {
        next(e);
    }
}



export default{
    sendFeedback
}