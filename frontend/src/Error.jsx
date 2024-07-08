/* eslint-disable react/prop-types */
import Alert from 'react-bootstrap/Alert';

const styles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width:"100%",
    height: "100vh",
    textAlign: "center",
  };

function BasicExample({error}) {
  return (
    <div style={styles}>
      {[
        'danger'
      ].map((variant) => (
        <Alert key={variant} variant={variant}>
           {error} 
        </Alert>
      ))}
    </div>
  );
}

export default BasicExample;