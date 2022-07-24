import {React} from "react";

const FeedbackAnalysis = () => {
    return(
        <section className="py-5 bg-light">
                <div className="container">
                    <h2>Feedback analysis</h2>
                    <p>The below table and chart shows the polarity of feedbacks submitted by customers</p>
                    <div className="row align-items-center" >
                        <iframe
                            width="1000"
                            height="500"
                            src="https://datastudio.google.com/embed/reporting/543281ca-810f-40fa-a5eb-af9b8b0902ca/page/DFXyC"
                            frameBorder="1"
                            allowFullScreen >
                        </iframe>
                    </div>
                </div>
            </section>
        
    );
}

export default FeedbackAnalysis;