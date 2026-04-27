export default function Home() {
    return (
        <main>
            <section id="home" className="hero">
                <div className="hero-content">
                    <h1>MedSutra AI</h1>
                    <p>Empowering every dose with intelligence, care, and real-time assurance.</p>
                    <div className="hero-buttons">
                        <a href="#started" className="btn btn-primary">Consult Now</a>
                    </div>
                </div>
                <div className="hero-image">
                    <img src="/starting page.png" alt="MedSutra AI Dashboard" />
                </div>
            </section>

            <section id="about" className="about">
                <div className="about-text" >
                    <h2>About Us</h2>
                    <p>Everything you need to manage your healthcare journey with confidence and ease.</p>
                    <div className="cards">
                        <div className="card">
                            <h3>Smart & Adaptive reminders</h3>
                            <p>Intelligent push notifications & alarms to ensure that you never miss a dose,with snooze and rescheduling options.</p>
                        </div>
                        <div className="card">
                            <h3>AI Verification</h3>
                            <p>Scan your medications to ensure it matches your prescription using advanced AI Vision.</p>
                        </div>
                        <div className="card">
                            <h3>Risk Prediction</h3>
                            <p>AI analyzes your history to predict non-adherence risk and provides custom recommendations.</p>
                        </div>
                        <div className="card">
                            <h3>Caregiver Link</h3>
                            <p>Keep loved ones connected with real time adherence dashboards and critical alerts if not responded regularly.</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
