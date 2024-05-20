import './Preloader.css';

const Preloader = () => {
    return (
        <div id="preloader" className="a-preloader-container" height='400'>
            <div className="a-preloader-logo">
                <img src="https://static.abraxa.com/images/logo.svg" alt="Abraxa" />
            </div>
            <div className="a-preloader">
                <svg className="a-preloader-spinner" viewBox="0 0 64 64">
                    <circle className="path" cx="32" cy="32" r="30" fill="none" strokeWidth="2.5"></circle>
                </svg>
                <div className="a-preloader-texts-wrap">
                    <div className="a-preloader-texts">
                        <div className="a-preloader-txt">Fetching data</div>
                        <div className="a-preloader-txt">Loading layouts</div>
                        <div className="a-preloader-txt">Please wait</div>
                        <div className="a-preloader-txt">Welcome to Abraxa</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;