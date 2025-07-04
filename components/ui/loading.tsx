export function Loader() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div
        className="
          animate-spin
          h-10 w-10
          rounded-full
          border-4
          border-t-transparent
          border-primary
          shadow-lg
        "
        style={{
          borderTopColor: "transparent",
        }}
      />
    </div>
  );
}
