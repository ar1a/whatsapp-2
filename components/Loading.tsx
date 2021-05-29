import { Circle } from "better-react-spinkit";
export default function Loading() {
  return (
    <div
      style={{
        display: "grid",
        height: "100vh",
        alignContent: "center",
        justifyItems: "center",
      }}
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/598px-WhatsApp.svg.png"
        alt=""
        style={{ marginBottom: 10 }}
        height={200}
      />
      <Circle color="#3CBC28" size={60} />
    </div>
  );
}
