import {React} from "react";

const UserStatistics = () => {
    return(

        <section className="py-5 bg-light">
                <div className="container">
                    <h2>User Statistics</h2>
                    <p>The below table shows login statistics of the user</p>
                    <div className="row align-items-center" >
                        <iframe
                            width="1000"
                            height="500"
                            src="https://datastudio.google.com/embed/reporting/c34fe988-cadb-4068-b2b8-813db8ac897a/page/oBXyC"
                            frameBorder="1"
                            allowFullScreen >
                        </iframe>
                    </div>
                </div>
            </section>
    );
}

export default UserStatistics;