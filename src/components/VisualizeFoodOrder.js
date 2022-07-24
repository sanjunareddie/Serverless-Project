import {React} from "react";

const VisualizeFoodOrder = () => {
    return(
        <section className="py-5 bg-light">
                <div className="container">
                    <h2>Food order analytics</h2>
                    <p>The below table shows the various food orders done by customers</p>
                    <div className="row align-items-center" >
                        <iframe
                            width="1000"
                            height="500"
                            src="https://datastudio.google.com/embed/reporting/8d730d8a-f80b-40df-a332-96e0ce687006/page/VBDyC"
                            frameBorder="1"
                            allowFullScreen >
                        </iframe>
                    </div>
                </div>
            </section>
    );
}

export default VisualizeFoodOrder;