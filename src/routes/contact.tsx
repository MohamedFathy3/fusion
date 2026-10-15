import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  component: ContactLayout,
});

function ContactLayout() {
  return <Outlet />;
}
