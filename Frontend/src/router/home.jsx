import { useState, useEffect } from "react"


function Home() {
    const [message, setMessage] = useState(null);

    useEffect(() => {
        setMessage("hello IMS");
    }, []); // empty dependency array → runs once after mount

    return(
        <div>
            <h1>SOME RANDOM TESTING STUFF</h1>
            {message && <div>{message}</div>}
        </div>
    );
}

export default Home;