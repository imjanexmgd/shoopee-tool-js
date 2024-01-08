const terminalClear = () => {
  try {
    process.stdout.write('\x1Bc');
  } catch (error) {
    console.log(error);
  }
};
export default terminalClear;
