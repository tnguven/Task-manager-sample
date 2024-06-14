export function exitHandler(cb: () => void) {
  const handler = (err: Error) => {
    console.log("Server shutting down", err);
    cb();
  };

  ["SIGTERM", "SIGINT", "SIGUSR1", "SIGUSR2", "SIGHUP", "exit"].forEach((event) => {
    process.on(event, handler);
  });
}
