import { Hourglass } from "react-loader-spinner";

const styles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  textAlign: "center",
};
function Loader() {
  return (
    <div style={styles}>
      <Hourglass
  visible={true}
  height="80"
  width="80"
  ariaLabel="hourglass-loading"
  wrapperStyle={{}}
  wrapperClass=""
  colors={['#ffff', '#72a1e0']}
  />
    </div>
  );
}

export default Loader;
