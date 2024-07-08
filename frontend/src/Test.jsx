import "./Test.css";

function Test() {
    return (
        <div className="login-container">
            <form className="login-form">
                <label className="form-group">
                    Username:
                    <br/>
                    <input className="form-group"
                        type="text"
                        required
                    />
                </label>
                <label className="form-group">
                    Password:
                    <br/>
                    <input className="form-group"
                        type="password"
                        required
                    />
                </label>
                {/* <br/> */}
                <button  type="submit" className="form-group">Login</button>
            </form>
        </div>
    )
}

export default Test
