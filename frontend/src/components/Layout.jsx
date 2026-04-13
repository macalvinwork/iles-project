export default function Layout({ title, children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* SIDEBAR */}
      <div style={{
        width: "220px",
        background: "#1f2937",
        color: "white",
        padding: "20px"
      }}>
        <h3>ILES System</h3>

        <p>
          Role: {user?.role || "Guest"}
        </p>

        <hr />

        <button
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h2>{title}</h2>
        {children}
      </div>

    </div>
  );
}