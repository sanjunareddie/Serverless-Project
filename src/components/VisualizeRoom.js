import {React} from "react";

const VisualizeRoom = () => {
    return(
        <section className="py-5 bg-light">
                <div className="container">
                    <h2>Room booking analytics</h2>
                    <p>The below table shows the various room bookings done by customers</p>
                    <div className="row align-items-center" >
                        <iframe
                            width="1000"
                            height="500"
                            src="https://datastudio.google.com/embed/reporting/575a4575-8973-4268-b9d3-26497ed3e057/page/9Y8xC"
                            frameBorder="1"
                            allowFullScreen >
                        </iframe>
                    </div>
                </div>
            </section>
    );
}

export default VisualizeRoom;