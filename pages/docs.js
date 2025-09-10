import dynamic from "next/dynamic";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function Docs() {
  return (
    <div style={{ height: "100vh" }}>
      <SwaggerUI url="/api/docs" />
    </div>
  );
}
